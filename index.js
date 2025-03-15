const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./api/routes/analysisRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", analysisRoutes);

// Start server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// for vercel
module.exports = app;