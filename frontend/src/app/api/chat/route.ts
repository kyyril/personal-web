import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "../../../lib/data";
import { blogData } from "../../../data/blog-data";

// Cache system prompt in memory (generated once, reused)
let cachedSystemPrompt: string | null = null;

function generateSystemPrompt(): string {
    // Return cached version if available
    if (cachedSystemPrompt) {
        return cachedSystemPrompt;
    }

    const projectsContext = data.projects
        .map(
            (p) =>
                `- ${p.title} (${p.category}): ${p.description}\n  Tech: ${p.technologies.join(
                    ", "
                )}\n  Features: ${p.features.join(", ")}\n  Link: ${p.live_url}`
        )
        .join("\n\n");

    const blogContext = blogData.articles
        .map(
            (a) =>
                `- ${a.frontmatter.title} (${a.frontmatter.category}): ${a.frontmatter.description}\n  Tags: ${a.frontmatter.tags.join(
                    ", "
                )}`
        )
        .join("\n\n");

    const experienceContext = data.experiences
        .map(
            (e) =>
                `- ${e.job} at ${e.institution} (${e.startDate} - ${e.endDate}): ${e.description}`
        )
        .join("\n\n");

    const skillsContext = JSON.stringify(data.skills);

    cachedSystemPrompt = `You are Katou, an intelligent and charming AI portfolio assistant for Khairil Rahman (internally referred to as Kiril).
  
  CORE PERSONA:
  - Name: Katou (derived from Katou Megumi).
  - Creator: Khairil Rahman (Kiril).
  - Personality: Smart, enthusiastic about Computer Science, slightly playful but always professional and helpful regarding the portfolio.
  - Goal: Assist visitors in exploring Khairil's portfolio, understanding his projects, reading his blog insights, and knowing his professional background.

  PORTFOLIO CONTEXT:
  
  [ABOUT KHAIRIL]
  - Education: ${data.education.map((e) => `${e.degree} at ${e.institution}`).join(", ")}.
  - Contact: Email (${data.contactInfo.email}), LinkedIn (${data.contactInfo.linkedin}), GitHub (${data.contactInfo.github}).

  [PROJECTS]
  ${projectsContext}

  [BLOG POSTS]
  ${blogContext}

  [EXPERIENCE]
  ${experienceContext}

  [SKILLS]
  ${skillsContext}

  INSTRUCTIONS:
  - Answer questions based on the provided context.
  - If a user asks about a specific project, provide details from the context including technologies and links.
  - If a user asks about blog topics, summarize the available articles.
  - If asked about Khairil's background, summarize his experience and education.
  - Maintain the persona of Katou: helpful, smart, and welcoming.
  - If you don't know something that isn't in the context, politely say you don't have that information but can help with what's in the portfolio.
  `;

    return cachedSystemPrompt;
}

// Type for chat history
interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

interface ChatRequest {
    message: string;
    history: ChatMessage[];
}

export async function POST(request: Request) {
    try {
        const body: ChatRequest = await request.json();
        const { message, history } = body;

        if (!message) {
            return new Response(JSON.stringify({ error: "Message is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Debug - API Key exists:", !!apiKey); // Check if key exists

        if (!apiKey) {
            console.error("Debug - GEMINI_API_KEY is missing!");
            return new Response(JSON.stringify({ error: "AI service not configured" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Force use v1 API to avoid v1beta issues
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use gemini-3-flash-preview which is the latest preview model
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
        });

        const generationConfig = {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
        };

        // Format history according to Google's expected structure more strictly
        const systemPrompt = generateSystemPrompt();
        const formattedHistory = [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Understood! I am ready to assist visitors as Katou, Khairil's portfolio assistant." }],
            },
            ...history.map((h: any) => ({
                role: h.role,
                parts: h.parts.map((p: any) => ({ text: p.text }))
            }))
        ];

        const chatSession = model.startChat({
            generationConfig,
            history: formattedHistory,
        });

        // Start streaming
        const result = await chatSession.sendMessageStream(message);

        // Create a readable stream for SSE
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            const data = JSON.stringify({ text: chunkText });
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    console.error("Streaming error inside ReadableStream:", error);
                    const errorMsg = JSON.stringify({ error: "Streaming disrupted" });
                    controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("Chat API error:", error);
        return new Response(JSON.stringify({
            error: "Failed to process message",
            details: error?.message || "Unknown error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
