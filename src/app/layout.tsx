import type { Metadata, Viewport } from "next";
import { Inter, Audiowide, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/site/motion-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400", // Audiowide only ships one weight — it's heavy by design
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adelaja Obanijesu Israel — Front-End Developer & AI Content Creator",
    template: "%s — Adelaja Obanijesu Israel",
  },
  description:
    "Front-end developer who builds fast websites and creates AI video, design, and sales-automation systems for product brands. Based in Lagos, Nigeria.",
  openGraph: {
    type: "website",
    siteName: "Adelaja Obanijesu Israel",
    title: "Adelaja Obanijesu Israel — Front-End Developer & AI Content Creator",
    description:
      "Front-end developer who builds fast websites and creates AI video, design, and sales-automation systems for product brands.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1128",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${audiowide.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MotionProvider>
          <TooltipProvider>
            {children}
            <Toaster theme="dark" />
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
