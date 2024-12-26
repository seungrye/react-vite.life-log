import { PencilSquareIcon as OutlinePencilSquareIcon } from "@heroicons/react/24/outline";
import { HashtagIcon } from "@heroicons/react/24/solid";
import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MarkView } from "../components/MarkView";
import { auth, db } from "../firebase";
import { useAuth } from "../hook/useAuth";
import { IPost } from "../types/Posts";
import Loading from "./Loading";
import CommentsSection from "../components/Comments";

export default function PostDetail() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<IPost | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(false);
  const { authenticated } = useAuth();

  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const docRef = doc(db, "posts-v4", id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        return console.error("post is not exist");
      }

      const { author, category, content, createdAt, likes, tags: tagIdList, coverImage, title, updatedAt } = docSnap.data();
      // console.log("post", author, category, createdAt, likes, tagIdList, title, updatedAt)

      const tags: string[] = []
      if (tagIdList && tagIdList.length > 0) {
        const tagsQuery = query(collection(db, "tags"), where(documentId(), "in", tagIdList));
        const tagsSnapshot = await getDocs(tagsQuery);
        tagsSnapshot.forEach((doc) => {
          const { name } = doc.data()
          tags.push(name)
        });
      }

      setPost({
        id: docSnap.id,
        author,
        category,
        content,
        createdAt,
        likes,
        tags,
        title,
        updatedAt,
        coverImage
      });

      setEditable(authenticated && auth.currentUser?.email === author)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
  }, [id, authenticated]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost])

  return <>{loading ? <Loading />
    :
    <div className='container mx-auto my-4'>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <article className="mx-auto w-full format format-sm sm:format-base lg:format-lg format-blue antialiased">
          <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
              <div className="inline-flex items-center mr-3 text-sm text-gray-900">
                <img className="mr-4 w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Jese Leos" />
                <div>
                  <a href="#" rel="author" className="text-xl font-bold text-gray-900">
                    {post?.author}
                  </a>
                  <p className="text-base text-gray-500">Graphic Designer, educator & CEO Flowbite</p>
                  <p className="text-base text-gray-500">
                    <time>
                      {post?.createdAt.toDate().toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                  </p>
                </div>
              </div>
            </address>
            <div className="flex items-center pb-4 lg:pb-6 border-b-2 border-b-gray-200">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold leading-tight text-gray-900 lg:text-4xl">
                  {post?.title}
                </h1>
              </div>
              {editable &&
                <div className="flex-none w-fit px-4">
                  <OutlinePencilSquareIcon className="size-6 text-black cursor-pointer hover:text-gray-600"
                    onClick={() => navigate(`/edit/${post?.id}`)}
                  />
                </div>
              }
            </div>
          </header>
          <div className="lead prose prose-pre:p-2 mb-4 lg:max-w-none">
            {post && <MarkView content={post.content} />}
          </div>
          <div>
            <hr className="pt-4" />
            {post?.tags.map((tag, index) => <Link key={index} to={`/search?tag=${tag}`} className="text-green-800 text-xs font-semibold me-2 py-0.5 inline-flex items-center justify-center">
              <HashtagIcon className="size-4" />
              {tag}
            </Link>)}
          </div>

          <CommentsSection post={id} />

        </article>

      </div>
    </div>
  }
  </>
}
