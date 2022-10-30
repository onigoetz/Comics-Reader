"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logout } from "../../hoc/withAuth";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    logout();
    router.push("/login");
  }, []);

  return null;
}
