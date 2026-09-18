import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const outputDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const baseUrl = 'http://localhost:4173/';
  console.log(`Navigating to ${baseUrl}...`);

  await page.goto(baseUrl);
  await page.waitForTimeout(2000);

  // 1. Patient Directory
  await page.screenshot({ path: path.join(outputDir, '01_patient_directory.png') });
  console.log('Saved 01_patient_directory.png');

  // 2. Patient Profile & Odontogram
  await page.locator('button:has-text("View Chart")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '02_patient_profile_odontogram.png') });
  console.log('Saved 02_patient_profile_odontogram.png');

  // 3. Document Vault
  await page.locator('button:has-text("Document Vault")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '03_document_center_xray.png') });
  console.log('Saved 03_document_center_xray.png');

  // 4. Appointment Schedule
  await page.locator('nav button:has-text("Appointment Schedule")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '04_appointment_schedule.png') });
  console.log('Saved 04_appointment_schedule.png');

  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);
