import puppeteer from 'puppeteer'

async function getTitle() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent('<span id="acrPopover" class="reviewCountTextLinkedHistogram noUnderline" title="4,8 de 5 estrelas"></span>');

  const title = await page.$eval('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline', (span) => span.getAttribute('title'));

  console.log(title);

  await browser.close();
}

getTitle();