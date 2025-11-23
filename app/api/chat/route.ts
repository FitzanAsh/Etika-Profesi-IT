import { chatResponse } from "@/lib/ai/chat-model";
import { searchKnowledgeBase } from "@/lib/ai/vector-search";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const userMessage = body.message;
        const mode = body.mode || 'normal';

        if (!userMessage || typeof userMessage !== 'string') {
            return new Response(
                JSON.stringify({ error: "Message is required" }),
                { status: 400 }
            );
        }

        console.log('📩 User question:', userMessage);
        console.log('🎯 Mode:', mode);

        // Retrieve context from vector search
        const context = await searchKnowledgeBase(userMessage);

        // Build prompt based on mode
        const finalPrompt = mode === 'academic'
            ? buildAcademicPrompt(context, userMessage)
            : buildNormalPrompt(context, userMessage);

        const answer = await chatResponse(finalPrompt);

        return new Response(
            JSON.stringify({
                reply: answer,
                sources: [],
                mode: mode
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('❌ Chat API Error:', error);
        return new Response(
            JSON.stringify({
                reply: "Maaf, terjadi kesalahan sistem. Silakan coba lagi.",
                sources: [],
            }),
            { status: 500 }
        );
    }
}

function buildNormalPrompt(context: string, question: string): string {
    return `Kamu adalah asisten yang membantu menjelaskan makalah tentang phishing dan keamanan siber.

KONTEKS DARI DOKUMEN:
${context}

PERTANYAAN:
${question}

INSTRUKSI:
- Jawab LANGSUNG berdasarkan konteks di atas
- Gunakan bahasa Indonesia yang mudah dipahami
- Jelaskan seperti sedang ngobrol dengan teman
- JANGAN awali dengan "maaf" atau "mohon maaf"
- Jika tidak ada info yang relevan, katakan "Informasi ini belum tersedia dalam dokumen"

Jawaban:`;
}

function buildAcademicPrompt(context: string, question: string): string {
    return `Anda adalah asisten akademik yang memberikan jawaban formal dan terstruktur tentang makalah phishing dan keamanan siber.

KONTEKS DARI DOKUMEN:
${context}

PERTANYAAN:
${question}

INSTRUKSI:
- Berikan jawaban dalam format akademik yang formal
- Gunakan struktur: (1) Definisi, (2) Penjelasan, (3) Referensi
- Sebutkan sumber bab jika relevan (misal: "Berdasarkan Bab II...")
- Gunakan istilah teknis yang tepat
- JANGAN awali dengan "maaf" atau "mohon maaf"

Jawaban akademik:`;
}
