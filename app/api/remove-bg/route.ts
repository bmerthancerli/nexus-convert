import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@imgly/background-removal-node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE_MB = 10;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Görsel dosyası bulunamadı." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Dosya çok büyük. Maksimum ${MAX_SIZE_MB} MB desteklenir.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const result = await removeBackground(blob);

    const buffer = Buffer.from(await result.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="removed-bg.png"`,
      },
    });
  } catch (err) {
    console.error("remove-bg error:", err);
    const message = err instanceof Error ? err.message : "Arka plan kaldırma sırasında bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
