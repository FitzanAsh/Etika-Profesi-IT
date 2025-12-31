import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function GET() {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'GROQ_API_KEY not found in environment'
            });
        }

        console.log('Testing Groq API...');
        console.log('API Key exists:', apiKey ? 'YES' : 'NO');
        console.log('API Key prefix:', apiKey?.substring(0, 10));

        const groq = new Groq({ apiKey });

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Hi, say hello!" }],
            max_tokens: 50,
        });

        return NextResponse.json({
            success: true,
            response: completion.choices[0]?.message?.content,
            model: completion.model
        });

    } catch (error: any) {
        console.error('Groq API Test Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}
