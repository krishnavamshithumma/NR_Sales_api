const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");
const { scrapeTrendingTopics } = require("../utils/scraper");
const { analyzeData } = require("../utils/analyzer");

const sessions = {};

// Load all CSV data
const loadAllData = async () => {
    const data = {};
    const files = [
      "sales_data.csv",
      "trending_hashtags.csv",
      "aggregator_performance.csv",
      "customer_insights.csv",
      "product_sales.csv",
      "discount_impact.csv",
    ];
  
    await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(path.join(__dirname, "..", "data", file))
            .pipe(csv())
            .on("data", (row) => results.push(row))
            .on("end", () => {
              data[file.split(".")[0]] = results;
              resolve();
            })
            .on("error", (err) => reject(err));
        });
      })
    );
    return data;
  };

// Create a new session
const createSession = (query) => {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    query,
    data: loadAllData(),
    trends: [],
    report: null,
  };
  return sessionId;
};

// Generate full report
const generateFullReport = async (sessionId) => {
  const session = sessions[sessionId];
  if (!session) throw new Error("Invalid session ID");
  session.trends = await scrapeTrendingTopics();
  session.report = await analyzeData(session.query, session.data, session.trends);
  return session.report;
};

// Regenerate campaign section
const regenerateCampaign = async (sessionId) => {
  const session = sessions[sessionId];
  if (!session) throw new Error("Invalid session ID");
  session.trends = await scrapeTrendingTopics();
  session.report = await analyzeData(session.query, session.data, session.trends, true);
  return session.report;
};

module.exports = { createSession, generateFullReport, regenerateCampaign };