function Navbar({title, children}:{title:string, children:any}) {
  return <div className="navbar bg-base-300 rounded-box">
    <div className="flex-1 px-2 lg:flex-none">
      <a className="text-lg font-bold">{title}</a>
    </div>
    <div className="flex flex-1 justify-end px-2">
      <div className="flex items-stretch">
        {children}
      </div>
    </div>
  </div>
}

export default Navbar;

