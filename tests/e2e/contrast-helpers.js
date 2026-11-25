// FR-8: axe leaves text over the artwork "incomplete", so this measures it from pixels.
// Each text is compared with the brightest (and darkest) pixel behind it, with the text itself hidden.

function collectTexts(page) {
  return page.evaluate(() => {
    const skip = '.site-header, .mobile-bar, .quiz-modal, [aria-hidden="true"]';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const items = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const element = node.parentElement;
      if (!node.textContent.trim() || element.closest(skip)) continue;
      const style = getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const size = Number.parseFloat(style.fontSize);
      const bold = Number(style.fontWeight) >= 700;
      items.push({
        text: node.textContent.trim().slice(0, 40),
        color: style.color,
        large: size >= 24 || (bold && size >= 18.66),
        rects: [...range.getClientRects()].map((rect) => ({
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })),
      });
    }
    return items;
  });
}

export async function measure(page) {
  const texts = await collectTexts(page);
  await page.addStyleTag({ content: '*, *::before, *::after { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; }' });

  const viewportHeight = page.viewportSize().height;
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const done = new Set();
  const failures = [];

  for (let y = 0; y < pageHeight; y += Math.floor(viewportHeight / 2)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    const scrollY = await page.evaluate(() => window.scrollY);
    const shot = (await page.screenshot()).toString('base64');
    const bands = await page.evaluate(() => {
      const header = document.querySelector('.site-header').getBoundingClientRect();
      const bar = document.querySelector('.mobile-bar');
      const barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : window.innerHeight;
      return { top: header.bottom, bottom: barTop };
    });

    const visible = texts
      .map((item, index) => ({ ...item, index, rects: item.rects.map((r) => ({ ...r, top: r.top - scrollY })) }))
      .filter((item) => !done.has(item.index) && item.rects.every((r) => r.top >= bands.top && r.top + r.height <= bands.bottom));

    const results = await page.evaluate(
      async ({ shot, visible }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${shot}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        const scale = image.width / window.innerWidth;

        const channel = (value) => {
          const c = value / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

        return visible.map((item) => {
          const [r, g, b] = item.color.match(/[\d.]+/g).map(Number);
          const text = luminance(r, g, b);
          let worst = Infinity;
          for (const rect of item.rects) {
            if (rect.width < 1 || rect.height < 1) continue;
            const data = context.getImageData(
              Math.floor(rect.left * scale),
              Math.floor(rect.top * scale),
              Math.max(1, Math.floor(rect.width * scale)),
              Math.max(1, Math.floor(rect.height * scale)),
            ).data;
            let min = 1;
            let max = 0;
            for (let i = 0; i < data.length; i += 4) {
              const l = luminance(data[i], data[i + 1], data[i + 2]);
              if (l < min) min = l;
              if (l > max) max = l;
            }
            worst = Math.min(worst, ratio(text, max), ratio(text, min));
          }
          return { index: item.index, text: item.text, large: item.large, ratio: worst };
        });
      },
      { shot, visible },
    );

    for (const result of results) {
      done.add(result.index);
      const needed = result.large ? 3 : 4.5;
      if (result.ratio < needed) failures.push(`${result.text} ${result.ratio.toFixed(2)} < ${needed}`);
    }
  }

  return { failures, measured: done.size, total: texts.length };
}
