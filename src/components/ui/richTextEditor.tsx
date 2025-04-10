'use client'

import { useMemo, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { RichTextToolbar } from './richTextToolbar'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (htmlContent: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  minHeight?: string
}

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
    listItem: false
  }),
  Heading.configure({ levels: [1, 2, 3] }),
  BulletList.configure({ HTMLAttributes: { class: 'list-disc pl-5' } }),
  OrderedList.configure({ HTMLAttributes: { class: 'list-decimal pl-5' } }),
  ListItem,
  Link.configure({ openOnClick: false }),
  Underline,
  Placeholder.configure({ placeholder })
]

export function RichTextEditor({
  content,
  onChange,
  className,
  disabled = false,
  placeholder = 'Commencez à rédiger...',
  minHeight = '150px'
}: RichTextEditorProps) {
  const extensions = useMemo(() => createExtensions(placeholder), [placeholder])

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm sm:prose-base max-w-none',
          `min-h-[${minHeight}] w-full rounded-md rounded-t-none border border-input border-t-0 bg-background px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-input bg-muted/10">
        Chargement de l&apos;éditeur...
      </div>
    )
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
