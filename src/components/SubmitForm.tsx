import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useState } from "react";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import { ISubmitFormElement, ISubmitFormProps } from "../types/SubmitForm";
import { MarkView } from "./MarkView";

export function SubmitForm(props: ISubmitFormProps) {
  const { onSubmit, post = undefined } = props;
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("write")

  const handleSubmit = useCallback(async (event: React.FormEvent<ISubmitFormElement>) => {
    if (loading) return console.log("posting...");
    event.preventDefault();

    const { title, category, date, tags } = event.currentTarget.elements;

    try {
      setLoading(true);
      onSubmit({
        title: title.value,
        content: content,
        category: category.value,
        tags: tags.value,
        createdAt: date.valueAsDate || new Date(),
        updatedAt: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, [content])

  return <form onSubmit={handleSubmit}>
    <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
      <div className="sm:col-span-4">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          defaultValue={post?.title}
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          required={true}
        />
      </div>
      <div className="w-full">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          defaultValue={post?.category}
          type="text"
          name="category"
          id="category"
          placeholder="Category"
          required={true}
        />
      </div>
      <div className="w-full">
        <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          defaultValue={post?.createdAt.toDate().toISOString().substring(0, 10)}
          type="date"
          name="date"
          id="date"
          placeholder="Date"
          disabled={Boolean(post)}
          required={true}
        />
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">Content</label>
        <div id="content">
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
          <div className="w-full h-full prose lg:max-w-none min-h-auto prose-indigo leading-6 rounded-b-md shadow-sm border border-gray-300 bg-white overflow-y-auto">
            <CodeMirror
              className={tab == "write" ? "" : "hidden"}
              defaultValue={post?.content || ""}
              onChange={setContent}
              height="500px"
              theme={xcodeLight}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
            />
            <div className={`p-4 h-[500px] ${tab == "preview" ? "" : "hidden"}`}>
              <MarkView content={content} />
            </div>
          </div>
        </div>
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          defaultValue={post?.tags.join((", "))}
          type="text"
          name="tags"
          id="tags"
          placeholder="Tags"
          required={false}
        />
      </div>
    </div>
    <button className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
      type="submit"
    >
      {loading ? "Submitting..." : "Submit post"}
    </button>
  </form>
}
