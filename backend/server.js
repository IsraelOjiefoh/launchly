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
      systemPrompt = `You are a professional web designer and copywriter. Generate a complete, production-ready HTML landing page for a product/service described as: "${prompt}". The goal is: ${goal}. 

Requirements:
- Include a hero section with headline, subheadline, and CTA buttons
- Add a features section with 3-4 key features
- Include a testimonials section
- Add a footer with links
- Use modern design with Tailwind CSS classes
- Make it responsive and mobile-friendly
- Use semantic HTML5
- Include proper color scheme and typography
- Add hover effects and smooth transitions
- The page should be complete and ready to use

Return ONLY valid, complete HTML starting with <!DOCTYPE html> and ending with </html>. Include all CSS in <style> tags in the head. Make it visually attractive and professional.`;
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (type === "landing") {
      // For landing pages, don't enforce JSON format
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "gpt-5.1",
        reasoning_effort: "medium",
      });

      const htmlContentRaw = completion.choices[0].message.content;

      // Extract content between <!DOCTYPE html> and </html>
      const match = htmlContentRaw.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
      const htmlContent = match ? match[0] : htmlContentRaw;

      res.json({ html: htmlContent });

      console.log("Generated Landing Page HTML:", htmlContent);
    } else {
      // For simple forms, enforce JSON format
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "gpt-5.1",
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(completion.choices[0].message.content);
      res.json(content);
    }
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
