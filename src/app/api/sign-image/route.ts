import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const formData = await request.formData();

  const image = formData.get('file') as File;
  console.log(image)
  return NextResponse.json({ msg : image}, {
    status: 200,
  })
}