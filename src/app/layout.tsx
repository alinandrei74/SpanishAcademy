import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { AuthProvider } from './auth/auth-context';
import { Navbar } from '@/components/layout/navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Language Learning Platform',
  description: 'A platform for learning languages through personalized tutoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}