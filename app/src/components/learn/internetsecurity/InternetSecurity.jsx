export default function InternetSecurity() {
  const lessons = [
    { id: 1, title: "🔐 Password Security", unlocked: true },
    { id: 2, title: "🎣 Phishing Scams", unlocked: false },
    { id: 3, title: "🛡️ Malware Protection", unlocked: false },
    { id: 4, title: "🌐 Safe Browsing", unlocked: false },
    { id: 5, title: "📡 Public Wi-Fi Risks", unlocked: false },
  ];

  return (
    <div className="font-sans p-6 bg-green-50 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-600 mb-2 text-center">
        Internet Security
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Start your journey to becoming cyber smart. Complete lessons to unlock
        the next!
      </p>

      <div className="flex flex-col gap-8 items-center">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="flex flex-col items-center relative">
            <button
              className={`rounded-full px-6 py-4 text-lg font-semibold shadow-md transition-all ${
                lesson.unlocked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!lesson.unlocked}
            >
              {lesson.title}
            </button>
            {index < lessons.length - 1 && (
              <div className="w-1 h-8 bg-green-300 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
