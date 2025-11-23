import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function chatResponse(userMessage: string): Promise<string> {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        return completion.choices[0]?.message?.content || "Maaf, tidak ada jawaban.";
    } catch (error) {
        console.error("❌ Groq API Error:", error);
        return "Maaf, terjadi kesalahan. Silakan coba lagi.";
    }
}
