import { query, collection, getDocs, where, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Function Description:
 * 
 * 이 함수는 Firestore의 기존 'posts' 컬렉션에서 데이터를 읽어 새로운 'posts-v2' 컬렉션으로 마이그레이션합니다.
 * 또한, 포스트에 포함된 태그들을 처리하여, 
 * - 기존 태그의 사용 횟수(`usageCount`)를 증가시키거나, 
 * - 새로운 태그를 추가하고, 
 * 태그와 포스트 간의 관계를 'tags-to-posts-v2' 컬렉션에 저장합니다.
 *
 * DB 구조 변화:
 * 
 * **마이그레이션 전 (기존 'posts' 컬렉션)**
 * posts
 * ├── postId1
 * │   ├── author: string
 * │   ├── title: string
 * │   ├── content: string
 * │   ├── category: string
 * │   ├── tags: string[]  <-- (태그 목록, 텍스트 형태)
 * │   ├── likes: number
 * │   ├── createdAt: timestamp
 * │   └── updatedAt: timestamp
 *
 * **마이그레이션 후 (새로운 'posts-v2' 컬렉션)**
 * posts-v2
 * ├── postId1
 * │   ├── author: string
 * │   ├── title: string
 * │   ├── content: string
 * │   ├── category: string
 * │   ├── tags: string[]  <-- (태그 ID 목록, 'tags' 컬렉션의 문서 ID로 변경됨)
 * │   ├── likes: number
 * │   ├── createdAt: timestamp
 * │   └── updatedAt: timestamp
 * 
 * **새로 추가된 'tags' 컬렉션**
 * tags
 * ├── tagId1
 * │   ├── name: string  <-- 태그 이름
 * │   └── usageCount: number  <-- 태그 사용 횟수
 * 
 * **새로 추가된 'tags-to-posts-v2' 컬렉션 (태그와 포스트 관계)**
 * tags-to-posts-v2
 * ├── tagPostId1
 * │   ├── post: postId1  <-- 'posts-v2' 문서 ID
 * │   ├── tag: tagId1  <-- 'tags' 문서 ID
 * 
 */
export async function migrate_post_to_post_v2() {
    // 'posts' 컬렉션에서 모든 포스트 문서를 가져옵니다.
    const postsQuery = query(collection(db, "posts"));
    const postsSnapshot = await getDocs(postsQuery);
  
    // 각 포스트 문서를 순차적으로 처리합니다.
    for (const document of postsSnapshot.docs) {
      // 포스트 문서에서 필요한 데이터 추출
      const { author, title, content, category, tags, likes, createdAt, updatedAt } = document.data();
  
      // 태그 ID를 저장할 배열
      const tagIdList: string[] = [];
  
      // 포스트의 태그 목록을 순차적으로 처리
      for (const tag of tags.filter((v: string) => v)) {
        // 'tags' 컬렉션에서 태그 이름으로 해당 태그를 조회
        const tagQuery = query(collection(db, "tags"), where("name", "==", tag));
        const tagSnapshot = await getDocs(tagQuery);
  
        // 태그가 존재하는 경우
        if (tagSnapshot.size > 0) {
          const { usageCount } = tagSnapshot.docs[0].data();
          const id = tagSnapshot.docs[0].id;
  
          // 태그의 사용 횟수를 증가시키고, 태그 ID를 tagIdList에 추가
          await updateDoc(doc(db, "tags", id), {
            usageCount: usageCount + 1,
          });
          tagIdList.push(id);
        } else {
          // 태그가 없는 경우 새 태그를 추가하고 태그 ID를 tagIdList에 추가
          const docRef = await addDoc(collection(db, "tags"), {
            name: tag,
            usageCount: 1,
          });
          tagIdList.push(docRef.id);
        }
      }
  
      // 새 포스트를 'posts-v2' 컬렉션에 추가
      const docRef = await addDoc(collection(db, "posts-v2"), { author, title, content, category, tags: tagIdList, likes, createdAt, updatedAt });
  
      // 각 태그와 포스트 간의 관계를 'tags-to-posts-v2' 컬렉션에 저장
      await Promise.all(tagIdList.map(async tagId =>
        await addDoc(collection(db, "tags-to-posts-v2"), { post: docRef.id, tag: tagId })
      ));
    }
  
    // 마이그레이션 작업 완료 후 콘솔에 로그 출력
    console.info("migration finished");
  }
  