"use client";

import { easeInOut, motion, Variants } from "framer-motion";
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
  const fadeIn = (
    direction: "up" | "down" | "left" | "right",
    delay: number,
  ): Variants => {
    return {
      hidden: {
        opacity: 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: easeInOut, // <-- FIXED
        },
      },
    };
  };

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

        {/* SKILLS LIST STYLE CONTOH GITHUB LOGOS */}
        <section className="w-full flex justify-around md:justify-between flex-wrap gap-x-4 gap-y-12 relative">
          {skills.map((s, i: number) => (
            <motion.div
              key={i}
              variants={fadeIn("up", i % 2 === 0 ? 0.5 : 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className={`h-20 flex items-center ${i % 2 === 0 ? "mt-12" : ""}`}
            >
              <div className="w-20 h-20 relative flex items-center justify-center">
                <Image
                  src={s.logo}
                  alt={s.name}
                  fill
                  className="object-contain transition duration-300 ease-in-out md:grayscale hover:grayscale-0 hover:cursor-pointer"
                />
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </section>
  );
}
