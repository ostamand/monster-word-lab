import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/generate', '/error'],
    },
    sitemap: 'https://www.monsterwordlab.com/sitemap.xml',
  }
}
