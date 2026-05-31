// SSR
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_IAM } from "./utils/permission";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultAllowPath = new Set<string>([
    "/auth/login",
    "/auth/register",
    "/",
  ]);

  // Lewati pengecekan untuk asset, api, dan halaman error
  if (pathname.startsWith("/_next") || pathname === "/access-denied") {
    return NextResponse.next();
  }

  // Jika sedang di halaman default allow, jangan divalidasi, langsung lanjut
  if (defaultAllowPath.has(pathname)) {
    return NextResponse.next();
  }

  // // WARNING: PAKAI COOKIES ===========================================================
  // // 1. Ambil cookie
  // const cookieValue = request.cookies.get("user_permissions")?.value;

  // // Jika tidak ada cookie, arahkan ke login
  // if (!cookieValue) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // try {
  //   // Decode data cookie
  //   const allowedPaths: string[] = JSON.parse(decodeURIComponent(cookieValue));

  //   // 4. Cek apakah pathname saat ini ada di dalam daftar akses user
  //   if (!allowedPaths.includes(pathname)) {
  //     // Jika path terlarang dan bukan halaman access-denied itu sendiri
  //     if (pathname === "/access-denied") return NextResponse.next();
  //     return NextResponse.redirect(new URL("/access-denied", request.url));
  //   }

  //   return NextResponse.next();
  // } catch (error) {
  //   // Jika data cookie rusak, hapus cookie dan redirect ke login
  //   const response = NextResponse.redirect(new URL("/auth/login", request.url));
  //   response.cookies.delete("user_permissions");
  //   return response;
  // }

  // =====================================================================================

  // WARNING: DUMMY DATA =================================================================
  const allowedPaths = new Set<string>();
  USER_IAM.forEach((mod) => {
    mod.permission.forEach((p) => {
      allowedPaths.add(p.path);
      p.children.forEach((c) => allowedPaths.add(c.path));
    });
  });

  // Jika path bukan dashboard dan tidak ada dalam daftar izin
  if (!defaultAllowPath.has(pathname) && !allowedPaths.has(pathname)) {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|data).*)"],
};
