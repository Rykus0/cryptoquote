import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import LogoIcon from "@/app/components/icons/LogoIcon";
import { version } from "../../package.json";

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
            <LogoIcon />
            Cryptoquotle
          </h1>
        </header>

        {children}

        <footer>
          <div>
            <Link href="/">Play</Link>
            <Link href="/history">Game History</Link>
          </div>

          <div>
            <a href="https://github.com/Rykus0/cryptoquote/releases/latest">
              v{version}
            </a>
          </div>
        </footer>
      </body>
      <Analytics />
    </html>
  );
}
