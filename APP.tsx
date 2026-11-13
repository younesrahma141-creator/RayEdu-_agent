import React, { useState } from 'react';
import { Upload, Play, CheckCircle, AlertCircle, Briefcase, FileText, Sparkles, Award } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [learningStyle, setLearningStyle] = useState<'reels' | 'text' | 'audio'>('reels');
  const [analysisDone, setAnalysisDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // محاكاة عمل الوكيل الذكي أوتوماتيك بمجرد الرفع
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLoading(true);
      setAnalysisDone(false);
      
      // الوكيل يقوم بالتحليل التلقائي
      setTimeout(() => {
        setLoading(false);
        setAnalysisDone(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans" dir="rtl">
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" /> منصة RayEdu الذكية
        </h1>
        <p className="text-slate-400">الوكيل الذكي يعمل بكل شيء.. ارفع الملف واستمتع بالتعلم فوراً!</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* قسم الرفع التلقائي */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Upload className="text-blue-400" /> ارفع ملفك الدراسي (PDF أو صور أو نصوص)
          </h2>
          <label className="border-2 border-dashed border-slate-700 rounded-xl p-8 block cursor-pointer hover:border-blue-500 transition-all bg-slate-950/50">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            {file ? (
              <p className="text-green-400 font-medium">تم رفع الملف بنجاح: {file.name}</p>
            ) : (
              <p className="text-slate-400">اضغط هنا لاختيار الملف أو اسحبه وأفلته هنا</p>
            )}
          </label>

          {loading && (
            <div className="mt-4 text-blue-400 animate-pulse">
              الوكيل الذكي يقوم الآن بقراءة وتحليل الملف وتوليد المحتوى... ⏳
            </div>
          )}
        </div>

        {/* عرض النتائج والريلز بمجرد الانتهاء */}
        {analysisDone && (
          <div className="space-y-6 animate-fadeIn">
            {/* اختيار النمط */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">اختر أسلوب التعلم المفضل:</h3>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setLearningStyle('reels')}
                  className={`p-4 rounded-xl border font-medium transition-all ${learningStyle === 'reels' ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                >
                  🎬 ريلز تعليمية
                </button>
                <button 
                  onClick={() => setLearningStyle('text')}
                  className={`p-4 rounded-xl border font-medium transition-all ${learningStyle === 'text' ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                >
                  📄 شرح مكتوب
                </button>
                <button 
                  onClick={() => setLearningStyle('audio')}
                  className={`p-4 rounded-xl border font-medium transition-all ${learningStyle === 'audio' ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                >
                  🎧 ملخص صوتي
                </button>
              </div>
            </div>

            {/* محتوى الريلز أو الشرح */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Play className="text-green-400" /> المحتوى المولّد أوتوماتيكياً من ملفك
              </h3>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                <p className="text-slate-300 leading-relaxed">
                  هذا استخلاص ذكي وشرح مبسط تم توليده فوراً من الملف المرفق. يوضح الأفكار الرئيسية والنقاط الجوهرية بطريقة تفاعلية وسريعة لتوفير الوقت والفهم العميق.
                </p>
              </div>
            </div>

            {/* الاختبار الذكي */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-purple-400" /> اختبار الذكاء الاصطناعي من الملف
              </h3>
              <p className="mb-4 text-slate-300">سؤال: ما هي الفكرة الأساسية المستخرجة من الملف المرفق؟</p>
              <div className="space-y-3">
                {[
                  "الفهم الشامل وتحليل البيانات بدقة",
                  "الحفظ التلقائي للنصوص دون فهم",
                  "الاعتماد على بيانات تجريبية ثابتة"
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedOption(idx); setQuizAnswered(true); }}
                    className={`w-full text-right p-3 rounded-xl border transition-all ${
                      quizAnswered 
                        ? idx === 0 ? 'bg-green-600/30 border-green-500 text-green-200' : 'bg-slate-800 border-slate-700 opacity-50'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {quizAnswered && (
                <div className="mt-4 p-4 bg-green-950/40 border border-green-800 rounded-xl text-green-300 text-sm">
                  ✓ إجابة صحيحة! الوكيل قام بالتحقق وتأكيد أن هذه هي الفكرة الأساسية المستخرجة من الملف.
                </div>
              )}
            </div>

            {/* تقييم القدرات وسوق العمل */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Award className="text-yellow-400" /> تقييم القدرات وسوق العمل
                </h3>
                <p className="text-slate-400 text-sm">بناءً على أداؤك، أنت مؤهل للربط بمسارات التدريب العملي.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all">
                <Briefcase size={18} /> عرض الكورسات والتدريبات
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
    }
