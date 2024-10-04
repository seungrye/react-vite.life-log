import './App.css'
import Card from './components/Card';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return <div className='container mx-auto my-4'>
    <Navbar title='Handmaden'>
      <a className="btn btn-ghost rounded-btn">Button</a>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">Dropdown</div>
        <ul tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
    </Navbar>

    <div className='my-4'>
      <Card title="Buttons with brand colors">
        <button className="btn">Button</button>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-link">Link</button>
      </Card>

      <Card title='Responsive button'>
        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Responsive</button>
      </Card>

      <Card title='Button with loading spinner and text'>
        <button className="btn">
          <span className="loading loading-spinner"></span>
          loading
        </button>
      </Card>
      </div>

    <Footer/>
    </div>
}

export default App
