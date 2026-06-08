import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace with actual domain when deployed
  const baseUrl = 'https://sakshisrivastava.dev';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
