"use client";

import { Experiences } from "@/types/profile";
import { motion } from "framer-motion";

interface DataProps {
  initiateData: Experiences[] | [];
}

export default function ExperienceSection({ initiateData }: DataProps) {
  return (
    <section id="experience" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-start mb-16"
        >
          ⚙️ Experience
        </motion.h2>

        {/* GARIS UTAMA (menyambung) */}
        <div className="relative ml-6">
          <div className="absolute left-0 top-0 w-px h-full bg-black"></div>

          {initiateData.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="mb-12 ml-6 relative"
            >
              {/* GARIS L */}
              <div className="absolute -left-6 top-6 w-6 h-px bg-black"></div>

              {/* CARD */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-xl">{exp.role}</h3>
                <p className="text-sm text-gray-600">
                  {exp.company_name} • {exp.type}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  {exp.start_date} - {exp.end_date}
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  {exp.list_task &&
                    exp.list_task.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
