function Post({category, title, date, banner, summary}:{category:string, title:string, date:string, banner:string, summary:string}) {
  return <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm">
    <img
      src={banner}
      className="object-cover w-full h-64"
      alt=""
    />
    <div className="p-5 border border-t-0">
      <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
        <a
          href="/"
          className="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700"
          aria-label="Category"
          title={category}
        >
          {category}
        </a>
        <span className="text-gray-600">— {date}</span>
      </p>
      <a
        href="/"
        aria-label="Category"
        title={title}
        className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700"
      >
        {title}
      </a>
      <p className="mb-2 text-gray-700">
        {summary}
      </p>
      <a
        href="/"
        aria-label=""
        className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
      >
        Learn more
      </a>
    </div>
  </div>
}

export default function Posts () {
  return <>
    <div className="grid gap-8 grid-cols-1 sm:max-w-sm sm:mx-auto md:max-w-full md:grid-cols-2 lg:max-w-full lg:grid-cols-3">
      <Post 
        banner="https://images.pexels.com/photos/2408666/pexels-photo-2408666.jpeg"
        category="traveling"
        date="28 Dec 2020" 
        title="Visit the East"
        summary="Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque."
      />
      <Post
        banner="https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg"
        category="traveling"
        date="28 Dec 2020"
        title="Simple is better"
        summary="Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque."
      />
      <Post
        banner="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
        category="traveling"
        date="28 Dec 2020"
        title="Film It!"
        summary="Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque."
      />
    </div>
  </>
}
