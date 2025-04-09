'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface UploadedImage {
  url: string
  file?: File
  path?: string
  isNew?: boolean
  isUploading?: boolean
}

const ItemTypes = {
  IMAGE: 'image'
}

interface DraggableImageProps {
  image: UploadedImage
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  onRemove: () => void
  disabled?: boolean
}

function DraggableImage({
  image,
  index,
  moveImage,
  onRemove,
  disabled
}: DraggableImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !disabled
  })

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()

      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientX = clientOffset!.x - hoverBoundingRect.left

      // Ne déplacer que lorsque la souris a dépassé la moitié de la hauteur de l'élément
      // Lors du glissement vers le bas, ne déplacer que lorsque le curseur est au-dessous de 50%
      // Lors du glissement vers le haut, ne déplacer que lorsque le curseur est au-dessus de 50%

      // Glissement vers la gauche
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      // Glissement vers la droite
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return

      // Effectuer l'action
      moveImage(dragIndex, hoverIndex)

      // Remarque: nous mutons l'élément de surveillance ici!
      // En général, c'est mieux d'éviter les mutations,
      // mais c'est utile ici pour la performance pour éviter les calculs coûteux de React DnD.
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={cn(
        'group relative aspect-square rounded-md border bg-background',
        isDragging && 'opacity-50',
        !disabled && 'cursor-move'
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src={image.url}
          alt="Image uploadée"
          fill
          className="object-cover"
        />
        {image.isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
            Chargement...
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface ImageDndUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxFiles?: number
  className?: string
  disabled?: boolean
}

function ImageDndUploadContent({
  images = [],
  onImagesChange,
  maxFiles = 5,
  className,
  disabled = false
}: ImageDndUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Gestion du drag & drop
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images]
    const draggedImage = newImages[dragIndex]

    // Retirer l'élément glissé du tableau
    newImages.splice(dragIndex, 1)
    // Insérer l'élément à la nouvelle position
    newImages.splice(hoverIndex, 0, draggedImage)

    onImagesChange(newImages)
  }

  // Gestion de la sélection de fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)
    const filesToAdd = selectedFiles.slice(0, maxFiles - images.length)

    if (filesToAdd.length === 0) return

    // Créer des URLs pour prévisualiser les nouvelles images
    const newImages = filesToAdd.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isNew: true,
      isUploading: false
    }))

    onImagesChange([...images, ...newImages])

    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Supprimer une image
  const removeImage = (index: number) => {
    const newImages = [...images]
    // Si c'est une image nouvellement uploadée, on révoque son URL pour éviter les fuites mémoire
    if (newImages[index].isNew && newImages[index].url) {
      URL.revokeObjectURL(newImages[index].url)
    }
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  // Gérer le glisser-déposer de fichiers
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled || images.length >= maxFiles) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/webp'
      )

      const filesToAdd = droppedFiles.slice(0, maxFiles - images.length)

      if (filesToAdd.length === 0) return

      // Créer des URLs pour prévisualiser les nouvelles images
      const newImages = filesToAdd.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        isNew: true,
        isUploading: false
      }))

      onImagesChange([...images, ...newImages])
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <DraggableImage
            key={`${image.url}_${index}`}
            image={image}
            index={index}
            moveImage={moveImage}
            onRemove={() => removeImage(index)}
            disabled={disabled}
          />
        ))}

        {images.length < maxFiles && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className={cn(
              'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-background p-4 text-center transition-colors hover:bg-muted/50',
              isDragOver && 'border-brand-500 bg-brand-50',
              (disabled || images.length >= maxFiles) &&
                'cursor-not-allowed opacity-50'
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              if (!disabled) setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              disabled={disabled || images.length >= maxFiles}
            />
            <ImageIcon className="mb-2 h-10 w-10 text-gray-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Déposer une image ici
              </p>
              <p className="text-xs text-gray-400">
                ou cliquez pour en sélectionner
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">
        {images.length} sur {maxFiles} images ajoutées
      </div>
    </div>
  )
}

// Composant wrapper avec DndProvider
export function ImageDndUpload(props: ImageDndUploadProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ImageDndUploadContent {...props} />
    </DndProvider>
  )
}
