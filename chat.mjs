import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import fs from 'fs'
import { setTimeout } from "node:timers/promises";

const booksToFind = [
  'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916',
  'https://www.amazon.com.br/Sobre-brevidade-vida-Bil%C3%ADngue-marcador/dp/6556600164',
  'https://www.amazon.com.br/Manual-Epicteto-melhor-Bil%C3%ADngue-marcador/dp/6556600334',
  'https://www.amazon.com.br/Como-fazer-amigos-influenciar-pessoas-ebook/dp/B07YLX1NHY',
  'https://www.amazon.com.br/Watchmen-2019-English-Alan-Moore-ebook/dp/B07ST6DPBQ',
  'https://www.amazon.com.br/Ogiva-Graphic-Novel-Bruno-Zago/dp/6586672112',
  'https://www.amazon.com.br/Mundo-Sofia-Romance-Hist%C3%B3ria-Filosofia-ebook/dp/B00AC0ZIFA',
  'https://www.amazon.com.br/Hobbit-J-R-R-Tolkien-ebook/dp/B07S5FDTVK',
  'https://www.amazon.com.br/Alice-no-Pa%C3%ADs-das-Maravilhas-ebook/dp/B07RL3K8ZM'
];

const books = [];

async function getBooksFromAmazon() {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  for (const urlAmazon of booksToFind) {
    const page = await browser.newPage();

    try {
      await page.goto(urlAmazon, { waitUntil:  'domcontentloaded' }); // 'domcontentloaded', networkidle2,
      await setTimeout(1000);
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const bookFound = {
        linkAmazon: urlAmazon,
        customerReviewsLink: `${urlAmazon}#customerReviews`,
        image: $('div#imgTagWrapperId img').attr('src'),
        title: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text().trim(),
        subtitle: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text().trim(),
        releaseDate: $('div#rpi-attribute-book_details-publication_date div.rpi-attribute-value').text().trim(),
        rating: $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title').replace(' de 5 estrelas', ''),
        totalCustomersReviews: $('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text().replace('avaliações de clientes', '').trim(),
        totalPages: 
          $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim() !== '' ? 
            $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim() : 
            $('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim(),
        resume: 
          $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() !== '' ? 
            $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() : 
            $('div#drengr_DesktopTabbedDescriptionOverviewContent_feature_div').text().trim()
      }

      books.push(bookFound);
    } catch (error) {
      console.error(`Error processing ${urlAmazon}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const booksJSON = JSON.stringify(books, 'utf-8', null, 4)

  fs.writeFileSync('./books.json', booksJSON, 'utf-8', 4)

  console.log(books);
}

getBooksFromAmazon()