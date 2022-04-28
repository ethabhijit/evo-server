const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

function wait(seconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, seconds * 1000);
	});
}

exports.getData = async (req, res) => {
	const URL =
		"https://thesphynx.co/swap/32520/0x267Ae4bA9CE5ef3c87629812596b0D89EcBD81dD";
	const PRICE_SELECTOR = "div.sc-gsDKAQ.QYecP";
	const MARKET_CAP_SELECTOR = "div:nth-child(3) > div.sc-gsDKAQ.zTPCH";
	const LIQUIDITY_SELECTOR = "div:nth-child(2) > div.sc-gsDKAQ.kSMzzt";

	try {
		// start puppeteer
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();

		await page.goto(URL);
		await wait(5);
		const html = await page.content();
		const $ = await cheerio.load(html);

		let price = await $(PRICE_SELECTOR).text();
		let marketCap = await $(MARKET_CAP_SELECTOR).text();
		let liquidity = await $(LIQUIDITY_SELECTOR).text();

		price = parseFloat(price.slice(2).replaceAll(",", ""));
		marketCap = parseFloat(marketCap.slice(2).replaceAll(",", ""));
		liquidity = parseFloat(liquidity.slice(2).replaceAll(",", ""));

		console.log(
			`price ${price}, marketCap ${marketCap}, liquidity ${liquidity}`
		);
		await browser.close();

		res.json({
			price,
			marketCap,
			liquidity,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
