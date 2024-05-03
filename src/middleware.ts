import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "./utils/server/session";

const protectedRoutes = ["/panel"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = !protectedRoutes.includes(path);

  if (isPublicRoute || (await isAuthorized())) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}
