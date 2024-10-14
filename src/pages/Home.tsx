import Posts from "../components/Posts";

export default function Home() {
  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <Posts/>
    </div>
  </div>
}
