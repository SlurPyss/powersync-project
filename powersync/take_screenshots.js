import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('../screenshots_final_ui');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function takeScreenshots() {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        defaultViewport: { width: 1366, height: 768, deviceScaleFactor: 1 }
    });
    const page = await browser.newPage();

    try {
        // 01. Home / Dashboard
        console.log('Capturing 01_home_dashboard.png...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '01_home_dashboard.png'), fullPage: false });

        // 02. Data Table (Admin Panel) 
        console.log('Capturing 02_data_table.png...');
        await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '02_data_table.png'), fullPage: false });

        // 03. Form Input (Station Detail Page)
        console.log('Capturing 03_form_input.png...');
        await page.goto('http://localhost:5173/station/station_1', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        // Scroll down to see the booking form
        await page.evaluate(() => window.scrollTo(0, 400));
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: path.join(outDir, '03_form_input.png'), fullPage: false });

        // 04. Ranking Section (TOPSIS Report)
        console.log('Capturing 04_ranking_section.png...');
        await page.goto('http://localhost:5173/topsis-report', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        // Hide navbar
        await page.evaluate(() => {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = 'none';
        });
        const rankingEl = await page.$('#hasil-ranking');
        if (rankingEl) {
            await rankingEl.screenshot({ path: path.join(outDir, '04_ranking_section.png') });
        }

        // 05. Detail Recommendation
        console.log('Capturing 05_detail_recommendation.png...');
        const detailEl = await page.$('#detail-rekomendasi');
        if (detailEl) {
            await detailEl.screenshot({ path: path.join(outDir, '05_detail_recommendation.png') });
        }

        // 06. Mobile View
        console.log('Capturing 06_mobile_view.png...');
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '06_mobile_view.png'), fullPage: false });

        // 07. Tablet View
        console.log('Capturing 07_tablet_view.png...');
        await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1.5 });
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '07_tablet_view.png'), fullPage: false });

        console.log('All screenshots captured successfully in /screenshots_final_ui!');
    } catch (err) {
        console.error('Error taking screenshots:', err);
    } finally {
        await browser.close();
    }
}

takeScreenshots();
