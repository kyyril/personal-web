import { Data } from "../lib/interfaces/data";
import React from "react";

function Education({ data }: { data: Data }) {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      {data.education.map((ed) => (
        <div key={ed.id} className="grid gap-1 relative">
          <div className="aspect-square w-3 bg-muted-foreground/30 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2" />

          <h3 className="text-xl font-semibold text-foreground">{ed.degree}</h3>
          <h4 className="font-medium text-foreground/90">{ed.institution}</h4>
          <div className="text-sm text-muted-foreground mt-1">
            {ed.startDate} - {ed.endDate}
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {ed.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Education;
