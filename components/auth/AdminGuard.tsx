'use client';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        async function check() {
            const {
                data: { session },
            } = await supabaseBrowser.auth.getSession();

            if (!session) {
                router.push('/login'); // Redirect ke login jika tidak ada sesi
            } else {
                setAllowed(true);
            }
        }
        check();
    }, [router]);

    if (!allowed) return null;

    return <>{children}</>;
}
