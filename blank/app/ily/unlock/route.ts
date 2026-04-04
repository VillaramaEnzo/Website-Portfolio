import { NextResponse } from "next/server";
import {
  getIlyAuthCookieOptions,
  verifyIlyQrUnlockToken,
} from "@/lib/ilyAuth";

function redirectToLogin(requestUrl: string, qrStatus: "invalid" | "expired" = "invalid") {
  const loginUrl = new URL("/ily/login", requestUrl);
  loginUrl.searchParams.set("error", "1");
  loginUrl.searchParams.set("qr", qrStatus);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");
  const isValid = verifyIlyQrUnlockToken(token);

  if (!isValid) {
    return redirectToLogin(request.url);
  }

  const response = NextResponse.redirect(new URL("/ily", request.url));
  response.cookies.set(getIlyAuthCookieOptions());
  return response;
}

