import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';


const inter = Inter({ subsets: ['latin'] });


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
    </html>
  );
}
