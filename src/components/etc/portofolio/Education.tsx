"use client";

import { EducationsDaum } from "@/types/profile";
import { motion } from "framer-motion";

interface DataProps {
  initiateData: EducationsDaum[] | [];
}

export default function EducationSection({ initiateData }: DataProps) {
  return (
    <section
      id="education"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center"
        >
          Education
        </motion.h2>

        <div className="relative border-l border-gray-200 dark:border-slate-800 ml-3 md:ml-6">
          {initiateData.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-10 pl-8 md:pl-12 relative group"
            >
              {/* Dot Indicator */}
              <div className="absolute w-4 h-4 bg-white dark:bg-slate-900 border-4 border-gray-400 dark:border-gray-500 rounded-full -left-2.25 top-1.5 group-hover:border-black dark:group-hover:border-white transition-colors duration-300"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 gap-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <span className="text-xs font-medium px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-full w-fit transition-colors">
                  {edu.start_date} - {edu.end_date}
                </span>
              </div>
              <p className="text-md text-gray-600 dark:text-gray-400 font-medium">
                {edu.school_name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
