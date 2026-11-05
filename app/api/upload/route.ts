
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "ImgBB API key is missing." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (image.size > 32 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size must be under 32 MB." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: "Image upload failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.data.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { message: "Something went wrong during image upload." },
      { status: 500 }
    );
  }
}
