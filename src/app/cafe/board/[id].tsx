"use client";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
};

type Board = {
  id: string;
  name: string;
  posts: Post[];
};

export default function BoardDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/boards/${id}`)
        .then((res) => res.json())
        .then((data) => setBoard(data));
    }
  }, [id]);

  if (!board) return <p>Loading</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{board.name}</h1>
      <h2 className="text-lg mt-4">게시글 목록</h2>
      <ul className="space-y-2 mt-2">
        {board.posts.map((post: any) => (
          <li key={`${post.id}`} className="border p-3 rounded">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
