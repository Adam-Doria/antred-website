import type { MetadataRoute } from 'next'
import { articles } from './(website)/conseils-pratiques/article'
console.log(articles)

const dynamicPaths: MetadataRoute.Sitemap = articles.map((item) => {
  return {
    url: `https://www.antred.fr/conseils-pratiques/${item.id}/${item.title}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5
  }
})

console.log(...dynamicPaths)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.antred.fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: 'https://www.antred.fr/antred',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://www.antred.fr/conseils-pratiques',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: 'https://www.antred.fr/nous-aider',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: 'https://www.antred.fr/disparitions',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    ...dynamicPaths
  ]
}
