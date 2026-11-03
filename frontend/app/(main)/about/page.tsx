import AboutHero from "@/components/main/about/AboutHero";
import WhyChooseUs from "@/components/main/about/WhyChooseUs";
import OurProcess from "@/components/main/about/OurProcess";
import MeetOurBakers from "@/components/main/about/MeetOurBakers";
import AboutStats from "@/components/main/about/AboutStats";
import OurMission from "@/components/main/about/OurMission";


export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <WhyChooseUs />
      <OurMission />
      <OurProcess />
      <MeetOurBakers />
      <AboutStats />
  
    </main>
  );
}