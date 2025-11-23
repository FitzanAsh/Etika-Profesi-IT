import { PublicNavbar } from '@/components/layout/public-navbar';
import { Footer } from '@/components/layout/footer'; // Import Footer
import { ChatWidget } from '@/components/chat/chat-widget'; // Import ChatWidget

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      <PublicNavbar />
      <div className="container px-4 md:px-6 flex-1">
        <main className="relative py-6 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
      <Footer /> {/* Add Footer Here */}
      <ChatWidget /> {/* AI Chatbot */}
    </div>
  );
}
