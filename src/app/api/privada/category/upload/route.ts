import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { mkdirSync, existsSync } from "fs";
import { requireAdmin } from "@/utils/auth";

export const POST = async (request: Request) => {

  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "categoriesImg");

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  const imageUrl = `/categoriesImg/${fileName}`;
  return NextResponse.json({ imageUrl });
};
