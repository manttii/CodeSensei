import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CodeSensei — AI Code Review',
  description:
    'AI-powered code analysis engine. Detect vulnerabilities, optimize performance, and get refactored code — instantly.',
  keywords: ['code review', 'AI', 'security', 'Gemini', 'developer tool'],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
