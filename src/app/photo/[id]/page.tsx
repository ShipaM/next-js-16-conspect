import { CARS } from "@/app/page";
import { notFound } from "next/navigation";
import Link from "next/link";

type PhotoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;

  const car = CARS.find((car) => car.id === id);

  if (!car) return notFound();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-10 pt-10">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          ← The Garage
        </Link>
        <span className="text-xs font-mono text-zinc-700">
          ID: {car.id}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">

        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mb-6 block">
          Full Page View
        </span>

        <h1 className="text-7xl font-black uppercase italic text-white leading-none mb-6 tracking-tighter">
          {car.name}
        </h1>

        <div className="h-px w-24 bg-linear-to-r from-transparent via-zinc-600 to-transparent mb-6" />

        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
          You are viewing the full page. Open from the list to see the intercepted modal version.
        </p>

      </div>

      {/* Bottom accent */}
      <div className="h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent" />

    </main>
  );
}
