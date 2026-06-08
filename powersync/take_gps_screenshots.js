import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('../screenshots_gps_distance');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function runGpsScreenshots() {
    console.log('Starting Puppeteer for GPS Distance features...');
    
    // Launch browser
    const browser = await puppeteer.launch({ 
        headless: "new",
        defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 2 }
    });
    
    try {
        const context = browser.defaultBrowserContext();
        const page = await browser.newPage();
        
        // --- 1. Catalog BEFORE GPS is activated ---
        console.log('Capturing 01_catalog_before_gps.png...');
        await page.goto('http://localhost:5173/catalog', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '01_catalog_before_gps.png') });

        // --- 2. GPS Permission Denied / Error Fallback ---
        console.log('Capturing 02_gps_permission_denied.png...');
        // We deny geolocation permission in this context
        await context.overridePermissions('http://localhost:5173', []); // clear/deny permissions
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));
        
        // Find and click Use My Location button to trigger denial
        const gpsButton = await page.$('button::-p-text(Gunakan Lokasi Saya)');
        if (gpsButton) {
            await gpsButton.click();
            await new Promise(r => setTimeout(r, 1500)); // wait for fallback and warning text
            await page.screenshot({ path: path.join(outDir, '02_gps_permission_denied.png') });
        } else {
            console.warn('GPS button not found for denial test');
        }

        // --- 3. GPS Allowed (Mock Coordinates) ---
        console.log('Capturing 03_catalog_after_gps.png...');
        // Override context to grant geolocation
        await context.overridePermissions('http://localhost:5173', ['geolocation']);
        // Mock a user coordinate (let's set it near Batam Center, e.g. 1.1350, 104.0400)
        await page.setGeolocation({ latitude: 1.1350, longitude: 104.0400 });
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000));

        // Click the GPS button to trigger mock calculations
        const gpsButtonActive = await page.$('button::-p-text(Gunakan Lokasi Saya)');
        if (gpsButtonActive) {
            await gpsButtonActive.click();
            await new Promise(r => setTimeout(r, 2000)); // wait for distance calculations
            await page.screenshot({ path: path.join(outDir, '03_catalog_after_gps.png') });
        }

        // --- 4. Station Detail with real-time distance ---
        console.log('Capturing 04_detail_realtime.png...');
        // Navigate to stasiun A1 (Nagoya Hill) details page
        await page.goto('http://localhost:5173/station/A1', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '04_detail_realtime.png') });

        // --- 5. TOPSIS Ranking using GPS Distances ---
        console.log('Capturing 05_topsis_gps_ranking.png...');
        await page.goto('http://localhost:5173/topsis-report', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        
        // Hide navigation header
        await page.evaluate(() => {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = 'none';
        });
        
        await page.screenshot({ path: path.join(outDir, '05_topsis_gps_ranking.png') });

        // --- 6. Mobile View ---
        console.log('Capturing 06_mobile_view.png...');
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
        await page.goto('http://localhost:5173/catalog', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(outDir, '06_mobile_view.png') });

        console.log(`All GPS screenshots saved in: ${outDir}`);

    } catch (err) {
        console.error('Error running screenshots script:', err);
    } finally {
        await browser.close();
    }
}

runGpsScreenshots();
