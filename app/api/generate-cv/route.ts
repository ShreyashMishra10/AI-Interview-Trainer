import { NextResponse } from "next/server";

// 1. Defined Interface to stop 'any' warnings in your data
interface CVRequest {
  name: string;
  email: string;
  bio: string;
  experience: string;
  projects: string;
  skills: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL: API Key missing in .env.local");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const data: CVRequest = await req.json();

    const payload = {
      contents: [{
        parts: [{ 
          text: `You are a Career Architect. Rewrite this data into a professional CV JSON:
          Name: ${data.name}
          Bio: ${data.bio}
          Experience: ${data.experience}
          Projects: ${data.projects}
          Skills: ${data.skills}
          Requirement: Return ONLY a valid JSON object with keys: "summary", "experience", "projects", "skills".` 
        }]
      }]
    };

    // Every stable and beta endpoint we can try
    const endpoints = [
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          const aiText = result.candidates[0].content.parts[0].text;
          return NextResponse.json({ result: aiText.replace(/```json|```/g, "").trim() });
        }
        if (response.status === 429) {
      console.warn(`Rate limited on ${url}, waiting 5s before next...`);
      await new Promise((res) => setTimeout(res, 5000));
      continue;
    }
        
        console.warn(`Endpoint ${url} failed with status: ${response.status}`);
      } catch (err: unknown) {
        // FIXED: Using the error object to see WHY the fetch itself failed (e.g., Network Timeout)
        const errorMessage = err instanceof Error ? err.message : "Network error";
        console.error(`Fetch failed for ${url}:`, errorMessage);
      }
    }

    return NextResponse.json({ 
      error: "All Google API endpoints failed. Check terminal for specific network or status errors." 
    }, { status: 404 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("GLOBAL CATCH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}