"use client";
import { useEffect, useState } from "react";

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
  const rendomindex = Math.floor(Math.random() * posts.length);

  return (
    <div className="etc-container">
      <p className="main-title display-flex-school">
        <p className="school-text-title">학교 공지사항 :</p>
        <p className="school-text"> {posts[rendomindex]?.text}</p>
      </p>
    </div>
  );
}
