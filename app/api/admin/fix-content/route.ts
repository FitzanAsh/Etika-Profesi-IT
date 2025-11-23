import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('🔄 Fixing content in production...');

        const contents = [
            {
                slug: 'abstrak',
                title: 'Abstrak',
                body: `Phishing merupakan salah satu bentuk serangan rekayasa sosial yang bertujuan mencuri informasi sensitif seperti kredensial login, data pribadi, serta informasi rahasia organisasi. Serangan ini menjadi salah satu penyebab utama terjadinya akses tidak sah (unauthorized access) pada sistem komputer.

Makalah ini menganalisis korelasi antara phishing dan meningkatnya insiden penyusupan ke sistem, dengan meninjau faktor teknis, manusia, dan organisasi yang berkontribusi terhadap keberhasilan serangan. Selain itu, makalah ini juga mengkaji teori cybercrime, kerangka hukum seperti UU ITE dan UU PDP, serta strategi mitigasi seperti Zero Trust Architecture dan pelatihan cybersecurity awareness.

Hasil analisis menunjukkan bahwa unauthorized access terjadi akibat kegagalan sistemik yang melibatkan kelemahan autentikasi, manipulasi psikologis, serta kurangnya budaya keamanan dalam organisasi. Rekomendasi yang diberikan mencakup peningkatan keamanan teknis, penguatan SOP, serta pembangunan budaya sadar keamanan untuk meminimalkan risiko insiden serupa.`
            },
            {
                slug: 'pendahuluan',
                title: 'Pendahuluan',
                body: `## BAB I - PENDAHULUAN

### 1.1 Latar Belakang

Dalam era digital yang semakin terhubung, keamanan informasi menjadi aspek kritis bagi organisasi dan individu. Phishing, sebagai teknik rekayasa sosial yang terus berkembang, memanfaatkan kerentanan manusia sebagai titik lemah dalam rantai keamanan.

Phishing tetap menjadi vektor serangan paling dominan untuk mendapatkan akses tidak sah ke sistem. Melalui manipulasi psikologis, pelaku memancing korban menyerahkan kredensial—kunci gerbang masuk ke sistem komputer.

### 1.2 Rumusan Masalah

1. Bagaimana teknik phishing mencuri kredensial?
2. Bagaimana kredensial hasil phishing digunakan untuk akses ilegal?
3. Mengapa phishing tetap efektif?
4. Strategi mitigasi apa yang paling efektif?

### 1.3 Tujuan Penelitian

Penelitian ini bertujuan untuk menganalisis hubungan antara serangan phishing dengan insiden unauthorized access, mengidentifikasi faktor-faktor yang memperkuat korelasi tersebut, serta mengusulkan strategi mitigasi yang efektif.`
            },
            {
                slug: 'pembahasan',
                title: 'Pembahasan',
                body: `## BAB III - PEMBAHASAN

### 3.1 Analisis Korelasi Phishing dan Unauthorized Access

Phishing merupakan teknik rekayasa sosial yang memanfaatkan manipulasi psikologis untuk mencuri kredensial autentikasi. Kredensial yang berhasil dicuri kemudian digunakan untuk melakukan akses tidak sah (unauthorized access) ke sistem target.

### 3.2 Faktor Penyebab Keberhasilan Serangan

**Faktor Teknis:**
- Autentikasi berbasis password yang lemah
- Multi-Factor Authentication (MFA) yang rentan terhadap phishing
- Kurangnya implementasi teknologi anti-phishing

**Faktor Manusia:**
- Kurangnya kesadaran keamanan siber
- Respons emosional terhadap urgensi dan otoritas
- Keterbatasan literasi digital

**Faktor Organisasi:**
- Standar Operasional Prosedur (SOP) yang lemah
- Budaya blame culture yang menghambat pelaporan
- Kurangnya investasi dalam pelatihan keamanan

### 3.3 Strategi Penanggulangan

1. **Teknologi**: Implementasi FIDO2/WebAuthn, Zero Trust Architecture
2. **Manusia**: Pelatihan berbasis simulasi dan gamifikasi
3. **Organisasi**: Penguatan SOP, budaya pelaporan tanpa rasa takut
4. **Hukum**: Kepatuhan terhadap UU ITE dan UU PDP`
            }
        ];

        let updatedCount = 0;

        for (const content of contents) {
            const { error } = await supabase
                .from('contents')
                .update({
                    body: content.body,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', content.slug);

            if (!error) {
                updatedCount++;
                console.log(`✅ Updated: ${content.title}`);
            } else {
                console.error(`❌ Failed to update ${content.slug}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fixed ${updatedCount} content items!`,
            updated: updatedCount
        });

    } catch (error) {
        console.error('❌ Fix error:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
