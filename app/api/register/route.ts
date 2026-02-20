import { NextRequest, NextResponse } from "next/server";
import { registeredUsers } from "@/lib/users";
import { DEMO_USERS } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and full name are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const isDemo = DEMO_USERS.some((u) => u.email === normalizedEmail);
    if (isDemo) {
      return NextResponse.json(
        { error: "This email is a demo account. Please use the sign in page." },
        { status: 400 }
      );
    }
    if (registeredUsers.has(normalizedEmail)) {
      return NextResponse.json(
        { error: "This email address is already registered." },
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
      { error: "An error occurred." },
      { status: 500 }
    );
  }
}
