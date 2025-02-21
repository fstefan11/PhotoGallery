import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/headerComponent";
import { dbConnect } from "@/lib/mongo";
import Providers from "@/components/providersComponent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PhotoGallery",
  description:
    "A platform for photography lovers and visual artists. Share your works and inspire the community with stunning images.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
        </Providers>
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  );
}
