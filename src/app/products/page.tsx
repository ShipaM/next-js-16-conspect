import { cacheLife, cacheTag } from "next/cache";

async function fetchProducts() {
  "use cache";

  // cacheLife("hours");
  cacheLife({ stale: 60, revalidate: 120, expire: 3600 });
  cacheTag("all-products");

  const res = await fetch("https://dummyjson.com/products?limit=5");

  const data = await res.json();

  return data.products;
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="p-6 bg-gray-900 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-white">Популярные товары</h2>
      <ul className="space-y-2">
        {products.map((product: any) => (
          <li
            key={product.id}
            className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between"
          >
            <span className="text-gray-300">{product.title}</span>
            <span className="text-emerald-400 font-mono">${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
