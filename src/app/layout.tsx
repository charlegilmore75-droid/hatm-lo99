import "./globals.css";
import { LangProvider } from "@/lib/lang";

export const metadata = { title: "HATM - منصة الخدمات", description: "منصة HATM للخدمات الاجتماعية" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
