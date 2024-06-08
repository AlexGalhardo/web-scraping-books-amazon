import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
import { randomUUID } from "node:crypto";
import slugify from "slugify";
import booksToFind from "./booksToFind.ts";

interface publisher {
	id: string
	name: string
	slug: string
}

interface author {
	id: string
	name: string
	slug: string
}

interface book {
	id: string
	title: string
	slug: string
	cover_image: string
	link_amazon: string
	customer_reviews_link: string
	subtitle: string
	release_date: string
	rating: {
		score: string
		total_customer_reviews: string
	}
	total_pages: string
	author: author
	publisher: publisher
	summary: string
	created_at: string
	updated_at: string
}

const books: book[] = [];
const authors: author[] = [];
const publishers: publisher[] = [];

async function getBooksFromAmazon() {

	console.log(`\n\n\n...Starting web scrapping on amazon.com.br for ${booksToFind.length} books...`)

	const browser = await puppeteer.launch({
		headless: "shell",
	});

	for (const [index, urlAmazon] of booksToFind.entries()) {

		console.log(`\n...[${index}] Getting info from  URL: ` + urlAmazon)

		const page = await browser.newPage();

		try {
			await page.goto(urlAmazon, { waitUntil: "domcontentloaded" }); // 'domcontentloaded', networkidle2,
			const content = await page.content();
			const $ = cheerio.load(content);

			const elementAuthor =
				$('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")')
					.closest("span.author")
					.find("a.a-link-normal")
					.text()
					.trim() !== ""
					? $(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim()
					: $(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim();

			function getAuthor() {
				if (
					$(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim() !== ""
				)
					return $(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim();

				if (
					$(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim() !== ""
				)
					return $(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim();

				if (
					$(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Ilustrador)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim() !== ""
				)
					return $(
						'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Ilustrador)")',
					)
						.closest("span.author")
						.find("a.a-link-normal")
						.text()
						.trim();
			}

			const author: author = {
				id: randomUUID(),
				name: getAuthor() ?? elementAuthor,
				slug: slugify(getAuthor() ?? elementAuthor, {
					lower: true,
					strict: true,
				}),
			};

			function getPublisher() {
				if ($("#rpi-attribute-book_details-publisher .rpi-attribute-value span").text().trim() !== null)
					return $("#rpi-attribute-book_details-publisher .rpi-attribute-value span").text().trim();

				if ($('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim() !== "")
					return $('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim();

				return '';
			}

			const publisher = {
				id: randomUUID(),
				name: getPublisher(),
				slug: slugify(getPublisher(), {
					lower: true,
					strict: true,
				}),
			};

			function getTotalPages() {
				if (
					$(
						'div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)',
					)
						.text()
						.trim() !== ""
				)
					return $(
						'div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)',
					)
						.text()
						.trim();

				if (
					$('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)')
						.text()
						.trim() !== ""
				)
					return $(
						'div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)',
					)
						.text()
						.trim();

				if (
					$('div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)')
						.text()
						.trim() !== ""
				)
					return $(
						'div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)',
					)
						.text()
						.trim();
			}

			const bookFound: book = {
				id: randomUUID(),
				title: $("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle")
					.text()
					.trim(),
				slug: slugify(
					$("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle").text().trim(),
					{
						lower: true,
						strict: true,
					},
				),
				cover_image: $("div#imgTagWrapperId img").attr("src") ?? "",
				link_amazon: urlAmazon,
				customer_reviews_link: `${urlAmazon}#customerReviews`,
				subtitle: $("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle")
					.text()
					.trim(),
				release_date: $("div#rpi-attribute-book_details-publication_date div.rpi-attribute-value")
					.text()
					.trim(),
				rating: {
					score: $("span#acrPopover.reviewCountTextLinkedHistogram.noUnderline").attr("title")
						? $("span#acrPopover.reviewCountTextLinkedHistogram.noUnderline")
							.attr("title")
							?.replace(" de 5 estrelas", "") as string
						: "",
					total_customer_reviews: $("a#acrCustomerReviewLink:first span#acrCustomerReviewText:first")
						.text()
						.replace("avaliações de clientes", "")
						.trim(),
				},
				total_pages: getTotalPages() ?? "",
				author,
				publisher,
				summary:
					$("div#drengr_desktopTabbedDescriptionOverviewContent_feature_div").text().trim() !== ""
						? $("div#drengr_desktopTabbedDescriptionOverviewContent_feature_div").text().trim()
						: $("div#drengr_DesktopTabbedDescriptionOverviewContent_feature_div").text().trim(),
				created_at: new Date().toISOString(),
				updated_at: ""
			};

			books.push(bookFound);
			if (!authors.some((item) => item.slug === author.slug)) {
				authors.push(author);
			}
			if (!publishers.some((item) => item.slug === publisher.slug)) {
				publishers.push(publisher);
			}
		} catch (error) {
			console.error(`Error processing ${urlAmazon}: ${error.message}`);
		} finally {
			await page.close();
		}
	}

	await browser.close();

	const booksJSON = JSON.stringify(books, null, 4);
	const authorsJSON = JSON.stringify(authors, null, 4);
	const publishersJSON = JSON.stringify(publishers, null, 4);

	fs.writeFileSync("./src/jsons/books.json", booksJSON, "utf-8");
	fs.writeFileSync("./src/jsons/authors.json", authorsJSON, "utf-8");
	fs.writeFileSync("./src/jsons/publishers.json", publishersJSON, "utf-8");

	//console.log(books);

	console.log('\n\n\n...Finished web scrapping!')
}

getBooksFromAmazon();
