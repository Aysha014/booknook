
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "BookNook | A little corner for big stories",
    template: "%s | BookNook",
  },
  description:
    "Discover, borrow and share books with the BookNook reading community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>

        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('booknook_theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </body>
    </html>
  );
}
