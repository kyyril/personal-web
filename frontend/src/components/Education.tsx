import { Data } from "../lib/interfaces/data";
import React from "react";

function Education({ data }: { data: Data }) {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      {data.education.map((ed) => (
        <div key={ed.id} className="grid gap-1 relative">
          <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2 dark:bg-gray-50" />

          <h4 className="text-xl font-semibold">{ed.degree}</h4>
          <h5 className="font-medium">{ed.institution}</h5>
          <div className="text-sm">
            {ed.startDate} - {ed.endDate}
          </div>
          <p className="mt-2 text-sm opacity-70">{ed.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Education;
