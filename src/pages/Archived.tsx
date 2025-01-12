import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { collection, onSnapshot, orderBy, Query, query, Unsubscribe } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"
import { db } from "../firebase"
import { IArchiveItem, IArchiveItemProps } from "../types/Archived"
import { Link } from "react-router-dom"

function ArchiveItem(props: IArchiveItemProps) {
  const { id, date, title, description, imageUrls } = props

  return <li className="mb-10 ms-4">
    <Link to={`/detail/${id}`}>
      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white"></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400">{date}</time>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-base font-normal text-gray-500">{description}</p>

      {imageUrls?.length &&
        <div className="flex">
          {imageUrls?.map((imageUrl) =>
            <Popover key={imageUrl} className="relative">
              <PopoverButton className="mt-2 hover:text-gray-600">
                <PhotoIcon className="size-6" />
              </PopoverButton>
              <PopoverPanel anchor="top" className="flex flex-col bg-black rounded border">
                <img src={imageUrl}
                  className="max-w-64 h-auto" />
              </PopoverPanel>
            </Popover>
          )}
        </div>
      }
    </Link>
  </li>
}

export default function Archived() {
  const [archives, setArchives] = useState<IArchiveItem[]>([]);

  const extractImages = useCallback((content: string) => {
    // match 값의 스코프를 제한하기 위해 함수 내부에서 처리
    const match = content.match(/!\[.*?\]\((.*?)\)/);
    return match && match[1] ? match.slice(1) : undefined; // 추출된 값(들) 또는 undefined 반환
  }, []);

  const extractDescription = useCallback((content: string) => {
    const paragraphs = content.split('\n\n');
    let firstParagraph = paragraphs[0];

    if (firstParagraph.trim().startsWith('#')) {
      return firstParagraph + (paragraphs.length > 1 && paragraphs[1]);
    } else {
      return firstParagraph;
    }
  }, []);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async (query: Query) => {
      unsubscribe = onSnapshot(query, (snapshot) => {
        const archives = snapshot.docs.map(doc => {
          const { author, category, content, createdAt, title } = doc.data();
          // console.log("post", author, category, createdAt, likes, tags, title, updatedAt)

          return {
            id: doc.id,
            author,
            category,
            title,
            description: extractDescription(content),
            createdAt: createdAt.toDate().toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric" }),
            imageUrls: extractImages(content)
          };
        });
        setArchives(archives);
      });
    }
    fetchPosts(query(
      collection(db, "posts-v4"),
      orderBy("createdAt", "desc"),
    ));

    return () => { unsubscribe?.(); }
  }, []);

  return <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
    <ol className="relative border-s border-gray-200">
      {archives?.map((archive) => <ArchiveItem
        id={archive?.id}
        date={archive?.createdAt}
        title={archive?.title}
        description={archive?.description}
        imageUrls={archive?.imageUrls}
      />)}
    </ol>
  </div>
}
