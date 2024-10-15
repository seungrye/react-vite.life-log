import SubmitForm from "../components/SubmitForm";

export default function PostEditor() {
  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <SubmitForm
        editorDefaultValue='**hello world**'
        onSubmit={value => {
          const { title, category, date, content } = value;
          console.log("title:", title, ", category:", category, ", date:", date, ", content:", content);
        }}
      />
    </div>
  </div>
}
