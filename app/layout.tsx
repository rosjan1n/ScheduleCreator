import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import SideNav from "@/components/navigation/SideNav";
import MarginWidthWrapper from "@/components/MarginWidthWrapper";
import PageWrapper from "@/components/PageWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kreator planu lekcji",
  description: "Created by Daniel Warpechowski",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      className={cn("text-slate-900 antialiased", inter.className)}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <SideNav />
            <MarginWidthWrapper>
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </Providers>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
