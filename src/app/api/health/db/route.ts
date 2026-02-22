import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET() {
  const now = await prisma.$queryRaw`SELECT NOW() as now`;
  return NextResponse.json({ ok: true, now });
}