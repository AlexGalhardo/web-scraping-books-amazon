const url = 'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916';
import * as cheerio from 'cheerio';

async function getPage(){
	const response = await fetch(url)
	const text = await response.text()
	const $ = cheerio.load(text)
  console.log($('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal').text());
}

getPage()

