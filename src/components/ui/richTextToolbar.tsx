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
  Minus,
  Underline
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextToolbarProps {
  editor: Editor | null
  disabled?: boolean
}

export function RichTextToolbar({
  editor,
  disabled = false
}: RichTextToolbarProps) {
  if (!editor) {
    return null
  }

  const buttonClass =
    'p-2 h-8 w-8 flex items-center justify-center rounded text-muted-foreground hover:bg-muted'
  const activeClass = 'bg-muted text-foreground'

  const runCommand = (command: () => boolean) => {
    const result = command()
    console.log('Command executed with result:', result)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border-b border-input bg-background p-1">
      {/* Formatage de texte basique */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBold().run())
          }
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleItalic().run())
          }
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('underline') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleUnderline().run())
          }
          disabled={disabled}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleStrike().run())
          }
          disabled={disabled}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-1 h-6 w-px bg-input" />

      {/* Titres */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            )
          }
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            )
          }
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            )
          }
          disabled={disabled}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-1 h-6 w-px bg-input" />

      {/* Listes */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBulletList().run())
          }
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleOrderedList().run())
          }
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-1 h-6 w-px bg-input" />

      {/* Autres éléments */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBlockquote().run())
          }
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`${buttonClass} ${editor.isActive('codeBlock') ? activeClass : ''}`}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleCodeBlock().run())
          }
          disabled={disabled}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={buttonClass}
          onClick={() =>
            runCommand(() => editor.chain().focus().setHorizontalRule().run())
          }
          disabled={disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-1 h-6 w-px bg-input" />

      {/* Annuler/Rétablir */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={buttonClass}
          onClick={() => runCommand(() => editor.chain().focus().undo().run())}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={buttonClass}
          onClick={() => runCommand(() => editor.chain().focus().redo().run())}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
