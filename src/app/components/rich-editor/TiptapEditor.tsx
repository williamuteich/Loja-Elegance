"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar: React.FC<{ editor: ReturnType<typeof useEditor> | null }> = ({ editor }) => {
  if (!editor) return null;

  const buttonCls = "px-2 py-1 border rounded text-sm hover:bg-gray-200";
  const isActiveCls = (name: string, attrs?: any) =>
    editor.isActive(name, attrs) ? " bg-blue-500 text-white" : "";

  return (
    <div className="mb-3 flex flex-wrap items-center gap-1 p-2 rounded border border-gray-300 bg-gray-50 shadow-sm">
      <button
        type="button"
        className={buttonCls + isActiveCls("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        type="button"
        className={buttonCls + isActiveCls("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        type="button"
        className={buttonCls + isActiveCls("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </button>
      <button
        type="button"
        className={buttonCls + isActiveCls("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • Lista
      </button>
      <button
        type="button"
        className={buttonCls + isActiveCls("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. Lista
      </button>
      <select
        className="px-2 py-1 border rounded m-1 text-sm" 
        value={editor.isActive('heading', { level: 2 }) ? 'h2' : 'p'}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          } else {
            editor.chain().focus().setParagraph().run();
          }
        }}
      >
        <option value="p">Parágrafo</option>
        <option value="h2">Título</option>
      </select>
      <button
        type="button"
        className={buttonCls + isActiveCls("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </button>
      <button
        type="button"
        className={buttonCls + isActiveCls("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        Mark
      </button>
      <button
        type="button"
        className={buttonCls}
        onClick={() => {
          const url = prompt("URL:", "https://")?.trim();
          if (!url) return;
          if (editor.state.selection.empty) {
            editor.chain().focus().insertContent(`<a href="${url}" target="_blank">${url}</a>`).run();
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
          }
        }}
      >
        Link
      </button>
      <button
        type="button"
        className={buttonCls}
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </button>
      <button
        type="button"
        className={buttonCls}
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </button>
    </div>
  );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [2] }),
      Underline,
      Placeholder.configure({ placeholder: placeholder || "Digite aqui..." }),
      Link.configure({ openOnClick: true }),
      Highlight
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="border border-gray-300 rounded h-full">
        <EditorContent editor={editor} className="p-3 h-full w-full focus:outline-none" style={{ outline: 'none', height: '100%' }} />
        <style jsx global>{`
          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1.5rem;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
          }
          .ProseMirror {
            min-height: 120px;
          }
          .ProseMirror li {
            margin-bottom: 0.25rem;
          }
          .ProseMirror h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .ProseMirror-focused,
          .ProseMirror:focus {
            outline: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TiptapEditor;
