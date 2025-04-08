import { createServerClient } from './server'
import { v4 as uuidv4 } from 'uuid'
import {
  optimizeImageFromFile,
  optimizationPresets,
  type ImageOptimizationOptions,
  type OptimizedImage // Assure-toi que ce type est exporté depuis sizeOptimizer.ts si nécessaire
} from '../images/sizeOptimizer' // Ajuste le chemin si nécessaire

// --- Interfaces ---

export type StorageOptions = {
  bucketName: string
  folderPath?: string
  // 'makePublic' n'est plus utilisé ici car la configuration se fait via le dashboard
  fileSizeLimit?: number // Limite définie dans le dashboard, peut être utile pour validation client préalable
  filePrefix?: string
  optimizationPreset?: keyof typeof optimizationPresets | null
  customOptimization?: ImageOptimizationOptions
}

export type UploadResult = {
  path: string // Chemin dans le bucket (ex: 'images/mon_fichier.webp')
  url: string // URL publique complète
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
  }
}

// --- Constantes (Presets) ---

export const STORAGE_PRESETS = {
  missingPersons: {
    bucketName: 'missing-persons', // Assure-toi que ce bucket existe dans Supabase
    folderPath: 'images',
    fileSizeLimit: 5 * 1024 * 1024, // 5MB (pour référence ou validation client)
    filePrefix: 'person',
    optimizationPreset: 'missingPerson' as const
  },
  articles: {
    bucketName: 'content', // Assure-toi que ce bucket existe dans Supabase
    folderPath: 'articles',
    fileSizeLimit: 10 * 1024 * 1024, // 10MB (pour référence ou validation client)
    filePrefix: 'article',
    optimizationPreset: 'article' as const
  }
  // Ajoute d'autres presets si nécessaire
}

// --- Fonctions Utilitaires ---

/**
 * Vérifie si un fichier est de type image.
 */
function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Extrait le bucket et le chemin à partir d'une URL de stockage Supabase publique.
 * @param url L'URL publique complète du fichier.
 * @returns Un objet avec le nom du bucket et le chemin du fichier, ou null si l'URL est invalide.
 */
export function parseSupabaseUrl(
  url: string
): { bucket: string; path: string } | null {
  // Format typique: https://<project_ref>.supabase.co/storage/v1/object/public/<bucket-name>/<path/to/file.ext>
  try {
    const urlObject = new URL(url)
    // Recherche la partie après /public/
    const pathSegments = urlObject.pathname.match(
      /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/
    )

    if (pathSegments && pathSegments.length === 3) {
      return {
        bucket: pathSegments[1], // Le nom du bucket
        path: pathSegments[2] // Le reste est le chemin
      }
    }
    console.warn(`Format d'URL Supabase non reconnu:`, url)
    return null
  } catch (error) {
    console.error(`Impossible d'analyser l'URL:`, url, error)
    return null
  }
}

// --- Fonctions Principales (Serveur Uniquement) ---

/**
 * Uploade un fichier vers un bucket Supabase spécifié, avec optimisation optionnelle.
 * IMPORTANT: Cette fonction s'exécute côté serveur et assume que le bucket existe déjà.
 * @param file Le fichier à uploader.
 * @param options Les options de stockage (bucket, chemin, optimisation, etc.).
 * @param itemId Un identifiant optionnel à inclure dans le nom de fichier (ex: ID de la personne disparue).
 * @returns Une promesse résolue avec les détails de l'upload réussi.
 */
export async function uploadFile(
  file: File,
  options: StorageOptions,
  itemId?: string
): Promise<UploadResult> {
  // Crée une instance client Supabase pour cette requête serveur
  const supabase = await createServerClient()

  const {
    bucketName,
    folderPath = '',
    filePrefix = '',
    optimizationPreset,
    customOptimization
  } = options

  // Logique d'optimisation d'image (si applicable)
  let optimizationOptions: ImageOptimizationOptions | undefined
  if (optimizationPreset && optimizationPreset in optimizationPresets) {
    optimizationOptions = optimizationPresets[optimizationPreset]
  } else if (customOptimization) {
    optimizationOptions = customOptimization
  }

  let fileContent: ArrayBuffer | Buffer
  let fileMetadata: UploadResult['metadata'] = {}
  let fileExtension: string
  let contentType: string

  if (isImageFile(file) && optimizationOptions) {
    console.log(
      `Optimisation de l'image "${file.name}" avec preset/options:`,
      optimizationOptions
    )
    try {
      const optimizedImage: OptimizedImage = await optimizeImageFromFile(
        file,
        optimizationOptions
      )
      fileContent = optimizedImage.buffer
      fileMetadata = {
        width: optimizedImage.width,
        height: optimizedImage.height,
        format: optimizedImage.format,
        size: optimizedImage.size
      }
      fileExtension = optimizedImage.format
      contentType = `image/${fileExtension}`
      console.log(
        `Image optimisée: ${optimizedImage.width}x${optimizedImage.height}, ${optimizedImage.size} octets, format ${fileExtension}`
      )
    } catch (optError) {
      console.error(`Échec de l'optimisation pour ${file.name}:`, optError)
      // Fallback: Uploader l'image originale si l'optimisation échoue? Ou lancer une erreur?
      // Ici, on lance une erreur pour être strict. Adapte si nécessaire.
      throw new Error(`Échec de l'optimisation de l'image ${file.name}`)
    }
  } else {
    fileContent = await file.arrayBuffer()
    fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    contentType = file.type || 'application/octet-stream' // Type MIME du fichier original
    fileMetadata = { size: file.size } // Taille originale
    console.log(`Upload du fichier "${file.name}" sans optimisation.`)
  }

  // Générer un nom de fichier unique
  const uniqueId = uuidv4()
  const baseName = filePrefix
    ? `${filePrefix}_${itemId || 'item'}_${uniqueId}`
    : `${itemId || 'item'}_${uniqueId}`
  const fileName = `${baseName}.${fileExtension}`
  const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

  console.log(`Tentative d'upload vers: ${bucketName}/${filePath}`)

  // Upload vers Supabase Storage
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileContent, {
      contentType: contentType,
      upsert: true // Remplace si le fichier existe (utile en cas de retry ou nom identique)
    })

  if (error) {
    console.error(
      `Erreur lors du téléchargement vers "${bucketName}/${filePath}":`,
      error
    )
    // Rendre l'erreur plus spécifique si possible
    if (error.message.toLowerCase().includes('bucket not found')) {
      throw new Error(
        `Échec du téléchargement: Le bucket "${bucketName}" n'a pas été trouvé. Veuillez le créer dans le dashboard Supabase.`
      )
    }
    throw new Error(`Échec du téléchargement Supabase: ${error.message}`)
  }

  console.log(`Upload réussi pour: ${bucketName}/${filePath}`)

  // Obtenir l'URL publique du fichier uploadé
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  if (!publicUrlData?.publicUrl) {
    console.error(
      `Impossible d'obtenir l'URL publique pour ${bucketName}/${filePath}`
    )
    // C'est un problème grave si l'upload a réussi mais qu'on ne peut pas obtenir l'URL
    throw new Error(
      `Upload réussi mais impossible de récupérer l'URL publique pour ${filePath}`
    )
  }

  console.log('URL Publique:', publicUrlData.publicUrl)

  return {
    path: filePath, // Retourne le chemin relatif dans le bucket
    url: publicUrlData.publicUrl, // Retourne l'URL publique complète
    metadata: fileMetadata
  }
}

/**
 * Supprime un fichier d'un bucket Supabase.
 * @param filePath Le chemin complet du fichier dans le bucket (ex: 'images/mon_fichier.webp').
 * @param bucketName Le nom du bucket.
 */
export async function deleteFile(
  filePath: string,
  bucketName: string
): Promise<void> {
  const supabase = await createServerClient()

  console.log(`Tentative de suppression: ${bucketName}/${filePath}`)

  // Vérifie si le chemin est valide
  if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
    console.warn('Chemin de fichier invalide pour la suppression:', filePath)
    return // Ne rien faire si le chemin est invalide
  }

  const { error } = await supabase.storage.from(bucketName).remove([filePath])

  if (error) {
    // Log l'erreur mais ne la relance pas forcément, pour permettre la continuation
    // d'autres opérations (par exemple, la mise à jour de la DB même si une suppression d'image échoue)
    console.error(
      `Erreur lors de la suppression du fichier "${bucketName}/${filePath}":`,
      error
    )
    // Optionnel: throw new Error(`Échec de la suppression: ${error.message}`);
  } else {
    console.log(`Fichier supprimé avec succès: ${bucketName}/${filePath}`)
  }
}

/**
 * Uploade plusieurs fichiers séquentiellement vers Supabase.
 */
export async function uploadMultipleFiles(
  files: File[],
  options: StorageOptions,
  itemId?: string
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  const errors: { file: string; error: string }[] = []

  for (const file of files) {
    try {
      const result = await uploadFile(file, options, itemId)
      results.push(result)
    } catch (error) {
      console.error(`Échec de l'upload pour le fichier ${file.name}:`, error)
      errors.push({
        file: file.name,
        error: error instanceof Error ? error.message : String(error)
      })
      // Décider si on arrête tout ou si on continue avec les autres fichiers
      // Ici, on continue mais on garde une trace des erreurs.
    }
  }

  // Optionnel: Gérer les erreurs globales si nécessaire
  if (errors.length > 0) {
    console.warn(
      `Certains uploads ont échoué: ${errors.map((e) => e.file).join(', ')}`
    )
    // Tu pourrais choisir de lancer une erreur ici si *aucun* upload n'a réussi, par exemple.
    // if (results.length === 0) {
    //   throw new Error(`Aucun fichier n'a pu être uploadé. Erreurs: ${JSON.stringify(errors)}`);
    // }
  }

  return results
}

// --- Raccourcis Spécifiques ---

/**
 * Raccourci pour l'upload d'images de personnes disparues.
 */
export async function uploadMissingPersonImage(
  file: File,
  personId?: string
): Promise<UploadResult> {
  return uploadFile(file, STORAGE_PRESETS.missingPersons, personId)
}

/**
 * Raccourci pour l'upload de plusieurs images de personnes disparues.
 */
export async function uploadMissingPersonImages(
  files: File[],
  personId?: string
): Promise<UploadResult[]> {
  return uploadMultipleFiles(files, STORAGE_PRESETS.missingPersons, personId)
}

/**
 * Raccourci pour l'upload d'images d'articles.
 */
export async function uploadArticleImage(
  file: File,
  articleId?: string
): Promise<UploadResult> {
  return uploadFile(file, STORAGE_PRESETS.articles, articleId)
}

/**
 * Raccourci pour l'upload de plusieurs images d'articles.
 */
export async function uploadArticleImages(
  files: File[],
  articleId?: string
): Promise<UploadResult[]> {
  return uploadMultipleFiles(files, STORAGE_PRESETS.articles, articleId)
}
