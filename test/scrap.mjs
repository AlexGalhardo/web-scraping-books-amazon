import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer'
import fs from 'fs'

const booksToFind = [
  'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916',
  'https://www.amazon.com.br/Sobre-brevidade-vida-Bil%C3%ADngue-marcador/dp/6556600164',
  'https://www.amazon.com.br/Manual-Epicteto-melhor-Bil%C3%ADngue-marcador/dp/6556600334'
]

const books = []

async function getBooksFromAmazon() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: false,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
      userDataDir: "./myuserdatadir",
    });
    const page = await browser.newPage();
    
    // Use setTimeout on the page's execution context
    const setTimeoutPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 2000); // Add a delay of 2 seconds
      });
    });

    booksToFind.forEach(async urlAmazon => {
      setTimeoutPromise
      await page.goto(urlAmazon, { waitUntil: 'domcontentloaded' });
      const content = await page.content();
      const $ = cheerio.load(content);

      const bookFound = {
        image: $('div#imgTagWrapperId img').attr('src'),
        title: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text(),
        subtitle: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text(),
        rating: $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title'),
        reviews: $('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text(),
        totalPages: $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim(),
        resume: $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim()
      }

      console.log(bookFound)

      books.push(bookFound)

      setTimeoutPromise
    })

    await browser.close();

    fs.writeFileSync('./books.json', books, 'utf-8', null)
  }
  catch(error){
    console.log('\n\n error => ', error)
  }
}

getBooksFromAmazon();