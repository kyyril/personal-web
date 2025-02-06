import { Data } from "@/lib/interfaces/data";

function Experience({ data }: { data: Data }) {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      {data.experiences.map((ex) => (
        <div key={ex.id} className="grid gap-1 relative">
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
        </div>
      ))}
    </div>
  );
}

export default Experience;
