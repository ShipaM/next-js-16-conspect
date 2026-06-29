import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

async function fetchProduct(id: string) {
  "use cache";

  cacheLife("hours");

  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (!res.ok) {
    notFound();
  }
  const data = await res.json();

  return data;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await fetchProduct(id);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-white mt-2">{product.title}</h1>
      <p className="text-gray-400 mt-4">{product.description}</p>
      <div className="text-2xl font-mono text-white mt-6">${product.price}</div>
    </div>
  );
}
