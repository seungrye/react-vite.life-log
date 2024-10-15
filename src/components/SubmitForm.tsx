import { useState } from "react";
import Editor from "./Editor";

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement,
  category: HTMLInputElement
  date: HTMLInputElement,
}

interface SubmitFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

interface SubmitFormProps {
  onSubmit: (value: { title: string, category: string, date: Date | null, content: string }) => void,
  editorDefaultValue?: string // to use default value
}

export default function SubmitForm(props: SubmitFormProps) {
  const { onSubmit, editorDefaultValue = "" } = props;
  const [content, setContent] = useState(editorDefaultValue);

  return <form onSubmit={(event: React.FormEvent<SubmitFormElement>) => {
    event.preventDefault();
    const { title, category, date } = event.currentTarget.elements;

    onSubmit({
      title: title.value,
      category: category.value,
      date: date.valueAsDate,
      content: content
    });
  }}>
    <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
      <div className="sm:col-span-4">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          placeholder="Title"
          required={true}
        />
      </div>
      <div className="w-full">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
        <input type="text" name="category" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          placeholder="Category"
          required={true}
        />
      </div>
      <div className="w-full">
        <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
        <input type="date" name="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          placeholder="Date"
          required={true}
        />
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">Content</label>
        <Editor id="content" value={content} onChange={setContent} />
      </div>
    </div>
    <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
      Submit post
    </button>
  </form>
}
