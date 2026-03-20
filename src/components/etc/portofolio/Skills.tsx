"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  { name: "Node.js", logo: "/assets/icons/nodejs.png" },
  { name: "Docker", logo: "/assets/icons/docker.png" },
  { name: "Next.js", logo: "/assets/icons/nextjs.png" },
  { name: "React", logo: "/assets/icons/reactjs.png" },
  { name: "MongoDB", logo: "/assets/icons/mongodb.png" },
  { name: "Tailwind", logo: "/assets/icons/tailwind.png" },
  { name: "Go", logo: "/assets/icons/go.png" },
  { name: "Flutter", logo: "/assets/icons/flutter.png" },
  { name: "Dart", logo: "/assets/icons/dart.png" },
  { name: "Express", logo: "/assets/icons/expressjs.png" },
  { name: "JavaScript", logo: "/assets/icons/javascript.png" },
];

export default function SkillSection() {
  return (
    <section
      id="skills"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Tech Stack & Tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Technologies I utilize to bring ideas to life, from scalable backend
            architectures to dynamic frontend interfaces.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {skills.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col hover:cursor-pointer items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative w-12 h-12 md:w-14 md:h-14 mb-3 p-2 flex items-center justify-center transition-colors">
                <Image
                  src={s.logo}
                  alt={s.name}
                  fill
                  // {/* Penjelasan Perubahan Shadow (Tailwind v4):
                  //   1. Mengubah 'shadow' (box-shadow) menjadi 'drop-shadow'.
                  //   2. Di Light Mode: drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] -> Bayangan hitam yang lebih jelas dan opaque.
                  //   3. Di Dark Mode: dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] -> Bayangan putih yang soft untuk efek glow/halo.
                  // */}
                  className="object-contain p-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] group-hover:scale-125 transition-all duration-300"
                  // className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                {s.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
