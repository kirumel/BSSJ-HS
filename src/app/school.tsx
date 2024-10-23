"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SchoolPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/schooltest");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  const rendomindex =
    posts.length > 0 ? Math.floor(Math.random() * posts.length) : null;

  return (
    <div className="school-etc">
      {rendomindex !== null && posts[rendomindex] && (
        <Link
          href={`https://school.busanedu.net/${
            posts[rendomindex]?.link || "schooltest"
          }`}
        >
          <div className="display-flex-school">
            <div className="school-text-title">학교 공지사항 :</div>
            <div className="school-text">{posts[rendomindex]?.text}</div>
          </div>
        </Link>
      )}
    </div>
  );
}
