import { PencilSquareIcon as OutlinePencilSquareIcon } from "@heroicons/react/24/outline";
import { HashtagIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, doc, documentId, getDoc, getDocs, onSnapshot, orderBy, Query, query, Unsubscribe, updateDoc, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MarkView } from "../components/MarkView";
import { auth, db } from "../firebase";
import { useAuth } from "../hook/useAuth";
import { IPost } from "../types/Posts";
import Loading from "./Loading";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";

interface ICommentFormHandlerValue {
  post: string,
  author: string,
  content: string,
  commentedAt: Date | null
}

interface ICommentValue {
  post: string,
  author: string,
  content: string,
  commentedAt: string
}

interface IIPInfoValue {
  ip?: string,
}

function CommentForm(props: { post: string }) {
  const { post } = props;
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("write")
  const [client, setClient] = useState<IIPInfoValue>({})

  const upsertDoc = useCallback(async (id: string | null | undefined, value: ICommentFormHandlerValue) => {
    const { post, author, content, commentedAt } = value
    console.assert(author != null)

    if (id) {
      await updateDoc(
        doc(db, "comments", id), {
        post,
        author,
        content,
        commentedAt
      });
    } else {
      const doc = await addDoc(
        collection(db, "comments"), {
        post,
        author,
        content,
        commentedAt
      });
      id = doc.id;
    }

    return id
  }, []);


  const onSubmit = useCallback(async (value: ICommentFormHandlerValue) => {
    const { post, author, content, commentedAt } = value;

    /*const docId = */await upsertDoc(undefined, {
      post,
      author,
      content,
      commentedAt
    });
  }, []);

  const convertIpToBarcode = useCallback((ip: string) => {
    // IP 주소를 '.'로 분리
    const octets = ip.split('.');

    // 4진수 값에 대한 문자 매핑 정의
    const base4Mapping: { [key: string]: string } = {
      '0': 'i',
      '1': 'l',
      '2': 'I',
      '3': '!',
    };

    // 각 옥텟을 10진수에서 4진수로 변환 후 매핑
    const mappedBase4 = octets.map(octet => {
      // 10진수를 2진수로 바꾸고, 2진수를 4진수로 바꿈
      const binary = parseInt(octet).toString(2).padStart(8, '0');

      // 8비트 2진수를 4진수로 변환하고 문자로 맵핑
      const base4 = parseInt(binary, 2).toString(4).padStart(2, '0'); // 최소 2자리로 맞추기

      // 각 4진수 값을 문자로 매핑
      return base4.split('').map(digit => base4Mapping[digit]).join('');
    });

    // 결과를 공백으로 구분하여 반환
    return mappedBase4.join('');
  }, [])

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    if (loading) return console.log("posting...");
    event.preventDefault();

    try {
      setLoading(true);
      const barcode = client.ip?.split('').reverse().join('') || "255.255.255.255"
      await onSubmit({
        post,
        author: auth.currentUser?.email || convertIpToBarcode(barcode),
        content: content,
        commentedAt: new Date()
      });
    } finally {
      setContent("");
      setLoading(false);
    }
  }, [content, loading])

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(resp => resp.json())
      .then(data => setClient(data))
      .catch(e => console.error("error fetching ip address : ", e))
  }, []);

  return <form className="mb-6"
    onSubmit={handleSubmit}>
    <div className="sm:col-span-4 mb-4">
      <div id="content">
        <div className="bg-gray-50 border border-b-0 border-gray-300 top-0 left-0 right-0 block rounded-t-md">
          <button type="button"
            className={`py-2 px-4 inline-block ${tab == "write" ? "text-indigo-600" : "text-gray-400"} font-semibold`}
            onClick={() => setTab("write")}>
            Write a comment...
          </button>
          <button type="button"
            className={`py-2 px-4 inline-block ${tab == "preview" ? "text-indigo-600" : "text-gray-400"} font-semibold`}
            onClick={() => setTab("preview")}>
            Preview
          </button>
        </div>
        <div className="w-full h-full prose lg:max-w-none min-h-auto prose-indigo leading-6 rounded-b-md shadow-sm border border-gray-300 bg-white overflow-y-auto">
          <ReactCodeMirror
            className={tab == "write" ? "" : "hidden"}
            value={content}
            onChange={setContent}
            height="150px"
            theme={xcodeLight}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
          />
          <div className={`p-4 h-[150px] ${tab == "preview" ? "" : "hidden"}`}>
            <MarkView content={content} />
          </div>
        </div>
      </div>
    </div>
    <button type="submit"
      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-primary-200 hover:opacity-70">
      {loading ? "Posting comment..." : "Post comment"}
    </button>
  </form>
}

function Comment(props: ICommentValue) {
  const { author, content, commentedAt } = props;

  return <article className="p-6 mb-6 text-base bg-white rounded-lg">
    <footer className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900"><img
          className="mr-2 w-6 h-6 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
          alt={author} />{author}</p>
        <p className="text-sm text-gray-600"><time dateTime="2022-02-08"
          title={commentedAt}>{commentedAt}</time></p>
      </div>
      {author == auth.currentUser?.email &&
        <>
          <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
            type="button">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
            <span className="sr-only">Comment settings</span>
          </button>
          <div id="dropdownComment1"
            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow">
            <ul className="py-1 text-sm text-gray-700"
              aria-labelledby="dropdownMenuIconHorizontalButton">
              <li>
                <a href="#"
                  className="block py-2 px-4 hover:bg-gray-100">Edit</a>
              </li>
              <li>
                <a href="#"
                  className="block py-2 px-4 hover:bg-gray-100">Remove</a>
              </li>
              <li>
                <a href="#"
                  className="block py-2 px-4 hover:bg-gray-100">Report</a>
              </li>
            </ul>
          </div>
        </>
      }
    </footer>

    <p>
      <MarkView content={content} />
    </p>

  </article>
}

function CommentsSection(props: { post: string }) {
  const { post } = props;
  const [comments, setComments] = useState<ICommentValue[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchComments = async (query: Query) => {
      unsubscribe = onSnapshot(query, (snapshot) => {
        const comments = snapshot.docs.map(doc => {
          const { post, author, content, commentedAt } = doc.data();

          return {
            post,
            author,
            content,
            commentedAt: commentedAt.toDate().toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric" })
          };
        });
        console.log(comments);
        setComments(comments);
      });
    }

    const commentsQuery = query(
      collection(db, "comments", ""),
      where("post", "==", post),
      orderBy("commentedAt", "desc")
    );

    fetchComments(commentsQuery);
    return () => { unsubscribe?.(); }
  }, []);

  return <section className="not-format mt-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion ({comments.length})</h2>
    </div>

    {comments.map(comment => <Comment {...comment} />)}
    <CommentForm post={post} />
  </section>
}

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
