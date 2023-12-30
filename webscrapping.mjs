const url = 'https://howlongtobeat.com/game/57445';
import * as cheerio from 'cheerio';

async function getPage(){
	const response = await fetch(url)
	const text = await response.text()
	const $ = cheerio.load(text)
	// console.log($.html())
	console.log($('ul li:first-child h5').text())
	console.log($('ul li:nth-child(3) h5').text())
}

getPage()