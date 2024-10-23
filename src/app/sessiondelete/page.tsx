"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SessionDelete() {
  const [session, setSession] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  async function handleDelete() {
    if (!session) {
      alert("Please enter a session ID.");
      return;
    }

    try {
      const response = await axios.delete(`/api/post/deletesession`, {
        params: {
          id: session,
        },
      });
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`/api/post/deletesession`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []); // Empty array to run the effect only once

  return (
    <div className="sessiondelete">
      <h1>Session Delete</h1>
      <input
        value={session}
        onChange={(e) => setSession(e.target.value)}
        placeholder="Enter session ID"
      />
      <button onClick={handleDelete}>삭제하기</button>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.userId}</li> // Assuming user object has a name property
        ))}
      </ul>
    </div>
  );
}
