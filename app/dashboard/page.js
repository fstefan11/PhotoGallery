"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  console.log(status);
  console.log(session);
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
