const puppeteer = require('../powersync/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const DIAGRAMS = [
  {
    name: 'gambar_1_dsr_flowchart',
    title: 'GAMBAR 1: Bagan Alur Penelitian (Design Science Research - DSR 6 Tahap)'
  },
  {
    name: 'gambar_2_arsitektur_3tier',
    title: 'GAMBAR 2: Gambaran Umum Sistem PowerSync (Arsitektur 3-Tier)'
  },
  {
    name: 'gambar_3_use_case',
    title: 'GAMBAR 3: Diagram Use Case Sistem PowerSync'
  },
  {
    name: 'gambar_4_activity_diagram_fcfs',
    title: 'GAMBAR 4: Activity Diagram Alur Reservasi dan Antrean FCFS'
  },
  {
    name: 'gambar_5_erd_powersync',
    title: 'GAMBAR 5: Entity Relationship Diagram (ERD) Sistem PowerSync'
  }
];

async function renderDiagrams() {
  console.log('====================================================');
  console.log('   POWERSYNC PROPOSAL DIAGRAM GENERATOR & EXPORTER  ');
  console.log('====================================================\n');

  const dir = __dirname;
  const mermaidJsPath = path.join(dir, 'mermaid.min.js');
  if (!fs.existsSync(mermaidJsPath)) {
    throw new Error('mermaid.min.js not found in ' + dir);
  }
  const mermaidJsContent = fs.readFileSync(mermaidJsPath, 'utf8');

  console.log('Memulai browser headless (Puppeteer) dengan resolusi tinggi (scale 3x)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 2000,
    height: 2500,
    deviceScaleFactor: 3 // High resolution ~300 DPI for publication quality in MS Word
  });

  // Base HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>PowerSync Academic Diagram Renderer</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 24px;
          background-color: #FFFFFF;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          display: inline-block;
        }
        #wrapper {
          background-color: #FFFFFF;
          padding: 16px;
          display: inline-block;
          border-radius: 4px;
        }
        svg {
          background-color: #FFFFFF !important;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
        }
        /* Ensure crisp borders and readable labels */
        .node text, .label text, text {
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
        }
      </style>
      <script>${mermaidJsContent}</script>
      <script>
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
          fontSize: 12,
          securityLevel: 'loose',
          flowchart: {
            curve: 'basis',
            htmlLabels: true,
            useMaxWidth: false
          },
          er: {
            useMaxWidth: false
          }
        });

        window.renderMermaid = async function(id, code) {
          const container = document.getElementById('wrapper');
          container.innerHTML = '';
          const { svg } = await mermaid.render(id, code);
          container.innerHTML = svg;
          return svg;
        };
      </script>
    </head>
    <body>
      <div id="wrapper"></div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'load' });

  for (let i = 0; i < DIAGRAMS.length; i++) {
    const item = DIAGRAMS[i];
    console.log(`\n[${i + 1}/${DIAGRAMS.length}] Memproses: ${item.title}`);
    const mmdPath = path.join(dir, `${item.name}.mmd`);
    const svgPath = path.join(dir, `${item.name}.svg`);
    const pngPath = path.join(dir, `${item.name}.png`);

    if (!fs.existsSync(mmdPath)) {
      console.error(`File ${mmdPath} tidak ditemukan!`);
      continue;
    }

    const code = fs.readFileSync(mmdPath, 'utf8');

    try {
      const renderId = `svg_${item.name}_${Date.now()}`;
      const svg = await page.evaluate(async (id, mmdCode) => {
        return await window.renderMermaid(id, mmdCode);
      }, renderId, code);

      // Save SVG (Vector)
      fs.writeFileSync(svgPath, svg, 'utf8');
      console.log(`  -> Berhasil ekspor SVG: ${path.basename(svgPath)} (${(svg.length / 1024).toFixed(1)} KB)`);

      // Wait a moment for rendering and fonts
      await new Promise(r => setTimeout(r, 600));

      // Capture high-DPI PNG screenshot of the #wrapper element
      const element = await page.$('#wrapper');
      if (element) {
        let attempts = 0;
        let success = false;
        while (attempts < 5 && !success) {
          try {
            await element.screenshot({
              path: pngPath,
              omitBackground: false // Keep crisp pure white background
            });
            success = true;
            const stats = fs.statSync(pngPath);
            console.log(`  -> Berhasil ekspor PNG (300 DPI): ${path.basename(pngPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
          } catch (e) {
            attempts++;
            if (attempts >= 5) throw e;
            await new Promise(r => setTimeout(r, 800));
          }
        }
      } else {
        console.warn('  -> Wrapper element not found for screenshot!');
      }
    } catch (err) {
      console.error(`  [ERROR] Gagal merender ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('   SEMUA DIAGRAM TELAH BERHASIL DIRUMUSKAN & DIEKSPOR!  ');
  console.log('====================================================\n');
}

renderDiagrams().catch(err => {
  console.error('Fatal error during rendering:', err);
  process.exit(1);
});
