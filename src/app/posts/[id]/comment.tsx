"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  nickname: string;
  image: string | null;
  video: string | null;
  createdAt: Date;
  comments: Comment[];
}

export default function CommentComponent({ post }: { post: Post }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>(""); // 댓글 입력을 위한 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Ensure post is set initially
    setPosts([post]);
  }, [post]);

  const handleCommentSubmit = async (id: string) => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true); // 로딩 상태 시작
      await axios.post(
        `/api/post/comments/${id}`,
        {
          postId: id,
          author: session?.user?.nickname,
          content: newComment,
          userId: session?.user?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch updated comments
      const { data: updatedComments } = await axios.get(
        `/api/post/comments/${id}`
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, comments: updatedComments } : post
        )
      );

      setNewComment(""); // 댓글 전송 후 입력 필드 초기화
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <>
      <div className="comment">
        {posts.map((post) => (
          <div key={post.id}>
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id}>
                  <div className="bordercomment">
                    <div className="display-postinfo-content">
                      <img
                        className="cafe-postinfo-content-img"
                        src="https://i.namu.wiki/i/J5G6syxG5GY46eCiCVloOXVIOm4wgvD9Shtf8tVfjf-CdMM2XbeCaNWHQalrKxe8hzy-35nVo1AFpg3U6y6lcg.webp"
                      ></img>
                      <div>
                        <p className="cafe-postinfo-nickname">익명</p>

                        <p className="cafe-postinfo-nickname-sub">
                          {comment.userId}
                        </p>
                      </div>
                    </div>
                    <p className="postinfo-content">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>첫번째 댓글을 남겨보세요!</p>
            )}
          </div>
        ))}
      </div>
      <div className="commentbar">
        <input
          className="inputcomment"
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글 작성하기"
        />

        <button
          className="commentbtn"
          onClick={() => handleCommentSubmit(post.id)}
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "보내기"}
        </button>
      </div>
    </>
  );
}