import Education from "@/components/etc/portofolio/Education";
import Experience from "@/components/etc/portofolio/Experience";
import Footer from "@/components/etc/portofolio/Footer";
import Hero from "@/components/etc/portofolio/Hero";
import Navbar from "@/components/etc/portofolio/Navbar";
import Projects from "@/components/etc/portofolio/Project";
import Skills from "@/components/etc/portofolio/Skills";
import Testimonials from "@/components/etc/portofolio/Testimonial";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gray-50 scrollbar-hide">
      <Navbar />
      <Hero />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      {/* <Testimonials /> */}
      <Footer />
    </main>
  );
}
