import { useState } from "react"
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import Markdown from "marked-react";

interface EditorProps {
  id?: string,
  value?: string,
  onChange: (value: string) => void
}

export default function Editor(props: EditorProps) {
  const { id = "", value = "", onChange } = props;
  const [tab, setTab] = useState("write")

  return <div id={id}>
    <div className="bg-gray-50 border border-b-0 border-gray-300 top-0 left-0 right-0 block rounded-t-md">
      <button type="button"
        className={`py-2 px-4 inline-block ${tab == "write" ? "text-indigo-600" : "text-gray-400"} font-semibold`}
        onClick={() => setTab("write")}>
        Write
      </button>
      <button type="button"
        className={`py-2 px-4 inline-block ${tab == "preview" ? "text-indigo-600" : "text-gray-400"} font-semibold`}
        onClick={() => setTab("preview")}>
        Preview
      </button>
    </div>
    <div className="w-full h-full prose max-w-none min-h-auto prose-indigo leading-6 rounded-b-md shadow-sm border border-gray-300 bg-white overflow-y-auto">
      {tab == "write" &&
        <CodeMirror
          value={value}
          onChange={onChange}
          height="500px"
          theme={xcodeLight}
          extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
        />
      }
      {tab == "preview" &&
        <div className="p-4">
          <Markdown>{value}</Markdown>
        </div>
      }
    </div>
  </div>;
};

