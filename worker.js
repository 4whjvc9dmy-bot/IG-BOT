const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

module.exports = async function run() {
  const accounts = JSON.parse(fs.readFileSync("data/accounts.json"));
  const settings = JSON.parse(fs.readFileSync("data/settings.json"));

  const files = fs.readdirSync("uploads");

  for (let acc of accounts) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://instagram.com/accounts/login/");
    await page.waitForTimeout(3000);

    await page.fill('input[name="username"]', acc.username);
    await page.fill('input[name="password"]', acc.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    const vids = files.sort(() => 0.5 - Math.random()).slice(0, 3);

    for (let v of vids) {
      const file = path.join("uploads", v);

      await page.click('svg[aria-label="New post"]');
      const input = await page.$('input[type="file"]');
      await input.setInputFiles(file);

      await page.waitForTimeout(4000);
      await page.click("text=Next");
      await page.click("text=Next");

      await page.fill("textarea", settings.hashtags);
      await page.click("text=Share");

      await page.waitForTimeout(8000);
    }

    await browser.close();
  }
};
