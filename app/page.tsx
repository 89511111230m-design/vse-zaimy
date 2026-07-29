import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Offers from "@/components/Offers";
import Reviews from "@/components/Reviews";
import WhyUs from "@/components/WhyUs";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import { offerCategories } from "@/lib/catalog";
import { getCatalogOffers } from "@/lib/supabase";

export const revalidate = 300;

export default async function Home() {
  const offers = await getCatalogOffers();
  const categories = offerCategories(offers);
  const categoryNames = categories.map((category) => category.name);
  return (
    <>
      <Header />

      <Hero />

      <Stats categoryCount={categories.length} />

      <Categories categories={categories} />

      <HowItWorks />

      <Offers offers={offers} />

      <WhyUs />

      <Reviews />

      <LeadForm categories={categoryNames} />

      <Footer />
    </>
  );
}
