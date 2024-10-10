import './App.css'
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import SubmitForm from './components/SubmitForm';

function App() {
  return <>
    <Navbar/>
    <div className='container mx-auto my-4'>

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <Login onSubmit={({email, password, rememberMe}) => {
          console.log("email:", email, ", password:", password, ", rememberMe:", rememberMe);
        }}/>
      </div>
      <hr/>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <Posts/>
      </div>
      <hr/>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <SubmitForm
          editorDefaultValue='**hello world**'
          onSubmit={value => {
          const {title, category, date, content} = value;
          console.log("title:",title,", category:", category,", date:", date, ", content:", content);
        }}
        />
      </div>
    </div>
    <Footer/>
  </>
}

export default App
