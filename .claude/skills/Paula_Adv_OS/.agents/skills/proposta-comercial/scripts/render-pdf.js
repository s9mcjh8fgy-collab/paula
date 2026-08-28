// Renderiza uma sequência de slides HTML num PDF único, um slide por página.
// Uso: node render-pdf.js slide-01.html slide-02.html ... saida.pdf
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Uso: node render-pdf.js slide-01.html slide-02.html ... saida.pdf');
    process.exit(1);
  }
  const outputPath = path.resolve(args[args.length - 1]);
  const slidePaths = args.slice(0, -1).map((p) => path.resolve(p));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const pdfPaths = [];
  for (let i = 0; i < slidePaths.length; i++) {
    const slidePath = slidePaths[i];
    await page.goto(`file:///${slidePath.replace(/\\/g, '/')}`);
    const tmpPath = `${outputPath}.part${i}.pdf`;
    await page.pdf({
      path: tmpPath,
      width: '1920px',
      height: '1080px',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    pdfPaths.push(tmpPath);
  }
  await browser.close();

  const { PDFDocument } = require('pdf-lib');
  const merged = await PDFDocument.create();
  for (const p of pdfPaths) {
    const bytes = fs.readFileSync(p);
    const doc = await PDFDocument.load(bytes);
    const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((cp) => merged.addPage(cp));
    fs.unlinkSync(p);
  }
  const mergedBytes = await merged.save();
  fs.writeFileSync(outputPath, mergedBytes);
  console.log(`PDF gerado: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
