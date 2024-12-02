import { Query, Timestamp } from "firebase/firestore";

export interface IPostProps {
  id: string,
  category: string,
  title: string,
  date: string,
  banner: string,
  summary: string
}

export interface IPost {
  id: string,
  author: string;
  category: string;
  content: string;
  createdAt: Timestamp;
  likes: number;
  tags: string[];
  title: string;
  coverImage: string|null;
  updatedAt?: Timestamp | null;
}

export interface PostsProps {
  queryPosts: Query;
}
