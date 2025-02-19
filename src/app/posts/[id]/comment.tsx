"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Comment {
  userId: string;
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface Post {
  authorId: string;
  id: string;
  title: string;
  content: string;
  nickname: string;
  image: string | null;
  video: string | null;
  createdAt: Date;
  comments: Comment[];
  userId: string;
}

export default function CommentComponent({ post }: { post: Post }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setPosts([post]);
  }, [post]);

  const handleCommentSubmit = async (id: string) => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
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

      const { data: updatedComments } = await axios.get(
        `/api/post/comments/${id}`
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, comments: updatedComments } : post
        )
      );

      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(posts);

  return (
    <>
      <div className="cafe-left-right">
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
                          src="https://www.studiopeople.kr/common/img/default_profile.png"
                        />
                        <div>
                          <p className="cafe-postcomment-nickname">
                            {comment.author}
                            {post.authorId === comment.userId ? (
                              <span
                                style={{
                                  color: "rgb(138, 156, 255)",
                                  marginLeft: "5px",
                                }}
                              >
                                (작성자)
                              </span>
                            ) : null}
                          </p>
                          <p className="cafe-postinfo-nickname-sub">
                            {new Date(comment.createdAt).toLocaleString()}
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
      <div className="margin"></div>
    </>
  );
}
