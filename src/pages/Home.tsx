import { collection, limit, orderBy, Query, query } from "firebase/firestore";
import Posts from "../components/Posts";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const [postsQuery, setPostsQuery] = useState<Query | null>(null);

  useEffect(() => {
    setPostsQuery(query(
      collection(db, "posts-v4"),
      orderBy("createdAt", "desc"),
      limit(6)
    ));
  }, [])

  return <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
    {postsQuery && <Posts queryPosts={postsQuery} />}
  </div >
}
