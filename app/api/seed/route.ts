import { NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client'; // Import Service Client

export async function GET() {
    try {
        // Use Service Role to bypass RLS
        const supabase = getSupabaseServiceRoleClient();

        const contentsData = [
            {
                title: 'Abstrak',
                slug: 'abstrak',
                source: 'database',
                body: `Phishing merupakan salah satu bentuk serangan rekayasa sosial yang bertujuan mencuri informasi sensitif seperti kredensial login, data pribadi, serta informasi rahasia organisasi. Serangan ini menjadi salah satu penyebab utama terjadinya akses tidak sah (unauthorized access) pada sistem komputer.

Makalah ini menganalisis korelasi antara phishing dan meningkatnya insiden penyusupan ke sistem, dengan meninjau faktor teknis, manusia, dan organisasi yang berkontribusi terhadap keberhasilan serangan. Selain itu, makalah ini juga mengkaji teori cybercrime, kerangka hukum seperti UU ITE dan UU PDP, serta strategi mitigasi seperti Zero Trust Architecture dan pelatihan cybersecurity awareness.

Hasil analisis menunjukkan bahwa unauthorized access terjadi akibat kegagalan sistemik yang melibatkan kelemahan autentikasi, manipulasi psikologis, serta kurangnya budaya keamanan dalam organisasi. Rekomendasi yang diberikan mencakup peningkatan keamanan teknis, penguatan SOP, serta pembangunan budaya sadar keamanan untuk meminimalkan risiko insiden serupa.`
            },
            {
                title: 'BAB I - Pendahuluan',
                slug: 'pendahuluan',
                source: 'database',
                body: `## PENDAHULUAN

### Latar Belakang

Dalam era digital yang semakin terhubung, keamanan informasi menjadi aspek kritis bagi organisasi dan individu. Phishing, sebagai teknik rekayasa sosial yang terus berkembang, memanfaatkan kerentanan manusia sebagai titik lemah dalam rantai keamanan.

Phishing tetap menjadi vektor serangan paling dominan untuk mendapatkan akses tidak sah ke sistem. Melalui manipulasi psikologis, pelaku memancing korban menyerahkan kredensial—kunci gerbang masuk ke sistem komputer.

### Rumusan Masalah

1. Bagaimana teknik phishing mencuri kredensial?
2. Bagaimana kredensial hasil phishing digunakan untuk akses ilegal?
3. Mengapa phishing tetap efektif?
4. Strategi mitigasi apa yang paling efektif?

### Tujuan Penelitian

Penelitian ini bertujuan untuk menganalisis hubungan antara serangan phishing dengan insiden unauthorized access, mengidentifikasi faktor-faktor yang memperkuat korelasi tersebut, serta mengusulkan strategi mitigasi yang efektif.`
            },
            { title: 'BAB II - Landasan Teori', slug: 'landasan-teori', source: 'database', body: '# Landasan Teori\n\n(Teori tentang Phishing...)' },
            {
                title: 'BAB III - Pembahasan',
                slug: 'pembahasan',
                source: 'database',
                body: `### Analisis Korelasi Phishing dan Unauthorized Access

Phishing merupakan teknik rekayasa sosial yang memanfaatkan manipulasi psikologis untuk mencuri kredensial autentikasi. Kredensial yang berhasil dicuri kemudian digunakan untuk melakukan akses tidak sah (unauthorized access) ke sistem target.

### Faktor Penyebab Keberhasilan Serangan

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

### Strategi Penanggulangan

1. **Teknologi**: Implementasi FIDO2/WebAuthn, Zero Trust Architecture
2. **Manusia**: Pelatihan berbasis simulasi dan gamifikasi
3. **Organisasi**: Penguatan SOP, budaya pelaporan tanpa rasa takut
4. **Hukum**: Kepatuhan terhadap UU ITE dan UU PDP`
            },
            { title: 'BAB IV - Penutup', slug: 'penutup', source: 'database', body: '# BAB IV Penutup\n\n(Kesimpulan...)' },
            { title: 'Daftar Pustaka', slug: 'daftar-pustaka', source: 'database', body: '# Daftar Pustaka\n\n1. Referensi A...' },
            { title: 'Identitas Tim', slug: 'tim', source: 'database', body: '# Tim Pengembang\n\n- Nama 1\n- Nama 2' },
        ];

        const results = [];

        for (const item of contentsData) {
            // Upsert: Insert or Update if slug exists
            const { error } = await supabase
                .from('contents')
                .upsert(item, { onConflict: 'slug' });

            if (error) {
                console.error('Error seeding:', item.title, error);
                results.push({ title: item.title, status: 'Failed', error: error.message });
            } else {
                results.push({ title: item.title, status: 'Success' });
            }
        }

        return NextResponse.json({ message: 'Database Seeding Completed', details: results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
