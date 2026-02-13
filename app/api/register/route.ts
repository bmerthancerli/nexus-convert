import { NextRequest, NextResponse } from "next/server";
import { registeredUsers } from "@/lib/users";
import { DEMO_USERS } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "E-posta, şifre ve ad soyad zorunludur." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const isDemo = DEMO_USERS.some((u) => u.email === normalizedEmail);
    if (isDemo) {
      return NextResponse.json(
        { error: "Bu e-posta demo hesabına aittir. Giriş sayfasını kullanın." },
        { status: 400 }
      );
    }
    if (registeredUsers.has(normalizedEmail)) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    registeredUsers.set(normalizedEmail, {
      email: normalizedEmail,
      password,
      name: String(name).trim(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
