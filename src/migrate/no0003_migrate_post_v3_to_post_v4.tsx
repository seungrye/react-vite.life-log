import { query, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function migrate_post_v3_to_post_v4() {
    const postsQuery = query(collection(db, "posts-v3"));
    const postsSnapshot = await getDocs(postsQuery); // 쿼리 결과를 가져옴
  
    for (const document of postsSnapshot.docs) {
      const data = document.data(); // 문서 데이터를 가져옴

      data.keywords = data.title.split(" ").filter((v:string) => v.trim().length > 1)
  
      // 변환된 데이터를 "posts-v3" 컬렉션에 추가
      await addDoc(collection(db, "posts-v4"), data);
    }
  
    // 마이그레이션 완료 메시지 출력
    console.info("migration finished");
  }