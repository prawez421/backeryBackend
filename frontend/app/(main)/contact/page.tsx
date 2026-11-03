import ContactHero from "@/components/main/contact/ContactHero";
import ContactInfo from "@/components/main/contact/ContactInfo";
import ContactForm from "@/components/main/contact/ContactForm";
import OpeningHours from "@/components/main/contact/OpeningHours";
import BakeryLocation from "@/components/main/contact/BakeryLocation";



export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <OpeningHours />
      <BakeryLocation />
     
      
    </main>
  );
}