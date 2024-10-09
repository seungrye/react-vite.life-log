import Editor from "./Editor";

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement,
  category: HTMLInputElement
  date: HTMLInputElement,
}

interface SubmitFormElement extends HTMLFormElement {
  readonly elements: FormElements
}


export default function SubmitForm({onSubmit}:{onSubmit:({title, category, date, description}:{title:string, category:string, date:Date | null, description:string})=>void}) {
  return <form onSubmit={(event:React.FormEvent<SubmitFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements;

    onSubmit({
      title: elements.title.value,
      category: elements.category.value,
      date: elements.date.valueAsDate,
      description: "TODO: WIP"
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
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
        <Editor id="description"/>
      </div>
    </div>
    <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
      Submit post
    </button>
  </form>
}
