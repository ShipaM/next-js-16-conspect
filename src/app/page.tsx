import Link from "next/link";

export const CARS = [
  { id: "1", name: "Porsche 911" },
  { id: "2", name: "Aston Martin DB12" },
  { id: "3", name: "Audi RS6" },
];

export default function Home() {
  return (
    <main className="p-10 bg-black min-h-screen">
      <h1 className="text-3xl font-black text-white mb-10 uppercase italic">
        The Garage
      </h1>
      <div className="flex gap-4">
        {CARS.map((car) => (
          <Link
            key={car.id}
            href={`/photo/${car.id}`}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-white hover:border-blue-500 transition-all"
          >
            {car.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
