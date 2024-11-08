import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que no requieren autenticación
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

// Rutas específicas para roles
const teacherRoutes = ['/teacher', '/teacher/dashboard']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso a las rutas de invitación
  if (pathname.startsWith('/auth/register/')) {
    return NextResponse.next()
  }

  // Ignorar rutas públicas y archivos estáticos
  if (publicRoutes.includes(pathname) || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Verificar la sesión de Firebase
  const authToken = request.cookies.get('firebase-auth-token')?.value

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!authToken) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Si hay token pero es una página de auth, redirigir al dashboard
  if (authToken && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Para las rutas protegidas por rol, necesitaremos implementar la verificación
  // cuando tengamos la gestión de roles configurada en Firebase

  return NextResponse.next()
}

// Configurar las rutas que deben ser manejadas por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}