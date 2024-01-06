import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import fs from 'fs'
import { randomUUID } from 'crypto';
import slugify from 'slugify';

const booksToFind = [
  'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916',
  'https://www.amazon.com.br/Sobre-brevidade-vida-Bil%C3%ADngue-marcador/dp/6556600164',
  'https://www.amazon.com.br/Manual-Epicteto-melhor-Bil%C3%ADngue-marcador/dp/6556600334',
  'https://www.amazon.com.br/Como-fazer-amigos-influenciar-pessoas-ebook/dp/B07YLX1NHY',
  'https://www.amazon.com.br/Watchmen-2019-English-Alan-Moore-ebook/dp/B07ST6DPBQ',
  'https://www.amazon.com.br/Ogiva-Graphic-Novel-Bruno-Zago/dp/6586672112',
  'https://www.amazon.com.br/Mundo-Sofia-Romance-Hist%C3%B3ria-Filosofia-ebook/dp/B00AC0ZIFA',
  'https://www.amazon.com.br/Hobbit-J-R-R-Tolkien-ebook/dp/B07S5FDTVK',
  'https://www.amazon.com.br/Alice-Maravilhas-atrav%C3%A9s-espelho-Carroll-ebook/dp/B09H29YNYR',
  'https://www.amazon.com.br/Conan-B%C3%A1rbaro-Livro-Robert-Howard-ebook/dp/B077TGBS69',
  'https://www.amazon.com.br/Grama-Keum-Suk-Gendry-Kim-ebook/dp/B08GQFMFMX',
  'https://www.amazon.com.br/Calafrios-Sele%C3%A7%C3%A3o-contos-favoritos-autor-ebook/dp/B0B89YRHGP',
  'https://www.amazon.com.br/Satsuma-Gishiden-Cr%C3%B4nicas-Leais-Guerreiros-ebook/dp/B08FVCX8HG',
  'https://www.amazon.com.br/Conan-B%C3%A1rbaro-Livro-Robert-Howard-ebook/dp/B07GX9YR93',
  'https://www.amazon.com.br/Conan-B%C3%A1rbaro-Livro-Robert-Howard-ebook/dp/B07WFH8RKZ',
  'https://www.amazon.com.br/Peda%C3%A7o-Madeira-A%C3%A7o-Christophe-Chabout%C3%A9-ebook/dp/B07D3F7WLM',
  'https://www.amazon.com.br/Tartarugas-Ninja-Cole%C3%A7ao-Cl%C3%A1ssica-Vol-ebook/dp/B08KBJBSR5',
  'https://www.amazon.com.br/Voz-do-Sil%C3%AAncio-Helena-Blavatsky-ebook/dp/B00EO8KF8Q',
  'https://www.amazon.com.br/Luz-%C3%81sia-Edwin-Arnold-ebook/dp/B08C83FY11',
  'https://www.amazon.com.br/mito-S%C3%ADsifo-Albert-Camus-ebook/dp/B07STT5WQG',
  'https://www.amazon.com.br/coisas-que-voc%C3%AA-quando-desacelera-ebook/dp/B075NTMDR3',
  'https://www.amazon.com.br/Modernidade-l%C3%ADquida-Zygmunt-Bauman-ebook/dp/B008PD6V4I',
  'https://www.amazon.com.br/Sociedade-do-cansa%C3%A7o-Byung-Chul-Han-ebook/dp/B01FUORLQQ',
  'https://www.amazon.com.br/Seja-ego%C3%ADsta-com-sua-carreira-ebook/dp/B09HSKN3WC',
  'https://www.amazon.com.br/Eu-Robo-Isaac-Asimov-ebook/dp/B015EED2O2',
  'https://www.amazon.com.br/fim-eternidade-Isaac-Asimov-ebook/dp/B015EEAIH6',
  'https://www.amazon.com.br/Box-Funda%C3%A7%C3%A3o-Trilogia-Isaac-Asimov-ebook/dp/B07PW57BK8',
  'https://www.amazon.com.br/Os-eg%C3%ADpcios-origens-destino-civiliza%C3%A7%C3%A3o-ebook/dp/B09BRFRB3X',
  'https://www.amazon.com.br/Cavernas-A%C3%A7o-S%C3%A9rie-Rob%C3%B4s-Livro-ebook/dp/B015EEAHB8',
  'https://www.amazon.com.br/Rob%C3%B4s-Alvorada-S%C3%A9rie-dos-Livro-ebook/dp/B07FP1QWN9',
  'https://www.amazon.com.br/Rob%C3%B4s-Imp%C3%A9rio-S%C3%A9rie-rob%C3%B4s-Livro-ebook/dp/B09VVXZDVP',
  'https://www.amazon.com.br/Buddha-Kapilavastu-English-Osamu-Tezuka-ebook/dp/B074MFTJCJ',
  'https://www.amazon.com.br/Buddha-Ananda-English-Osamu-Tezuka-ebook/dp/B076ZM28QS',
  'https://www.amazon.com.br/Buddha-5-Deer-Park-English-ebook/dp/B076ZKGC9D',
  'https://www.amazon.com.br/Buddha-7-Prince-Ajatasattu-English-ebook/dp/B076ZS1P98',
  'https://www.amazon.com.br/Buddha-2-Four-Encounters-English-ebook/dp/B074MFD4XH',
  'https://www.amazon.com.br/Buddha-4-Forest-Uruvela-English-ebook/dp/B074MFZSBZ',
  'https://www.amazon.com.br/Buddha-Jetavana-English-Osamu-Tezuka-ebook/dp/B076ZXRQ6M',
  'https://www.amazon.com.br/Buddha-Devadatta-English-Osamu-Tezuka-ebook/dp/B074MG8JPM',
  'https://www.amazon.com.br/Tra%C3%A7o-Giz-Miguelanxo-Prado-ebook/dp/B08QVHQWNB',
  'https://www.amazon.com.br/Ensaio-sobre-cegueira-Jos%C3%A9-Saramago-ebook/dp/B00LUU7SUO',
  'https://www.amazon.com.br/profeta-Khalil-Gibran-ebook/dp/B07PJV1LGK',
  'https://www.amazon.com.br/Louco-Khalil-Gibran-ebook/dp/B09VG3F79J',
  'https://www.amazon.com.br/Sobre-brevidade-vida-firmeza-s%C3%A1bio-ebook/dp/B0719CZZKV',
  'https://www.amazon.com.br/Dhammapada-Caminho-do-Darma-An%C3%B4nimo-ebook/dp/B07K1K2H4B',
  'https://www.amazon.com.br/Lord-Rings-Fellowship-Towers-English-ebook/dp/B002RI9176',
  'https://www.amazon.com.br/Box-Trilogia-Senhor-dos-An%C3%A9is-ebook/dp/B07XLVGMWZ',
  'https://www.amazon.com.br/Thousand-Collected-Joseph-Campbell-English-ebook/dp/B08MWW2VDL',
  'https://www.amazon.com.br/pequeno-pr%C3%ADncipe-original-Antoine-Saint-Exup%C3%A9ry-ebook/dp/B00BP93VDS',
  'https://www.amazon.com.br/Di%C3%A1rio-Estoico-Li%C3%A7%C3%B5es-Sabedoria-Perseveran%C3%A7a-ebook/dp/B09N41Q5MS',
  'https://www.amazon.com.br/psicologia-financeira-atemporais-gan%C3%A2ncia-felicidade-ebook/dp/B08WBXHFBL',
  'https://www.amazon.com.br/Um-Bairro-Distante-Mang%C3%A1-%C3%9Anico/dp/6586672929',
  'https://www.amazon.com.br/Sandman-Vol-Preludes-Nocturnes-Anniversary-ebook/dp/B07J568M42',
  'https://www.amazon.com.br/Longer-Human-English-Osamu-Dazai-ebook/dp/B0099JIU82',
  'https://www.amazon.com.br/Longer-Human-Complete-manga-English-ebook/dp/B09WH7KNBB',
  'https://www.amazon.com.br/Tao-Te-Ching-Caminho-Virtude-ebook/dp/B00D9EAV58',
  'https://www.amazon.com.br/Dom-Quixote-1-Miguel-Cervantes-ebook/dp/B08LSZ5YN3',
  'https://www.amazon.com.br/extraordin%C3%A1rias-viagens-Cl%C3%A1ssicos-literatura-mundial-ebook/dp/B08Z4CRCG4',
  'https://www.amazon.com.br/Jornada-Escritor-Estrutura-m%C3%ADtica-escritores-ebook/dp/B015EEALPK',
  'https://www.amazon.com.br/Clean-Code-Handbook-Software-Craftsmanship-ebook/dp/B001GSTOAM',
  'https://www.amazon.com.br/Felicidade-Ci%C3%AAncia-pr%C3%A1tica-para-feliz-ebook/dp/B0B9HW5QP9',
  'https://www.amazon.com.br/mundo-assombrado-pelos-dem%C3%B4nios-ci%C3%AAncia-ebook',
  'https://www.amazon.com.br/busca-mesmos-Cl%C3%B3vis-Barros-Filho-ebook/dp/B077Z6HVKY',
  'https://www.amazon.com.br/Surely-Youre-Joking-Mr-Feynman-ebook/dp/B003V1WXKU',
  'https://www.amazon.com.br/Old-Man-Sea-English-ebook/dp/B000FC0SH8',
  'https://www.amazon.com.br/l%C3%B3gica-Cisne-Edi%C3%A7%C3%A3o-revista-ampliada-ebook/dp/B094RC6F3C',
  'https://www.amazon.com.br/Origin-Novel-Robert-Langdon-English-ebook/dp/B01LY7FD0D',
  'https://www.amazon.com.br/C%C3%B3digo-Vinci-Robert-Langdon-ebook/dp/B00A3CR0AI',
  'https://www.amazon.com.br/Anjos-dem%C3%B4nios-Robert-Langdon-Brown-ebook/dp/B00A3D922Q',
  'https://www.amazon.com.br/Inferno-Robert-Langdon-Dan-Brown-ebook/dp/B00C7U28GA',
  'https://www.amazon.com.br/S%C3%ADmbolo-Perdido-Robert-Langdon-ebook/dp/B00DSPGH1U',
  'https://www.amazon.com.br/batalha-do-Apocalipse-Eduardo-Spohr-ebook/dp/B00A3CSWOQ',
  'https://www.amazon.com.br/Divina-Com%C3%A9dia-Dante-Alighieri-ebook/dp/B07R9MFH52',
  'https://www.amazon.com.br/Communication-Engineers-developers-communicators-productivity-ebook/dp/B08W8MJNF8',
  'https://www.amazon.com.br/Staff-Engineer-Leadership-management-English-ebook/dp/B08RMSHYGG',
  'https://www.amazon.com.br/problema-dos-tr%C3%AAs-corpos/dp/8556510205',
  'https://www.amazon.com.br/floresta-sombria-Cixin-Liu/dp/8556510507',
  'https://www.amazon.com.br/fim-morte-3-Cixin-Liu/dp/8556510744',
  'https://www.amazon.com.br/Starsight-Veja-al%C3%A9m-das-estrelas/dp/8542219600',
  'https://www.amazon.com.br/Skyward-Conquiste-estrelas-Brandon-Sanderson-ebook/dp/B07KW9X5XQ',
  'https://www.amazon.com.br/sol-%C3%A9-para-todos/dp/8503009498',
  'https://www.amazon.com.br/nome-do-vento-Patrick-Rothfuss/dp/8599296493',
  'https://www.amazon.com.br/temor-do-s%C3%A1bio-Patrick-Rothfuss/dp/8580410320',
  'https://www.amazon.com.br/m%C3%BAsica-do-sil%C3%AAncio-Patrick-Rothfuss/dp/8580413532',
  'https://www.amazon.com.br/Maus-Art-Spiegelman/dp/8535906282',
  'https://www.amazon.com.br/Alquimista-Paulo-Coelho-ebook/dp/B00AQI6C6M',
  'https://www.amazon.com.br/Ponto-impacto-Dan-Brown-ebook/dp/B00A3D9K28',
  'https://www.amazon.com.br/Fortaleza-digital-Dan-Brown-ebook/dp/B00Y14YVBK/'
];

const books = [];
const authors = [];
const publishers = [];

function getNow() {
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR');
    return `${date} ${time}`;
}

async function getBooksFromAmazon() {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  for (const urlAmazon of booksToFind) {
    const page = await browser.newPage();

    try {
      await page.goto(urlAmazon, { waitUntil:  'domcontentloaded' }); // 'domcontentloaded', networkidle2,
      const content = await page.content();
      const $ = cheerio.load(content);

      $('div#detailBullets_feature_div ul.detail-bullet-list li span.a-text-bold:contains("Ranking dos mais vendidos") + ul.zg_hrsr li span.a-list-item a').each(function () {
          categories.push({
            id: randomUUID(),
            name: $(this).text().trim(),
            slug: slugify($(this).text().trim(), {
              lower: true,
              strict: true
            }),
          });
      });

      const elementAuthor = 
          $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")').closest('span.author').find('a.a-link-normal').text().trim() !== '' ? 
            $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")').closest('span.author').find('a.a-link-normal').text().trim() 
            : 
            $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")').closest('span.author').find('a.a-link-normal').text().trim()

      function getAuthor(){
        if($('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")').closest('span.author').find('a.a-link-normal').text().trim()  !== '')
          return $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")').closest('span.author').find('a.a-link-normal').text().trim() 
        
        if($('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")').closest('span.author').find('a.a-link-normal').text().trim() !== '')
          return $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")').closest('span.author').find('a.a-link-normal').text().trim()
        
        if($('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Ilustrador)")').closest('span.author').find('a.a-link-normal').text().trim() !== '')
          return $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Ilustrador)")').closest('span.author').find('a.a-link-normal').text().trim()
      }

      const author = {
        id: randomUUID(),
        name: getAuthor(),
        slug: slugify(getAuthor() ?? elementAuthor, {
          lower: true,
          strict: true
        }),
      }

      function getPublisher(){
        if($('#rpi-attribute-book_details-publisher .rpi-attribute-value span').text().trim() !== null)
          return $('#rpi-attribute-book_details-publisher .rpi-attribute-value span').text().trim()

        if($('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim() !== '')
          return $('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim()

        return null
      }

      const publisher = {
        id: randomUUID(),
        name: getPublisher(),
        slug: slugify(getPublisher(), {
          lower: true,
          strict: true
        })
      }

      function getTotalPages(){
        if($('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim() !== '')
          return $('div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)').text().trim()
        
        if($('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim() !== '')
          return $('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)').text().trim()
        
        if($('div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)').text().trim() !== '')
          return $('div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)').text().trim()
      }
      
      const bookFound = {
        id: randomUUID(),
        title: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text().trim(),
        slug: slugify($('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle').text().trim(), {
          lower: true,
          strict: true
        }),
        cover_image: $('div#imgTagWrapperId img').attr('src'),
        link_amazon: urlAmazon,
        customer_reviews_link: `${urlAmazon}#customerReviews`,
        subtitle: $('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle').text().trim(),
        release_date: $('div#rpi-attribute-book_details-publication_date div.rpi-attribute-value').text().trim(),
        rating: {
          score: $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title') ? $('span#acrPopover.reviewCountTextLinkedHistogram.noUnderline').attr('title').replace(' de 5 estrelas', '') : null,
          total_customer_reviews: $('a#acrCustomerReviewLink:first span#acrCustomerReviewText:first').text().replace('avaliações de clientes', '').trim(),
        },
        total_pages: getTotalPages(),
        author,
        publisher,
        // categories,
        summary: 
          $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() !== '' ? 
            $('div#drengr_desktopTabbedDescriptionOverviewContent_feature_div').text().trim() : 
            $('div#drengr_DesktopTabbedDescriptionOverviewContent_feature_div').text().trim(),
        created_at: new Date(),
        updated_at: null,
        created_at_pt_br: getNow(),
        updated_at_pt_br: null
      }

      books.push(bookFound);
      if(!authors.some(item => item.slug === author.slug)){
			  authors.push(author)
		  }
      if(!publishers.some(item => item.slug === publisher.slug)){
			  publishers.push(publisher)
		  }
    } catch (error) {
      console.error(`Error processing ${urlAmazon}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const booksJSON = JSON.stringify(books, 'utf-8', null, 4)
  const authorsJSON = JSON.stringify(authors, 'utf-8', null, 4)
  const publishersJSON = JSON.stringify(publishers, 'utf-8', null, 4)

  fs.writeFileSync('./JSONS/BOOKS.json', booksJSON, 'utf-8', 4)
  fs.writeFileSync('./JSONS/AUTHORS.json', authorsJSON, 'utf-8', 4)
  fs.writeFileSync('./JSONS/PUBLISHERS.json', publishersJSON, 'utf-8', 4)

  console.log(books);
}

getBooksFromAmazon()