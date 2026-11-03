import BakeryCategories from "@/components/main/home/BakeryCategories";
import BestSellersSection from "@/components/main/home/BestSellersSection";
import CelebrationCakeSection from "@/components/main/home/CelebrationCakeSection";
import FAQSection from "@/components/main/home/FAQSection";
import FreshDeliverySection from "@/components/main/home/FreshDeliverySection";
import HeroSection from "@/components/main/home/HeroSection";
import HeroStats from "@/components/main/home/HeroStats";
import Testimonials from "@/components/main/home/Testimonials";
import WhyChooseUs from "@/components/main/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroStats />
      <BakeryCategories />
      <CelebrationCakeSection />
      <BestSellersSection />
      <FreshDeliverySection />
      <WhyChooseUs />
      <FAQSection />
      <Testimonials />

    </>
  );
}