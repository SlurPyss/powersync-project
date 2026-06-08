import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Define the output directory relative to the script location (parent folder, sibling to screenshots_final_ui)
const outDir = path.resolve('../screenshots_bab4_FINAL');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function takeBab4Screenshots() {
    console.log('Starting puppeteer for Bab 4 screenshots...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        defaultViewport: { width: 1366, height: 900, deviceScaleFactor: 2 } // Use higher device scale factor for clearer text and numbers
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to http://localhost:5173/topsis-report...');
        await page.goto('http://localhost:5173/topsis-report', { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        // Hide navigation header so it never overlaps tables
        console.log('Hiding header/navbar...');
        await page.evaluate(() => {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = 'none';
        });

        // 1. Matriks Keputusan Ternormalisasi
        console.log('Capturing 05a_matriks_keputusan_ternormalisasi.png...');
        const normalisasiEl = await page.$('#hasil-normalisasi');
        if (normalisasiEl) {
            await normalisasiEl.screenshot({ path: path.join(outDir, '05a_matriks_keputusan_ternormalisasi.png') });
            console.log('Saved 05a_matriks_keputusan_ternormalisasi.png');
        } else {
            console.warn('Could not find element #hasil-normalisasi');
        }

        // 2. Matriks Ternormalisasi Terbobot
        console.log('Capturing 05b_matriks_ternormalisasi_terbobot.png...');
        const terbobotEl = await page.$('#hasil-terbobot');
        if (terbobotEl) {
            await terbobotEl.screenshot({ path: path.join(outDir, '05b_matriks_ternormalisasi_terbobot.png') });
            console.log('Saved 05b_matriks_ternormalisasi_terbobot.png');
        } else {
            console.warn('Could not find element #hasil-terbobot');
        }

        // 3. Solusi Ideal Positif & Negatif
        console.log('Capturing 05c_solusi_ideal_positif_negatif.png...');
        const solusiIdealEl = await page.$('#solusi-ideal');
        if (solusiIdealEl) {
            await solusiIdealEl.screenshot({ path: path.join(outDir, '05c_solusi_ideal_positif_negatif.png') });
            console.log('Saved 05c_solusi_ideal_positif_negatif.png');
        } else {
            console.warn('Could not find element #solusi-ideal');
        }

        // 4. Nilai Preferensi (V) dan Jarak Ideal (D+, D-) for complete validation
        console.log('Capturing 05d_nilai_preferensi.png...');
        const preferensiEl = await page.$('#nilai-preferensi');
        if (preferensiEl) {
            await preferensiEl.screenshot({ path: path.join(outDir, '05d_nilai_preferensi.png') });
            console.log('Saved 05d_nilai_preferensi.png');
        }

        // 5. Hasil Ranking Akhir
        console.log('Capturing 05e_hasil_ranking.png...');
        const rankingEl = await page.$('#hasil-ranking');
        if (rankingEl) {
            await rankingEl.screenshot({ path: path.join(outDir, '05e_hasil_ranking.png') });
            console.log('Saved 05e_hasil_ranking.png');
        }

        console.log(`All Bab 4 screenshots captured successfully in: ${outDir}`);
    } catch (err) {
        console.error('Error taking screenshots:', err);
    } finally {
        await browser.close();
    }
}

takeBab4Screenshots();
