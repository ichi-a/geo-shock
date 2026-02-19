import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.redirect(
      new URL("/admin/logs", request.url)
    );
    response.cookies.set("admin_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=invalid", request.url)
  );
}
