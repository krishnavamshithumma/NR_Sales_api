const express = require("express");
const router = express.Router();
const analysisService = require("../services/analysisService");

// Create a new session
router.post("/create-session", async (req, res) => {
  try {
    const { query } = req.body;
    const sessionId = await analysisService.createSession(query);
    res.json({ session_id: sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate full report
router.post("/generate-report", async (req, res) => {
  try {
    const { session_id } = req.body;
    const report = await analysisService.generateFullReport(session_id);
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regenerate campaign section
router.post("/regenerate-campaign", async (req, res) => {
  try {
    const { session_id } = req.body;
    const campaign = await analysisService.regenerateCampaign(session_id);
    res.json({ report: campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;