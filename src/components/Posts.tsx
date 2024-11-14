import { Unsubscribe } from "firebase/auth";
import { query, collection, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { IPostProps, IPost } from "../types/Posts";

function SkeletonPost() {
  return <div role="status" className="max-w-sm border border-gray-200 rounded shadow animate-pulse">
    <div className="flex items-center justify-center h-64 bg-gray-300">
      <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
      </svg>
    </div>
    <div className="p-5">
      <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded-full w-64 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-2.5 bg-gray-200 rounded-full w-32"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
}

function Post(props: IPostProps) {
  const { id, category, title, date, banner, summary } = props;

  return <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm">
    <img
      src={banner}
      className="object-cover w-full h-64"
      alt=""
    />
    <div className="p-5 border border-t-0">
      <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
        <Link to={`/search/?category=${category}`}
          className="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700"
          aria-label="Category"
          title={category}
        >
          {category}
        </Link>
        <span className="text-gray-600">— {date}</span>
      </p>
      <Link to={`/detail/${id}`}
        aria-label="Title"
        title={title}
        className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700"
      >
        {title}
      </Link>
      <Link to={`/detail/${id}`}
        aria-label="Summary"
        title={title}
      >
        <p id="Summary" className="mb-2 text-gray-700 min-h-20 line-clamp-3">
          {summary}
        </p>
      </Link>
      <Link to={`/detail/${id}`}
        aria-label="Content"
        className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
      >
        Learn more
      </Link>
    </div>
  </div>
}

export default function Posts() {
  const [posts, setPosts] = useState<IPost[] | null[]>([null, null, null, null, null, null]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => {
          const { author, category, content, createdAt, likes, tags, title, updatedAt } = doc.data();

          return {
            id: doc.id,
            author,
            category,
            content,
            createdAt,
            likes,
            tags,
            title,
            updatedAt
          };
        });
        setPosts(posts);
      });
    }

    fetchPosts();

    return () => { unsubscribe?.(); }
  }, []);

  return <>
    <div className="grid gap-8 grid-cols-1 sm:max-w-sm sm:mx-auto md:max-w-full md:grid-cols-2 lg:max-w-full lg:grid-cols-3">
      {posts.map((post, index) =>
        post ?
          <Post
            key={index}
            id={post.id}
            banner="https://images.pexels.com/photos/2408666/pexels-photo-2408666.jpeg"
            category={post.category}
            date={post.createdAt.toDate().toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            title={post.title}
            summary={post.content.slice(0, 100)}
          />
          :
          <SkeletonPost
            key = {index}
          />
      )}
    </div>
  </>
}
