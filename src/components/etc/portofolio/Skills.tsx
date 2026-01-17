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
  { name: "expressjs", logo: "/assets/icons/expressjs.png" },
  { name: "javascript", logo: "/assets/icons/javascript.png" },
];

export default function SkillSection() {
  return (
    <section id="skills" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-10"
        >
          Skills & Technologies
        </motion.h2>

        {/* GRID ITEMS */}
        <div className="flex gap-8 flex-wrap justify-center">
          {skills.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.07 }}
              className="bg-white rounded-xl shadow-sm hover:cursor-pointer flex flex-col items-center justify-center gap-2 w-32.5 h-32.5"
            >
              <div className="w-20.5 h-20.5 relative">
                <Image
                  src={s.logo}
                  alt={s.name}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
