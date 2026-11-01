import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { AboutContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";

export const metadata: Metadata = { title: "About", description: profile.summary };

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="01 / About" title="The developer behind DEV.OS" description={profile.headline} />
      <AboutContent />
      <Link href="/experience" className="mt-10 inline-block font-mono text-sm text-dev-accent hover:underline focus-visible:underline">Read work experience →</Link>
    </>
  );
}
