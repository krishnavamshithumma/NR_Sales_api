const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTrendingTopics = async () => {
  try {
    const url = "https://indianexpress.com/section/trending/trending-in-india/";
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    const articles = $("div.articles > ul > li > div > a");
    const trends = articles
      .map((_, el) => $(el).text().trim())
      .get()
      .slice(0, 10);
    return trends;
  } catch (error) {
    throw new Error(`Scraping failed: ${error.message}`);
  }
};

module.exports = { scrapeTrendingTopics };