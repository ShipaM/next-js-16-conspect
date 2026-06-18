import React from "react";

export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // throw new Error("Something went wrong");

  return (
    <div className="p-4 bg-emerald-50 border-2 border-emerald-500">
      <h1 className="text-xl font-bold text-bold text-emerald-700">
        Dashboard page
      </h1>
    </div>
  );
}
