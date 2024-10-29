export default function Detailproject({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <section className="h-[90vh] max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto">
      <h1>{params.slug.replace(/%20|%/g, " ")}</h1>
      <p>koming sun</p>
    </section>
  );
}
