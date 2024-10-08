import './App.css'
import Editor from './components/Editor';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Posts from './components/Posts';

function App() {
  return <>
    <Navbar/>
    <div className='container mx-auto my-4'>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <Posts/>
      </div>
      <hr/>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
              <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="Title" 
                required={true}
              />
            </div>
            <div className="w-full">
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
              <input type="text" name="category" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Category"
                required={true}
              />
            </div>
            <div className="w-full">
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
              <input type="date" name="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="Date" 
                required={true}
              />
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
              <Editor id="description"/>
            </div>
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
            Add product
          </button>
        </form>

      </div>
    </div>
    <Footer/>
  </>
}

export default App
