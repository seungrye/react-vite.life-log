# Directory Structure

```txt
src/
├─ pages/
│    ├─ Home.js           // 블로그의 메인 페이지, 최신 글 목록과 인기 게시물을 표시
│    ├─ PostDetail.js     // 개별 블로그 게시물의 상세 내용을 표시하는 페이지
│    ├─ PostEditor.js     // 블로그 글 작성 및 수정 페이지, 에디터 포함
│    ├─ Tag.js            // 특정 태그에 속한 게시물 목록을 표시하는 페이지
│    ├─ SearchResults.js  // 검색어에 맞는 게시물 목록을 표시하는 검색 결과 페이지
│    │                    //  제목에서 검색. 특정 조건에 맞춰 검색 가능
│    │                    //  (ex> category:<text> or tag:<text>)
│    ├─ Profile.js        // 작성자나 사용자 프로필 페이지, 작성한 글 목록을 포함
│    ├─ Signin.js         // 사용자 로그인 페이지
│    ├─ Signup.js         // 회원가입 페이지
│    ├─ About.js          // 블로그(사이트)에 대한 정보를 제공하는 페이지
│    ├─ Archive.js        // 연도별, 월별 게시물을 정리해서 보여주는 아카이브 페이지
```

* Note. Tag.js 는 [react-wordcloud](https://github.com/chrisrzhou/react-wordcloud) 를 사용하도록 해 보자

```json
user {
  email:,
  displayName:,
}

post {
  author: str, // email
  title: str,
  content: str (markdown),
  category: str,
  tags: [],
  likes: number,
  createdAt: date,
  updatedAt: data,
}
```

* Note. SubmitForm.tsx 에서 tag inline input 은 [tagify](https://yaireo.github.io/tagify/) 를 사용해 보도록 하자
