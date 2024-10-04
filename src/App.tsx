import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Posts from './components/Posts';

function App() {
  return <>
    <Navbar/>
    <div className='container mx-auto my-4'>
      <Posts/>
    </div>
    <Footer/>
  </>
}

export default App
