import { useSearchParams } from "react-router-dom";
import Posts from "../components/Posts";
import { Query, query, collection, orderBy, limit, where, getDocs, QueryConstraint } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const [postsQuery, setPostsQuery] = useState<Query | null>(null);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const keyword = searchParams.get('keyword')
  
  useEffect(() => {
    const genQuery = async () => {
      const constraints:QueryConstraint[] = [];
      let categoryQuery;
      let tagQuery;
      let keywordQuery;

      if (category) {
        categoryQuery = where("category", "==", category);
        constraints.push(categoryQuery)
      }
      // Note. firestore 에서는 array-contains 관련 제약은 한 쿼리에 1개만 사용 가능함.
      // Error Message => A maximum of 1 'ARRAY_CONTAINS' filter is allowed per disjunction.
      if (keyword) {
        keywordQuery = where("keywords", "array-contains", keyword);
        constraints.push(keywordQuery)
      } else if (tag) {
        const tagsQuery = query(collection(db, "tags"), where("name", "==", tag));
        const tagsSnapshot = await getDocs(tagsQuery);
        const tagIds = tagsSnapshot.docs.map(v => v.id);
        tagQuery = where("tags", "array-contains-any", tagIds);
        constraints.push(tagQuery)
      }

      setPostsQuery(query(
        collection(db, "posts-v4"),
        ...constraints,
        orderBy("createdAt", "desc"),
        limit(6)
      ));
    };

    genQuery();
  }, [category, tag, keyword])

  return <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
    {postsQuery && <Posts queryPosts={postsQuery} />}
  </div>
}
