import { getDB } from './database/db'

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

type SlugTable = 'articles' | 'categories' | 'tags'
export async function generateUniqueSlug(
  title: string,
  tableName: SlugTable,
  currentId?: string
): Promise<string> {
  const db = getDB()
  const baseSlug = slugify(title)
  let uniqueSlug = baseSlug
  let counter = 1

  // Boucle pour vérifier l'unicité et ajouter un suffixe si nécessaire
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = db
      .selectFrom(tableName)
      .select('id')
      .where('slug', '=', uniqueSlug)

    if (currentId) {
      query = query.where('id', '!=', currentId)
    }

    const existing = await query.executeTakeFirst()

    if (!existing) {
      return uniqueSlug
    }

    uniqueSlug = `${baseSlug}-${counter}`
    counter++

    if (counter > 100) {
      console.error('Impossible de générer un slug unique pour:', title)
      return `${baseSlug}-${Date.now()}`
    }
  }
}
