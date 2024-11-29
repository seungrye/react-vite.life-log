import { query, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * "posts-v2" 데이터를 "posts-v3"로 마이그레이션하고, "tags" 컬렉션을 업데이트합니다.
 *
 * 이 함수는 다음 작업을 수행합니다:
 * 1. "posts-v2" 컬렉션의 모든 문서를 가져와 "posts-v3"로 마이그레이션하며,
 *    `category` 필드를 소문자로 변환합니다.
 * 2. "tags" 컬렉션의 모든 문서를 가져와 `name` 필드를 소문자로 업데이트합니다.
 * 3. 마이그레이션 작업 완료 후 완료 메시지를 출력합니다.
 *
 * 주의: 이 함수를 호출하기 전에 Firestore 인스턴스(`db`)가 올바르게 초기화되어 있어야 합니다.
 */
export async function migrate_post_v2_to_post_v3() {
    // "posts-v2" 컬렉션에서 모든 문서를 쿼리
    const postsQuery = query(collection(db, "posts-v2"));
    const postsSnapshot = await getDocs(postsQuery); // 쿼리 결과를 가져옴
  
    // "posts-v2"의 각 문서를 "posts-v3"로 변환하여 저장
    for (const document of postsSnapshot.docs) {
      const data = document.data(); // 문서 데이터를 가져옴
  
      // category 값을 소문자로 변환
      data.category = data.category.toLowerCase();
  
      // 변환된 데이터를 "posts-v3" 컬렉션에 추가
      await addDoc(collection(db, "posts-v3"), data);
    }
  
    // "tags" 컬렉션에서 모든 문서를 쿼리
    const tagsQuery = query(collection(db, "tags"));
    const tagsSnapshot = await getDocs(tagsQuery); // 쿼리 결과를 가져옴
  
    // "tags"의 각 문서를 업데이트하여 name 필드를 소문자로 변환
    for (const document of tagsSnapshot.docs) {
      const data = document.data(); // 문서 데이터를 가져옴
  
      // name 값을 소문자로 변환하여 문서 업데이트
      await updateDoc(document.ref, { name: data.name.toLowerCase() });
    }
      
    // 마이그레이션 완료 메시지 출력
    console.info("migration finished");
  }