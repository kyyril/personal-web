"use client";
import { Data } from "@/lib/interfaces/data";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

function Experience({ data }: { data: Data }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10"
    >
      {data.experiences.map((ex) => (
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-1 relative"
        >
          <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2 dark:bg-gray-50" />

          <h4 className="text-xl font-semibold">{ex.job}</h4>
          <div className="flex flex-row gap-x-2">
            <h5>
              {ex.institution} - <span className="text-sm">{ex.status}</span>
            </h5>
          </div>
          <p>
            {ex.location} - {ex.working}
          </p>
          <div className="text-sm">
            {ex.startDate} - {ex.endDate}
          </div>
          <p className="mt-2 text-sm opacity-65">{ex.description}</p>

          {/* Technologies Section */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {ex.technologies
                  ?.slice(0, expandedId === ex.id ? undefined : 3)
                  .map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="px-2 py-1 text-xs rounded-full bg-custom/10 text-custom"
                    >
                      {tech}
                    </motion.span>
                  ))}
              </AnimatePresence>

              {ex.technologies && ex.technologies.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === ex.id ? null : ex.id)
                    }
                    className="px-2 py-1 h-7 text-xs group"
                  >
                    {expandedId === ex.id ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                      >
                        Show Less <ChevronUpIcon className="ml-1 h-3 w-3" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        initial={{ y: -5 }}
                        animate={{ y: 0 }}
                      >
                        +{ex.technologies.length - 3} More{" "}
                        <ChevronDownIcon className="ml-1 h-3 w-3" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Experience;
