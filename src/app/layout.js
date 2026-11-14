import { Fraunces, Inter, Nunito, Share_Tech_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { ProgressProvider } from "@/state/progress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-story",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const letterMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-letter",
  display: "swap",
});

export const metadata = {
  title: "The Quiet Machines",
  description: "Stories of the machines NASA left behind",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${nunito.variable} ${inter.variable} ${letterMono.variable} ${arabic.variable}`}
    >
      <body>
        <LangProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </LangProvider>
      </body>
    </html>
  );
}
