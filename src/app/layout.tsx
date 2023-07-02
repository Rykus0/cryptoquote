import "./globals.css";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
const domain = "cryptoquote-five.vercel.app";

export const metadata = {
  title: "Cryptoquotle",
  description: "A classic game of decyphering encrypted famous quotes.",
  openGraph: {
    title: "Cryptoquotle",
    description: "A classic game of decyphering encrypted famous quotes",
    url: `https://${domain}`,
    type: "website",
    images: [
      {
        url: `https://${domain}/cryptoquotle.png`,
        width: 180,
        height: 180,
        alt: "Online Cryptoquote Game",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <h1>
            <Image
              src="/cryptoquotle.svg"
              alt="Cryptoquotle logo"
              width="32"
              height="32"
            />{" "}
            Cryptoquotle
          </h1>
        </header>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
