// 'use server'
/* eslint-disable indent */

import sharp from 'sharp'

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

export interface OptimizedImage {
  buffer: Buffer
  format: string
  width: number
  height: number
  size: number
}

const defaultOptions: ImageOptimizationOptions = {
  width: 1200, // Maximum width
  height: 1200, // Maximum height
  quality: 80, // Default quality (0-100)
  format: 'webp', // Convert to WebP by default
  fit: 'inside' // Preserve aspect ratio, fit inside dimensions
}

export async function optimizeImage(
  input: Buffer,
  customOptions?: Partial<ImageOptimizationOptions>
): Promise<OptimizedImage> {
  const options = { ...defaultOptions, ...customOptions }

  try {
    let sharpInstance = sharp(input)

    await sharpInstance.metadata()

    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize({
        width: options.width,
        height: options.height,
        fit: options.fit,
        withoutEnlargement: true
      })
    }

    switch (options.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: options.quality })
        break
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: options.quality })
        break
      case 'png':
        sharpInstance = sharpInstance.png({ quality: options.quality })
        break
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: options.quality })
        break
    }

    // Générer le buffer optimisé
    const outputBuffer = await sharpInstance.toBuffer({
      resolveWithObject: true
    })

    return {
      buffer: outputBuffer.data,
      format: options.format ?? 'webp',
      width: outputBuffer.info.width,
      height: outputBuffer.info.height,
      size: outputBuffer.info.size
    }
  } catch (error) {
    console.error(`Erreur lors de l'optimisation de l'image:`, error)
    throw new Error(
      `Échec de l'optimisation de l'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    )
  }
}

/**
 * Optimise une image depuis un objet File
 */
export async function optimizeImageFromFile(
  file: File,
  customOptions?: Partial<ImageOptimizationOptions>
): Promise<OptimizedImage> {
  // Convertir le File en ArrayBuffer puis en Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Détecter le format si non spécifié
  if (!customOptions?.format) {
    file.type.split('/')[1] as 'jpeg' | 'png' | 'webp' | 'avif'
    customOptions = { ...customOptions, format: 'webp' }
  }

  return optimizeImage(buffer, customOptions)
}

export const optimizationPresets = {
  thumbnail: {
    width: 400,
    height: 400,
    quality: 75,
    format: 'webp' as const
  },
  medium: {
    width: 800,
    height: 800,
    quality: 80,
    format: 'webp' as const
  },
  large: {
    width: 1200,
    height: 1200,
    quality: 85,
    format: 'webp' as const
  },
  missingPerson: {
    width: 1000,
    height: 1000,
    quality: 85,
    format: 'webp' as const,
    fit: 'inside' as const
  },
  article: {
    width: 1600,
    height: 900,
    quality: 85,
    format: 'webp' as const,
    fit: 'cover' as const
  }
}
