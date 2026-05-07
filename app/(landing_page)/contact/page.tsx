import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import FAQ from "./components/FAQ";
import ScrollToTop from "../components/ScrollToTop";

export default function ContactPage() {
  return (
    <main className="bg-black">
      <ContactHero />
      
      {/* Form & Info Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-stretch max-w-7xl mx-auto">
            <div className="flex flex-col h-full">
              <ContactForm />
            </div>
            
            <div className="flex flex-col h-full">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      
      <ScrollToTop />
    </main>
  );
}