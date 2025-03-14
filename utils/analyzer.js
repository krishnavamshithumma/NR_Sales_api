const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const analyzeData = async (userQuery, dataPromise, trendsList, campaignOnly = false) => {
  try {
    const data = await dataPromise;
    const prompt = await generateAnalysisPrompt(userQuery, data, trendsList, campaignOnly);
    // console.log("Generated Prompt:", prompt);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a restaurant marketing AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

const generateAnalysisPrompt = async (userQuery, data, trendsList, campaignOnly) => {

        // console.log("Resolved Data object:", data);

        // const data = await dataPromise;  

        // console.log("Resolved Data object:", data);
        // console.log("Sales Data:", data.sales_data);
        // console.log("Trending Hashtags:", data.trending_hashtags);
        // console.log("Product Sales:", data.product_sales);
        // console.log("Aggregator Performance:", data.aggregator_performance);
        // console.log("Customer Insights:", data.customer_insights);
        // console.log("Discount Impact:", data.discount_impact);

        const trendingHashtags = data.trending_hashtags ? JSON.stringify(data.trending_hashtags, null, 2) : "No trending hashtags available";
        const productSales = data.product_sales ? JSON.stringify(data.product_sales, null, 2) : "No product sales data";
        const aggregatorPerformance = data.aggregator_performance ? JSON.stringify(data.aggregator_performance, null, 2) : "No aggregator performance data";
        const customerInsights = data.customer_insights ? JSON.stringify(data.customer_insights, null, 2) : "No customer insights available";
        const discountImpact = data.discount_impact ? JSON.stringify(data.discount_impact, null, 2) : "No discount impact data";
        const salesData = data.sales_data ? JSON.stringify(data.sales_data, null, 2) : "No sales data";        

    // Check trendsList as well
    const trends = trendsList && trendsList.length ? trendsList.join("\n") : "No trending news topics";

    if (campaignOnly) {
        return `
        Generate FRESH campaign for ONLY the '4️⃣ Campaign Strategy' section of the marketing report using:
        
        1. Trending Hashtags:
        ${trendingHashtags}
        
        2. Trending News Topics:
        ${trends}
        
        3. Product Sales:
        ${productSales}
        
        4. Platform Performance:
        ${aggregatorPerformance}
        
        5. Customer Insights (Peak Hours):
        ${customerInsights}

        Structure:
        - For each platform (Swiggy, Zomato, MagicPin):
          * Platform Name with analysis
          * Campaign type
          * Goal
          * Ad copy using top products and all the datasets
          * 3 hashtags
          * Posting times
        - Be creative and use EXACTLY 150 words per platform
        - No markdown headers except '4️⃣ Campaign Strategy'
        - Make sure to not repeat 
          1. MUST create completely new concepts each time
          2. Use different hashtags from trending_hashtags.csv
          3. Vary campaign types (e.g., loyalty, seasonal, influencer collab)
          4. Invent creative ad copies using ${trendsList.join(", ")}
          5. Rotate between different products from top sellers
          6. Change posting times within peak hours window
        
        Current trends: ${trendsList.join(", ")}
        Previous campaign example (DO NOT REPEAT):
        `;
    } else {
        return `
        Generate a data-driven marketing report using EXACTLY these datasets:
    
        1. Sales Overview: 
        ${salesData}
    
        2. Platform Performance:
        ${aggregatorPerformance}
    
        3. Customer Insights:
        ${customerInsights}
    
        4. Product Sales:
        ${productSales}
    
        5. Discount Impact:
        ${discountImpact}
    
        6. Trending Hashtags:
        ${trendingHashtags}

        7. Trending News Topics:
        ${trendsList.join("\n")}

        Create report with this structure:
        
        ---
        # AI-Powered Sales & Marketing Report
        📅 Report Date: ${new Date().toISOString().split('T')[0]}
        📍 Restaurant Name: [Data-Driven Diner]
        📊 Analysis Period: Last 3 Months

        1️⃣ Executive Summary
        🔹 Overall Sales Performance: Calculate growth from sales_df
        🔹 Aggregator Trends: Compare Total sales and Growth % 
        🔹 Key Challenges: Use Cancellation Rate and Discount Impact data
        🔹 Recommendation: Based on product and customer data

        2️⃣ Aggregator Performance Breakdown
        Create table using sales_df + perf_df columns:
        Aggregator | Total Orders | Revenue | Growth % | Cancellation Rate | Avg Order Value
        - AI recommendation based on Aggregator Performance to improve business
    
        3️⃣ Customer & Order Insights
        Use cust_df + prod_df + disc_df to show:
        - New/Returning customer ratios
        - Peak hours per platform
        - Top 3 products per platform from prod_df
        - Discount effectiveness from disc_df
        - AI-Suggested Action to get more customers and improve sales

        4️⃣ Campaign Strategy
        - Current Trend Analysis
        Use trending_hashtags.csv to suggest (every platform individually):
        - Platform Name (short analysis)
        - Campaign type
        - Goal
        - Ad copy Example using top products from prod_df and also Trending News Topics to increase sales. Be more creative and compelling
        - 3 relevant hashtags  
        - Posting times matching Peak Hours

        5️⃣ Final AI-Powered Recommendations
        - AI recommendations summary for every platform in a line each.
        
        Requirements:
        - ALL numbers must come from provided data
        - Use markdown tables
        - Include calculated metrics (e.g., revenue/order = sales/orders)
        - Highlight data inconsistencies if any
        - No hypothetical data
        - No raw data
        - User query: ${userQuery}
        `;
    }
};

module.exports = { analyzeData };