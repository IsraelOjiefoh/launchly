const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
  try {
    const { type, prompt, goal } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let systemPrompt = "";
    if (type === "simple") {
      systemPrompt = `You are a marketing expert. Generate a catchy title, a short description (max 2 sentences), and a CTA button text for a product/service described as: "${prompt}". The goal is: ${goal}. Return JSON format: { "title": "", "description": "", "cta": "" }`;
    } else if (type === "landing") {
      systemPrompt = `You are a professional copywriter. Generate content for a landing page for a product/service described as: "${prompt}". The goal is: ${goal}. 
      Return JSON format: {
        "headline": "",
        "subheadline": "",
        "description": "",
        "features": ["feature 1", "feature 2", "feature 3"],
        "testimonials": [{ "name": "Name", "text": "Quote" }],
        "cta": ""
      }`;
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content);
    res.json(content);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
