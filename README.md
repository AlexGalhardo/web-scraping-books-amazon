<div align="center">
 	<h1 align="center">Web Scraping Books Amazon</h1>
</div>

## Introduction

- A personal project I created to learn and improve my skills in web scraping.
- It's a simple script who get data information from HTML DOM Amazon.com.br books pages.

## Development Setup Local

- Install Bun: <https://bun.sh/docs/installation>

1. Clone this repository
```bash
git clone git@github.com:AlexGalhardo/web-scraping-books-amazon.git
```

2. Enter repository
```bash
cd web-scraping-books-amazon/
```

3. Install dependencies
```bash
bun install
```

4. Change array **src/booksToFind.ts** with the urls of the books you want to find. For now, this script only works for **amazon.com.br** pages

5. Start scrapping
```bash
bun start
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
