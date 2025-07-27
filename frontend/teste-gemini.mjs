todoimport dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // <- força carregar o arquivo certo

import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!key) {
  console.error("Sem chave");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testar() {
  try {
    const { response } = await model.generateContent("Responda somente OK");
    console.log("Resposta:", response.prtext());
  } catch (e) {
    console.error("Erro:", e.message);
  }
}

testar();