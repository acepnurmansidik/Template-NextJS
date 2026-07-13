// SSR
import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL } from "./utils/api";
import type { BodyIAMResponseApiDaum } from "./types/IAM";
import { BodyRoleResponseAPI } from "./types/module";

export async function middleware(request: NextRequest) {
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

  // Ambil path_access dari sumber yang sama dengan iamSlice (GET /users/iam).
  // Fokus hanya pada `path_access.path`.
  const allowedPaths = new Set<string>();
  const allPaths = new Set<string>();
  try {
    const [resultIAM, resultModules] = await Promise.all([
      axios.get<BodyIAMResponseApiDaum>(`${API_BASE_URL}/users/iam`, {
        headers: {
          "Content-Type": "application/json",
          // Teruskan cookie request agar backend tahu current user.
          cookie: request.headers.get("cookie") ?? "",
        },
        // Middleware jalan di Edge runtime -> paksa adapter fetch.
        adapter: "fetch",
      }),
      axios.get<BodyRoleResponseAPI>(`${API_BASE_URL}/module?limit=100000`, {
        headers: {
          "Content-Type": "application/json",
          // Teruskan cookie request agar backend tahu current user.
          cookie: request.headers.get("cookie") ?? "",
        },
        // Middleware jalan di Edge runtime -> paksa adapter fetch.
        adapter: "fetch",
      }),
    ]);

    const modulePaths = resultModules.data.data.flatMap((item) =>
      item.permission.flatMap((path) => path.path),
    );
    modulePaths.forEach((path) => allPaths.add(path));

    const paths =
      resultIAM.data?.data?.role_id?.path_access?.map(
        (access) => access.path,
      ) ?? [];
    paths.forEach((path) => allowedPaths.add(path));
  } catch {
    // Bila API gagal (termasuk status non-2xx yang dilempar axios),
    // allowedPaths tetap kosong (fail-closed) sehingga user diarahkan ke
    // access-denied daripada lolos tanpa pengecekan.
  }

  // validate for page not found
  if (!defaultAllowPath.has(pathname) && !allPaths.has(pathname)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Jika path tidak termasuk default-allow dan tidak ada dalam path_access user
  if (!defaultAllowPath.has(pathname) && !allowedPaths.has(pathname)) {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|data).*)"],
};
