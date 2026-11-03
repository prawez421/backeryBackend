import CustomCakeHero from "@/components/main/custom-cakes/CustomCakeHero";
import CakeOccasions from "@/components/main/custom-cakes/CakeOccasions";
import CustomCakeForm from "@/components/main/custom-cakes/CustomCakeForm";
import CakeDesignGallery from "@/components/main/custom-cakes/CakeDesignGallery";
import HowItWorks from "@/components/main/custom-cakes/HowItWorks";
import CustomCakeCTA from "@/components/main/custom-cakes/CustomCakeCTA";

export default function CustomCakesPage() {
  return (
    <main>
      <CustomCakeHero />

      <CakeOccasions />

      <CakeDesignGallery />

      <HowItWorks />

      <CustomCakeForm />

      <CustomCakeCTA />
    </main>
  );
}