"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Real Estate Listing App",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tech: ["Next.js", "Tailwind", "Node.js"],
    desc: "A comprehensive platform for buying and renting properties with advanced search filters.",
  },
  {
    title: "Nashtanet Internal ERP",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tech: ["Go", "Microservices", "Docker"],
    desc: "Microservices-based backend architecture for internal company resource planning.",
  },
  {
    title: "Building Management System",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Express", "MongoDB"],
    desc: "Application to manage apartments, integrating backend, frontend, and mobile platforms.",
  },
];

export default function ShowcaseSection() {
  return (
    <section
      id="projects"
      className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:flex justify-between items-end">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Featured Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 max-w-xl"
            >
              A selection of some of my recent work, highlighting fullstack
              development and system architecture.
            </motion.p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-slate-800 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 grow">
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {p.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
