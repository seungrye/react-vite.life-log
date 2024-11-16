import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { SubmitForm } from "../components/SubmitForm";
import { ISubmitFormHandlerValue } from "../types/SubmitForm";
import { auth, db } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WarningModal } from "../components/Modal";
import { IModalProps } from "../types/Modal";
import { IPost } from "../types/Posts";

export default function PostEditor() {
  const { id } = useParams() as { id: string };
  const [error, setError] = useState<IModalProps | null>(null);
  const [post, setPost] = useState<IPost | undefined>(undefined)
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const user = auth.currentUser;
    if (!user) {
      setError({
        title: "로그인 필요",
        description: "포스트를 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.",
        onConfirm: () => {
          navigate("/signin");
        }
      });
      return false;
    }

    return true;
  }, [])

  const onSubmit = useCallback(async (value: ISubmitFormHandlerValue) => {
    if (!checkAuth()) return console.warn("require login");

    const { title, category, createdAt, updatedAt, content, tags } = value;
    const tagArray = tags.split(",").filter(v => v).map(v => v.trim().replace(/ /g, '_'));
    //console.log("title:", title, ", category:", category, ", createdAt:", createdAt, ", content:", content, ", tags:", tagArray);

    if (id) {
      await updateDoc(
        doc(db, "posts", id), {
        title,
        content,
        category,
        tags: tagArray,
        updatedAt: updatedAt,
      })
    } else {
      await addDoc(
        collection(db, "posts"), {
        author: auth.currentUser?.email,
        title,
        content,
        category,
        tags: tagArray,
        likes: 0,
        createdAt,
        updatedAt: null,
      })
    }
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      const docRef = doc(db, "posts", id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        return console.error("post is not exist");
      }

      const { author, category, content, createdAt, likes, tags, title, updatedAt } = docSnap.data();
      if (auth.currentUser?.email != author) return console.error("블로그 포스트를 작성한 사용자와 현재 사용자가 일치하지 않습니다.")

      setPost({
        id: docSnap.id,
        author,
        category,
        content,
        createdAt,
        likes,
        tags,
        title,
        updatedAt
      });
    } catch (e) {
      console.error(e)
    }
  }, [id]);

  useEffect(() => {
    checkAuth();
    id && fetchPost();
  }, []);

  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <SubmitForm
        post={post}
        onSubmit={onSubmit}
      />
    </div>
    {error && <WarningModal {...error} />}
  </div>
}
