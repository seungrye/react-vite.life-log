const links = [
  { name: 'Github', href: 'https://github.com/' },
  { name: 'React.JS', href: 'https://react.dev/' },
  { name: 'Tailwindcss', href: 'https://tailwindcss.com/' },
  { name: 'Vite.JS', href: 'https://ko.vitejs.dev/' },
]
const stats = [
  { name: 'Categories', value: '12' },
  { name: 'Posts', value: '300+' },
  { name: 'Number of pictures', value: '40' },
  { name: 'Storage usage', value: '5 / 32GB' },
]

export default function Status() {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
          Site status
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-900">
          If you cannot fly then run. If you cannot run, then walk. And, if you cannot walk, then crawl, but whatever you do, you have to keep moving forward.
          <span className="text-right block">
            – Martin Luther King Jr.
          </span>
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-black sm:grid-cols-2 md:flex lg:gap-x-10">
          {links.map((link) => (
            <a key={link.name} href={link.href}>
              {link.name} <span aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col-reverse">
              <dd className="text-2xl font-bold leading-9 tracking-tight text-black">{stat.value}</dd>
              <dt className="text-base leading-7 text-gray-900">{stat.name}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
