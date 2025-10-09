// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import {locales} from './config'

export default createMiddleware({
    locales,
    defaultLocale: 'ru',
    localePrefix: 'as-needed',
})

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|icons|avatars|.*\\..*).*)',
        '/'
    ]
}