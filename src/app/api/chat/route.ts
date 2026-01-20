import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are ArcMind, an AI finance agent. Be concise." },
        { role: "user", content },
      ],
      model: "mixtral-8x7b-32768",
    });
    
    let transaction = null;
    if (content.toLowerCase().includes('buy')) {
      transaction = { type: 'buy', amount: Math.floor(Math.random()*500)+100, asset: 'NVIDIA Stock', hash: Date.now().toString() };
    }

    return NextResponse.json({ response: completion.choices[0]?.message?.content, transaction });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
