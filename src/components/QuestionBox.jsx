import { useState } from 'react';

export default function QuestionBox() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer('');
    setSources([]);

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    setAnswer(data.answer);
    setSources(data.sources);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">📄 ドボタス 出典付きQ&A</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="例：擁壁の根入れ基準は？"
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />
      <button onClick={handleAsk} className="bg-blue-600 text-white px-4 py-2 rounded">
        質問する
      </button>

      {loading && <p className="mt-4 text-blue-500">回答を生成中...</p>}

      {answer && (
        <div className="mt-4">
          <h2 className="font-semibold">🧠 回答：</h2>
          <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">📚 出典（複数ページ一致）</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {sources.map((s, i) => (
              <li key={i}>p.{s.page}：{s.text.slice(0, 30)}...</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
