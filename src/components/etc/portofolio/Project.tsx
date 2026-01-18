"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Real Estate Listing App",
    image: "/projects/p1.jpg",
    tech: "Next.js, Tailwind, Node.js",
  },
  {
    title: "Personal Portfolio",
    image: "/projects/p2.jpg",
    tech: "Next.js, Framer Motion",
  },
  {
    title: "Travel App UI",
    image: "/projects/p3.jpg",
    tech: "Figma, React",
  },
];

export default function ShowcaseSection() {
  return (
    <section id="projects" className="py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          🌟 Showcase Projects 🌟
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-xl overflow-hidden shadow-md cursor-pointer bg-white"
            >
              <Image
                src={
                  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
                }
                alt={p.title}
                width={500}
                height={350}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.tech}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
