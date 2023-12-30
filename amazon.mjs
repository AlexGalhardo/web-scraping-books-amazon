const url = 'https://www.amazon.com.br/Medita%C3%A7%C3%B5es-Marco-Aur%C3%A9lio/dp/8552100916';
import * as cheerio from 'cheerio';

async function getPage(){
	const response = await fetch(url)
	const text = await response.text()
	const $ = cheerio.load(text)
  console.log($('div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal').text());
}

getPage()

// <div class="a-section a-spacing-none"> <h1 id="title" class="a-spacing-none a-text-normal"> <span id="productTitle" class="a-size-extra-large celwidget" data-csa-c-id="cmx8kp-39fsdj-u18aza-s82ku3" data-cel-widget="productTitle">  Meditações: Edição com postais + marcador (Coleção Grandes Mestres do Estoicismo) </span>  <span id="productSubtitle" class="a-size-large a-color-secondary celwidget" data-csa-c-id="89roih-20escj-wyjcnr-ollxgu" data-cel-widget="productSubtitle">  Capa comum – Edição especial, 31 outubro 2019 </span>  </h1> </div>

