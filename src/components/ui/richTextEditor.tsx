'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RichTextToolbar } from './richTextToolbar'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (htmlContent: string) => void
  className?: string
  disabled?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  className,
  disabled = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // heading: { levels: [1, 2, 3] }, // Exemple de configuration
      })
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl',
          'min-h-[150px] w-full rounded-md rounded-t-none border border-input border-t-0 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editable: !disabled
  })

  if (!editor) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-stretch rounded-md border border-input',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <RichTextToolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  )
}
