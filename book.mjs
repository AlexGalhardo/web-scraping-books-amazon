import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer'

const booksToFind = [
  'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916',
  'https://www.amazon.com.br/Sobre-brevidade-vida-Bil%C3%ADngue-marcador/dp/6556600164',
  'https://www.amazon.com.br/Manual-Epicteto-melhor-Bil%C3%ADngue-marcador/dp/6556600334'
]

const categories = []

async function getBooksFromAmazon() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // booksToFind.forEach(urlAmazon => {

  // })


  await page.goto('https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916', { waitUntil: 'domcontentloaded' });
  // https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916#customerReviews
  const content = await page.content();
  const $ = cheerio.load(content);

  const titulo = $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text()
  const subtitulo = $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text()
  const estrelas = $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title')
  const totalAvaliacoes = $('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text()
  const resumo = $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim()
  const pages = $('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim()
  const image = $('div#imgTagWrapperId img').attr('src')

  // console.log($('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text());
  // console.log($('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text());
  // console.log($('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title'));
  // console.log($('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text());
  // console.log($('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim())
  // console.log($('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim())
  // console.log($('div#imgTagWrapperId img').attr('src'))

  // const categoryes = $('ul.detail-bullet-list:has(span.a-text-bold:contains("Ranking dos mais vendidos")) ul.zg_hrsr li span.a-list-item a')
  // console.log('\n\n categoryes => ', categoryes)

    $('ul.detail-bullet-list:contains("Ranking dos mais vendidos") ul.zg_hrsr li').each(function () {
    var category = $(this).find('span.a-list-item a').text().trim();
    if (category !== "") {
        categories.push(category);
    }
});

  console.log({
    // category: $('div#zeitgeistBadge_feature_div span.cat-link').text().trim(),
    // releaseDate: $('div#rpi-attribute-book_details-publication_date div.rpi-attribute-value').text().trim(),
    // image: $('div#imgTagWrapperId img').attr('src'),
    // title: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text(),
    // subtitle: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text(),
    // rating: $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title'),
    // reviews: $('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text(),
    // totalPages: 
    //   $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim() !== '' ? 
    //     $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim() : 
    //     $('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim(),
    sumary: 
          $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() !== '' ? 
            $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() : 
            $('div#drengr_DesktopTabbedDescriptionOverviewContent_feature_div').text().trim(),
  })


  await browser.close();
}

getBooksFromAmazon();