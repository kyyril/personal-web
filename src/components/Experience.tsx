import { Data } from "@/lib/interfaces/data";
import Image from "next/image";
import React from "react";

function formatDuration(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = endDate === "Present" ? new Date() : new Date(endDate);

  const monthDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(monthDiff / 12);
  const months = monthDiff % 12;

  const startMonth = start.toLocaleString("en-US", { month: "short" });
  const startYear = start.getFullYear();

  const endMonth =
    endDate === "Present"
      ? "Present"
      : end.toLocaleString("en-US", { month: "short" }) +
        " " +
        end.getFullYear();

  let durationText = "";
  if (years > 0) {
    durationText += `${years} yr`;
  }
  if (months > 0) {
    durationText += `${years > 0 ? " " : ""}${months} mo`;
  }
  if (durationText === "") {
    durationText = "0 mo";
  }

  return `${startMonth} ${startYear} - ${endMonth} · ${durationText}`;
}

function Experience({ data }: { data: Data }) {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      {data.experiences.map((ex) => (
        <div key={ex.id} className="grid gap-1 relative">
          <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2 dark:bg-gray-50" />

          <h4 className="text-xl font-semibold">{ex.job}</h4>
          <div className="flex flex-row">
            <span>
              <Image
                src={ex.image}
                width={30}
                height={30}
                alt="auto"
                loading="lazy"
                className="aspect-square mr-2 overflow-hidden object-cover object-center rounded-full"
              />
            </span>
            <h5>
              {ex.institution} - <span className="text-sm">{ex.status}</span>
            </h5>
          </div>
          <p className="opacity-65">
            {ex.location} - {ex.working}
          </p>
          <div className="text-sm opacity-65">
            {formatDuration(ex.startDate, ex.endDate)}
          </div>
          <p className="mt-2 text-sm">{ex.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Experience;
