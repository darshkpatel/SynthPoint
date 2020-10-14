import React from 'react';
import Button from '../components/Button';

const puppeteer = require('puppeteer');

const iPhone = puppeteer.devices['iPhone X'];

describe('Landing Page', () => {
  test('Throws Mobile only Error Properly', async () => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 1920,
        height: 1080,
      },
      userAgent: '',
    });

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.titleText');

    const html = await page.$eval('.titleText', (e) => e.innerHTML);
    expect(html).toBe('<h1>Sorry, this app is only supported on mobile devices.</h1>');

    browser.close();
  }, 16000);

  test('Loads On Mobile Correctly', async () => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.emulate(iPhone);

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.App');

    const html = await page.$eval('#notes', (e) => e.innerHTML);
    expect(html).not.toBe(null);

    browser.close();
  }, 16000);
});
