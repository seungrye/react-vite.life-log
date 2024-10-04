function Card({title, children}:{title:string, children:any}) {
  return <div className="card bg-ghost text-ghost-content w-96 border">
    <div className="card-body">
      {title && <h2 className="card-title">{title}</h2> }
      {children && <div className="pt-2">{children}</div>}
    </div>
  </div>;
}

export default Card;


