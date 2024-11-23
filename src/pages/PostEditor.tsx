import { addDoc, collection, doc, documentId, getDoc, getDocs, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { SubmitForm } from "../components/SubmitForm";
import { ISubmitFormHandlerValue } from "../types/SubmitForm";
import { auth, db } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WarningModal } from "../components/Modal";
import { IModalProps } from "../types/Modal";
import { IPost } from "../types/Posts";
import Loading from "./Loading";

export default function PostEditor() {
  const { id } = useParams() as { id: string };
  const [error, setError] = useState<IModalProps | null>(null);
  const [post, setPost] = useState<IPost | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true);

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
  }, [navigate])

  const addTagByNameWithTransaction = useCallback(async (name: string) => {
    const colRef = collection(db, "tags");
    return await runTransaction(db, async (transaction) => {
      let docRef;

      // `name` 필드가 특정 값인 문서 검색
      const tagQuery = query(colRef, where("name", "==", name));
      const tagSnapshot = await getDocs(tagQuery);

      if (!tagSnapshot.empty) {
        // 문서가 존재하면 업데이트
        docRef = tagSnapshot.docs[0].ref;
        const { usageCount } = tagSnapshot.docs[0].data();

        // count 값 증가
        transaction.update(docRef, { usageCount: usageCount + 1 });
      } else {
        // 문서가 없으면 새로 생성 (문서 ID 명시적으로 생성)
        docRef = doc(colRef); // 새 문서 참조 생성 (랜덤 ID)
        transaction.set(docRef, { name, usageCount: 1 });
      }

      return docRef;
    });
  }, []);

  const removeTagByNameWithTransaction = useCallback(async (name: string) => {
    const colRef = collection(db, "tags");
    return await runTransaction(db, async (transaction) => {
      let docRef;

      // `name` 필드가 특정 값인 문서 검색
      const tagQuery = query(colRef, where("name", "==", name));
      const tagSnapshot = await getDocs(tagQuery);

      if (!tagSnapshot.empty) {
        // 문서가 존재하면 업데이트
        docRef = tagSnapshot.docs[0].ref;
        const { usageCount } = tagSnapshot.docs[0].data();

        if (usageCount == 1) {
          transaction.delete(docRef);
        } else {
          // count 값 감소
          transaction.update(docRef, { usageCount: usageCount - 1 });
        }
      }

      return docRef;
    });
  }, []);

  const addTagToPostV2WithTransaction = useCallback(async (tagId: string, postId: string) => {
    const colRef = collection(db, "tags-to-posts-v2");
    return await runTransaction(db, async (transaction) => {
      const matchQuery = query(colRef, where("tag", "==", tagId), where("post", "==", postId));
      const matchSnapshot = await getDocs(matchQuery);
      if (matchSnapshot.empty) {
        // 문서가 없으면 새로 생성 (문서 ID 명시적으로 생성)
        const docRef = doc(colRef); // 새 문서 참조 생성 (랜덤 ID)
        transaction.set(docRef, { tag: tagId, post: postId });
      }
    });
  }, []);

  const removeTagToPostV2WithTransaction = useCallback(async (tagId: string, postId: string) => {
    const colRef = collection(db, "tags-to-posts-v2");
    return await runTransaction(db, async (transaction) => {
      const matchQuery = query(colRef, where("tag", "==", tagId), where("post", "==", postId));
      const matchSnapshot = await getDocs(matchQuery);
      if (!matchSnapshot.empty) {
        const docRef = matchSnapshot.docs[0].ref;
        transaction.delete(docRef);
      }
    });
  }, []);

  const upsertDoc = useCallback(async (id: string, { author, title, content, category, tags, likes, createdAt, updatedAt }: { author: string | null | undefined, title: string, content: string, category: string, tags: string[], likes: number, createdAt: Date | null, updatedAt: Date | null }) => {
    console.assert(author != null)

    if (id) {
      await updateDoc(
        doc(db, "posts-v2", id), {
        title,
        content,
        category,
        tags: tags,
        updatedAt: updatedAt,
      });
    } else {
      const doc = await addDoc(
        collection(db, "posts-v2"), {
        author,
        title,
        content,
        category,
        tags: tags,
        likes: likes,
        createdAt,
        updatedAt: null,
      });
      id = doc.id;
    }

    return id
  }, []);

  const onSubmit = useCallback(async (value: ISubmitFormHandlerValue) => {
    if (!checkAuth()) return console.warn("require login");

    const { title, category, createdAt, updatedAt, content, tags: tagString } = value;
    const tagArray = tagString.split(",").filter(v => v).map(v => v.trim().replace(/ /g, '_'));
    // console.log("title:", title, ", category:", category, ", createdAt:", createdAt, ", content:", content, ", tags:", tagArray);

    const prevTags = new Set(post?.tags || []);
    const curTags = new Set(tagArray || []);

    const tags = [];
    const newTags = [...curTags].filter(item => !prevTags.has(item)); // 추가된 요소
    const removedTags = [...prevTags].filter(item => !curTags.has(item)); // 삭제된 요소
    const unchangedItems = [...prevTags].filter(item => curTags.has(item)); // 유지되는 것 (prev tags와 current tags 모두에 있는 요소)

    for (const tag of newTags) {
      const docRef = await addTagByNameWithTransaction(tag);
      tags.push(docRef.id)
    }

    for (const tag of removedTags) {
      const docRef = await removeTagByNameWithTransaction(tag);
      if (docRef) { await removeTagToPostV2WithTransaction(docRef.id, id); }
    }

    if (unchangedItems.length > 0) {
      const tagQuery = query(collection(db, "tags"), where("name", "in", unchangedItems));
      const tagSnapshot = await getDocs(tagQuery);
      tagSnapshot.forEach(v => tags.push(v.id))
    }

    const docId = await upsertDoc(id, {
      author: auth.currentUser?.email,
      title,
      content,
      category,
      tags: tags,
      likes: 0,
      createdAt,
      updatedAt: updatedAt,
    });

    for (const tagId of tags) { await addTagToPostV2WithTransaction(tagId, docId) }

    navigate(`/detail/${docId}`)
  }, [id, post?.tags, checkAuth, upsertDoc, navigate, addTagByNameWithTransaction, removeTagByNameWithTransaction, removeTagToPostV2WithTransaction, addTagToPostV2WithTransaction]);

  const fetchPost = useCallback(async () => {
    try {
      const docRef = doc(db, "posts-v2", id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        return console.error("post is not exist");
      }

      const { author, category, content, createdAt, likes, tags: tagIdList, title, updatedAt } = docSnap.data();
      if (auth.currentUser?.email != author) return console.error("블로그 포스트를 작성한 사용자와 현재 사용자가 일치하지 않습니다.")

      const tags: string[] = []
      const tagsQuery = query(collection(db, "tags"), where(documentId(), "in", tagIdList));
      const tagsSnapshot = await getDocs(tagsQuery);
      tagsSnapshot.forEach((doc) => {
        const { name } = doc.data()
        tags.push(name)
      });

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
    if (id) fetchPost();
    setLoading(false)
  }, [id, checkAuth, fetchPost]);

  return <>{loading ?
    <Loading />
    :
    <div className='container mx-auto my-4'>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
        <SubmitForm
          post={post}
          onSubmit={onSubmit}
        />
      </div>
      {error && <WarningModal {...error} />}
    </div>
  }
  </>
}
