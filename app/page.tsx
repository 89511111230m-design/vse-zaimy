import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <WhyUs />
      <HowItWorks />
      <LeadForm />
    </>
  );
}