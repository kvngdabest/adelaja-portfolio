import type { Metadata, Viewport } from "next";
import { Inter, Audiowide, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/site/motion-provider";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SITE_DESCRIPTION, SITE_ROLE } from "@/lib/content/positioning";
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
    default: `Adelaja Obanijesu Israel — ${SITE_ROLE}`,
    template: "%s — Adelaja Obanijesu Israel",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Adelaja Obanijesu Israel",
    title: `Adelaja Obanijesu Israel — ${SITE_ROLE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#07080b" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${audiowide.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <MotionProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
