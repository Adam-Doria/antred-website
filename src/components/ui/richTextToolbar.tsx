// src/components/ui/RichTextToolbar.tsx
'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading1,
  Heading3,
  Quote,
  Undo,
  Redo,
  Code,
  Minus
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

interface RichTextToolbarProps {
  // Renommé
  editor: Editor | null
  disabled?: boolean
}

export function RichTextToolbar({
  editor,
  disabled = false
}: RichTextToolbarProps) {
  // Renommé
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border-b border-input bg-transparent p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled || !editor.can().toggleBold()}
        aria-label="Gras"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled || !editor.can().toggleItalic()}
        aria-label="Italique"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={disabled || !editor.can().toggleStrike()}
        aria-label="Barré"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-6 w-px bg-input" />

      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        disabled={disabled || !editor.can().toggleHeading({ level: 1 })}
        aria-label="Titre 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        disabled={disabled || !editor.can().toggleHeading({ level: 2 })}
        aria-label="Titre 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        disabled={disabled || !editor.can().toggleHeading({ level: 3 })}
        aria-label="Titre 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-6 w-px bg-input" />

      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        disabled={disabled || !editor.can().toggleBulletList()}
        aria-label="Liste à puces"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={disabled || !editor.can().toggleOrderedList()}
        aria-label="Liste numérotée"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={disabled || !editor.can().toggleBlockquote()}
        aria-label="Citation"
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={disabled || !editor.can().toggleCodeBlock()}
        aria-label="Bloc de code"
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={disabled || !editor.can().setHorizontalRule()}
        aria-label="Ligne horizontale"
      >
        <Minus className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-6 w-px bg-input" />

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={disabled || !editor.can().undo()}
        aria-label="Annuler"
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={disabled || !editor.can().redo()}
        aria-label="Rétablir"
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
