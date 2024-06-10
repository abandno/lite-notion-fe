import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'


const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
    ],
    content: "<p>Hello World! 🌎️</p>",
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
