export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const { lectureText, mindsetAnswer, studentLevel } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY missing in server settings' });
  }

  const agentPrompt = `
  You are RayEdu, an autonomous AI educational and career agent competing in the Create AI Agents Championship.
  Execute these 5 autonomous agentic steps based on the student's input:

  Student Profile:
  - Academic Level: "${studentLevel}"
  - Cognitive Mindset: "${mindsetAnswer}"
  - Study Material: "${lectureText}"

  Step 1 (Cognitive Diagnosis & Weak Point Detection): Analyze the student's mindset and identify the single most complex concept in the provided text where they need improvement.
  Step 2 (TikTok-Style Micro-Learning Reels): Create 3 punchy, engaging, viral-style educational reel scripts (1-2 short sentences each) tailored to their mindset, plus explain its direct value in the job market.
  Step 3 (Targeted Skill-Up Courses): Recommend 2 specific practical courses or workshops to strengthen their detected weak point and prepare them for the market (include course title, skill gained, and platform type like Coursera/Udemy/Edraak).
  Step 4 (Smart Challenge Generator): Create 1 adaptive scenario-based challenge question targeting their weak point, along with the correct answer.
  Step 5 (Career & Internship Matching): Recommend 1 exact internship track matching their mindset and explain why.

  Respond ONLY in valid JSON format with these exact keys (all values in clear, engaging Arabic):
  {
    "mindsetType": "...",
    "weakPointDetected": "...",
    "microSummary": ["نقطة الريل الأول", "نقطة الريل الثاني", "نقطة الريل الثالث"],
    "jobMarketValue": "...",
    "recommendedCourses": [
      { "title": "اسم الكورس الأول", "skill": "المهارة المكتسبة", "platform": "المنصة المقترحة" },
      { "title": "اسم الكورس الثاني", "skill": "المهارة المكتسبة", "platform": "المنصة المقترحة" }
    ],
    "challengeQuestion": "...",
    "challengeAnswer": "...",
    "internshipTrack": "...",
    "matchReason": "..."
  }
  `;

  try {
    const response = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vercel.app',
        'X-Title': 'RayEdu AI Agent'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content: agentPrompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API connection failed');
    }

    let resultText = data.choices[0].message.content;
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(resultText);

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    parsedResult.metrics = {
      executionTimeSeconds: executionTime,
      estimatedTimeSavedMinutes: Math.max(20, Math.round(lectureText.split(' ').length * 0.4)),
      costPerTask: "$0.00 (Free Tier)"
    };

    res.status(200).json(parsedResult);
  } catch (error) {
    res.status(500).json({ error: 'Agent execution failed', details: error.message });
  }
      }
