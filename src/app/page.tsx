import { ChapterHero } from "@/components/home/chapter-hero";
import { ChapterDna } from "@/components/home/chapter-dna";
import { ChapterJourney } from "@/components/home/chapter-journey";
import { ChapterSystem } from "@/components/home/chapter-system";
import { ChapterClosing } from "@/components/home/chapter-closing";
import { ScrollProgressRail } from "@/components/home/scroll-progress-rail";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-clip">
      {/* Chapter 01: The Engineer (Hero Stage & Procedural 3D Stage) */}
      <div className="relative z-10 w-full">
        <ChapterHero />
      </div>

      {/* Chapter 02: Engineering DNA (Verified Skill Categories & Toolchains) */}
      <div className="relative z-20 w-full border-t border-dev-border/70 bg-dev-bg/95 shadow-[0_-20px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-sm transition-opacity duration-reveal">
        <ChapterDna />
      </div>

      {/* Chapter 03: The Journey (Verified Career & Academic Timeline) */}
      <div className="relative z-30 w-full border-t border-dev-border/70 bg-dev-bg/95 shadow-[0_-20px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-sm transition-opacity duration-reveal">
        <ChapterJourney />
      </div>

      {/* Chapter 04: Inside the System (Interactive Architecture & Data Pipelines) */}
      <div className="relative z-40 w-full border-t border-dev-border/70 bg-dev-bg/95 shadow-[0_-20px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-sm transition-opacity duration-reveal">
        <ChapterSystem />
      </div>

      {/* Chapter 05: Let's Build Something (Closing Action Hub & Recruiter Quick Reference) */}
      <div className="relative z-50 w-full border-t border-dev-border/70 bg-dev-bg/95 shadow-[0_-20px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-sm transition-opacity duration-reveal">
        <ChapterClosing />
      </div>

      {/* Fixed Vertical Scroll Progress Rail (hidden on mobile, visible on md: and above) */}
      <ScrollProgressRail />
    </div>
  );
}
