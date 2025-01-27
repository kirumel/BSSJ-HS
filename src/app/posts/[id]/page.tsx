import { PrismaClient } from "@prisma/client";
import Link from "next/link";

import "../../cafe/cafe.css";
import Comment from "./comment";
const prisma = new PrismaClient();
interface Post {
  id: string;
  title: string;
  content: string;
  nickname: string | null;
  image: string | null;
  video: string | null;
  createdAt: Date;
  likes: Like[];
  comments: Comment[]; // Add this line to include comments
}
interface Like {
  id: string;
  postId: string;
  userId: string | null;
  createdAt: Date;
}
interface Comment {
  id: string;
  postId: string;
  userId: string | null;
  sjhsUserId: string | null;
  author: string | null;
  content: string;
  createdAt: Date;
}
export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let post: Post | null = null;

  try {
    post = await prisma.post.findFirst({
      where: { id },
      include: {
        comments: true,
        likes: true,
        author: true,
      },
    });
  } catch (error) {
    console.error(error);
    return <div>오류가 발생했습니다.</div>;
  } finally {
    await prisma.$disconnect();
  }
  if (!post) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  const postDate = new Date(post.createdAt);
  const today = new Date();
  const isToday = postDate.toDateString() === today.toDateString();
  const isSameYear = postDate.getFullYear() === today.getFullYear();

  let formattedDate;
  if (isToday) {
    formattedDate = `오늘 ${postDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (isSameYear) {
    formattedDate = postDate.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    formattedDate = postDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="cafe-left-right">
        <div className="display-postinfo-center">
          <div className="cafe-postinfo-top ">
            <img
              src="https://i.imgur.com/tgVDqj1.jpeg"
              className="cafe-postinfo-img "
            ></img>
            <div>
              <p className="cafe-postinfo-nickname">익명</p>
              <p className="cafe-postinfo-nickname-sub">{formattedDate}</p>
            </div>
          </div>
        </div>
        <p className="postinfo-title">{post.title}</p>
        <p className="postinfo-content">{post.content}</p>
      </div>

      <div className="line" style={{ marginTop: "2rem" }}></div>
      <Comment post={post} />
      <div className="margin"></div>
    </div>
  );
}
