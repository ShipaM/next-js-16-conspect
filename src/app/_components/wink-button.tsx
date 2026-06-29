"use client";

export function WinkButton({ name }: { name: string }) {
  return (
    <button
      onClick={() => alert(`Вы подмигнули ${name}!`)}
      className="ml-4 cursor-pointer"
    >
      Подмигнуть
    </button>
  );
}
