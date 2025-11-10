import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/providers/ThemeProvider';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Font setup
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Page metadata
export const metadata: Metadata = {
  title: 'KRK Jewellers - Design Your Dream Jewellery with AI',
  description:
    'Transform your imagination into stunning luxury jewelry with cutting-edge AI technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-poppins antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
