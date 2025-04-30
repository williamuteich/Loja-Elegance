import { requireAdmin } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  const { path } = await request.json();
  if (typeof path === "string") {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  }
  return NextResponse.json({ revalidated: false }, { status: 400 });
}
