import { addDoc, collection } from "firebase/firestore";
import { SubmitForm } from "../components/SubmitForm";
import { SubmitFormHandlerValue } from "../types/SubmitForm";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WarningModal } from "../components/Modal";
import { ModalProps } from "../types/Modal";


export default function PostEditor() {
  const [error, setError] = useState<ModalProps | null>(null);
  const navigate = useNavigate();

  const checkAuth = () => {
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
  }

  const onSubmit = async (value: SubmitFormHandlerValue) => {
    if (!checkAuth()) return console.warn("require login");

    const { title, category, createdAt, content, tags } = value;
    const tagArray = tags.split("#").filter(v => v).map(v => v.trim().replace(/ /g, '_'));
    console.log("title:", title, ", category:", category, ", createdAt:", createdAt, ", content:", content, ", tags:", tagArray);

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


  useEffect(() => {
    checkAuth();
  });

  return <div className='container mx-auto my-4'>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
      <SubmitForm
        editorDefaultValue='**hello world**'
        onSubmit={onSubmit}
      />
    </div>
    {error && <WarningModal {...error} />}
  </div>
}
