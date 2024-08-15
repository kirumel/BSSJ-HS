import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

// Prisma Client 직접 설정
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Enables dynamic rendering for this page

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  createdAt: Date;
}

async function getPost(id: number): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return post;
}

export default async function PostPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const post = await getPost(parseInt(params.id));

  if (!post) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  const postDate = new Date(post.createdAt);
  const today = new Date();
  const isToday = postDate.toDateString() === today.toDateString();
  const isSameYear = postDate.getFullYear() === today.getFullYear();

  let formattedDate;
  if (isToday) {
    formattedDate = `오늘 ${postDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isSameYear) {
    formattedDate = postDate.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } else {
    formattedDate = postDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.nickname}</p>
      <p>{formattedDate}</p>
      <p>{post.content}</p>
      <Link href="/cafe">목록으로</Link>
    </div>
  );
}
