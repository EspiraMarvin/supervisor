import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shamiri Supervisor Copilot',
  description: 'AI-powered session review for Shamiri Fellows',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
