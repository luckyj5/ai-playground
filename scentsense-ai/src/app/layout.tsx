import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ScentSense AI – Never smell wrong again",
    template: "%s · ScentSense AI",
  },
  description:
    "AI-powered fragrance recommendations for every moment. Tell us the occasion, mood, and weather — we'll pick the scent that makes you unforgettable.",
  keywords: [
    "fragrance recommendation",
    "perfume AI",
    "cologne recommendation",
    "signature scent",
    "ScentSense AI",
  ],
  metadataBase: new URL("https://scentsense.ai"),
  openGraph: {
    type: "website",
    title: "ScentSense AI – Never smell wrong again",
    description:
      "AI-powered fragrance recommendations for every moment. Your signature scent, picked for the moment you're about to walk into.",
    siteName: "ScentSense AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScentSense AI",
    description: "AI-powered fragrance recommendations for every moment.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0C0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('scentsense-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var mode = stored || (prefersDark ? 'dark' : 'light');
    if (mode === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
      </head>
      <body className="font-sans">
        <div className="relative min-h-screen grain bg-radial-spot">
          {children}
        </div>
      </body>
    </html>
  );
}
