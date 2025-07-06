import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: [
          '/api/privada/',
          '/dashboard',
          '/dashboard/',     
          '/dashboard/*',
          '/profile/*',      
        ],
      },
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://bazarelegance.com.br/sitemap.xml',
  }
}