"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function updateProductInfo() {
  updateTag("all-products");
}
