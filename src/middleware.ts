import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDataToken } from './utils/getDataToken'
 
export function middleware(request: NextRequest) {

    // const tokenId = getDataToken(request);

    const token = request.cookies?.get("token")?.value || ""

    const url = request.nextUrl.pathname

    if( token && (
        url.startsWith("/sign-in")||
        url.startsWith("/sign-up")||
        url.startsWith("/verify")
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }

    if( !token && (url.startsWith("/dashboard")) ){
        return NextResponse.redirect(new URL('/', request.url))
    }



}
 
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/verify/:path*",

  ],
}