import type { Metadata } from "next";
import { SiteShell } from "@/components/portfolio/site-shell";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | DEV.OS`,
    template: `%s | ${profile.name} · DEV.OS`,
  },
  description: `${profile.headline}. ${profile.experienceContext}.`,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DEV.OS",
    title: `${profile.name} | DEV.OS`,
    description: `${profile.headline}. ${profile.experienceContext}.`,
  },
  twitter: {
    card: "summary",
    title: `${profile.name} | DEV.OS`,
    description: `${profile.headline}. ${profile.experienceContext}.`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
