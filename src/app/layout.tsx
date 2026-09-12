import type { Metadata, Viewport } from "next";
import { Inter, Audiowide, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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
    default: "Adelaja Obanijesu Israel — AI Automation & Full-Stack Developer",
    template: "%s — Adelaja Obanijesu Israel",
  },
  description:
    "AI Automation Engineer building n8n workflows, AI agents, and full-stack products with React/Next.js, Python, and Django. Based in Lagos, Nigeria.",
  openGraph: {
    type: "website",
    siteName: "Adelaja Obanijesu Israel",
    title: "Adelaja Obanijesu Israel — AI Automation & Full-Stack Developer",
    description:
      "AI Automation Engineer building n8n workflows, AI agents, and full-stack products with React/Next.js, Python, and Django.",
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
        <TooltipProvider>
          {children}
          <Toaster theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  );
}
