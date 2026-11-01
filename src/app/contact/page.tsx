import type { Metadata } from "next";
import { ContactContent } from "@/components/portfolio/content-sections";
import { PageIntro } from "@/components/portfolio/page-intro";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${profile.name} by email, phone, GitHub, or portfolio.`,
};

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="06 / Contact" title="Let's connect" description={`${profile.name} · ${profile.location}`} />
      <ContactContent />
    </>
  );
}
