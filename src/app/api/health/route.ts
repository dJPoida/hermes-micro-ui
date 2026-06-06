import { NextResponse } from "next/server";

import { getBrandConfig } from "@/lib/brand";

export async function GET() {
  const brand = getBrandConfig();

  return NextResponse.json({
    ok: true,
    productName: brand.productName,
    assistantName: brand.assistantName,
    timestamp: new Date().toISOString(),
  });
}
