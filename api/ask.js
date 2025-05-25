import fs from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

export const config = {
  api: {
    bodyParser: true
  }
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { question } = req.body;
  const parsedPath = path.resolve('./src/data/parsed_output.json');
  const jsonData = JSON.parse(fs.readFileSync(parsedPath, 'utf-8'));

  // 複数マッチを抽出
  const matches = jsonData.filter(p => p.text.includes(question));

  const prompt = `以下の出典を参考に質問に答えてください：\n\n${matches.map(m => `【p.${m.page}】${m.text}`).join('\n')}\n\n質問：${question}`;

  const gptRes = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  const answer = gptRes.data.choices[0].message.content;
  res.status(200).json({ answer, sources: matches });
}
