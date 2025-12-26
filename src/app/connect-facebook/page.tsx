"use client";

import { FacebookConnect } from "@/components/FacebookConnect";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/sections/navbar";

export default function ConnectFacebookPage() {
  return (
    <>
      <Navbar />
      <AuthGuard>
        <FacebookConnect />
      </AuthGuard>
    </>
  );
}

