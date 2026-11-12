export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lectureText, mindsetAnswer, studentLevel } = req.body || {};
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الذكاء الاصطناعي غير موجود في إعدادات السيرفر' });
  }

  const prompt = `أنت وكيل الذكاء الاصطناعي التعليمي RayEdu. قم بتحليل النص الدراسي التالي للطالب بدقة وتخصيص الرد بناءً على النص المكتوب فقط:
- المرحلة الدراسية: ${studentLevel}
- نمط تفكير الطالب: ${mindsetAnswer}
- النص الدراسي: "${lectureText}"

المطلوب منك إرجاع رد بصيغة JSON فقط بدون أي كلام إضافي، وباللغة العربية الواضحة، ويحتوي على المفاتيح التالية بالضبط:
{
  "mindsetType": "وصف قصير لكيفية شرح الدرس ليناسب عقلية الطالب",
  "weakPointDetected": "أصعب نقطة أو مفهوم في النص المكتوب يحتاج تركيزاً",
  "microSummary": ["نقطة تلخيص 1 من النص", "نقطة تلخيص 2 من النص", "نقطة تلخيص 3 من النص"],
  "jobMarketValue": "كيف تفيد هذه المعلومة الطالب في سوق العمل",
  "recommendedCourses": [
    { "title": "اسم كورس عملي مرتبط بموضوع النص", "skill": "المهارة المكتسبة", "platform": "منصة تعليمية مقترحة" },
    { "title": "اسم كورس ثاني مرتبط بموضوع النص", "skill": "المهارة المكتسبة", "platform": "منصة تعليمية مقترحة" }
  ],
  "challengeQuestion": "سؤال ذكي لاختبار فهم الطالب للنص",
  "challengeAnswer": "الإجابة الصحيحة باختصار",
  "internshipTrack": "مسار تدريب عملي مناسب لموضوع النص وعقلية الطالب"
}`;

  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    'openrouter/free'
  ];

  for (const model of models) {
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
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });

      if (!response.ok) continue;
      const data = await response.json();
      let text = data?.choices?.[0]?.message?.content || '';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch (e) {
      continue;
    }
  }

  return res.status(500).json({ error: 'الخوادم المجانية مشغولة حالياً، يرجى الضغط على التشغيل مرة أخرى بعد ثوانٍ.' });
        }
