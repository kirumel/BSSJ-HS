"use client";
import { useEffect, useState } from "react";

import "./style.css";

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
  console.log(posts);
  return (
    <div>
      <p className="main-title">학교 공지사항</p>
      {posts.map((post, index) => (
        <div key={index}>
          <a className="post" href={`https://school.busanedu.net/${post.link}`}>
            <p>{post.text} </p>
            <p>&gt;</p>
          </a>
        </div>
      ))}
      <div className="margin"></div>
    </div>
  );
}
