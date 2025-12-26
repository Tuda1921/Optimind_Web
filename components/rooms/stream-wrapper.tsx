"use client";

import { ReactNode } from "react";
import StreamVideoProvider from "@/hooks/useStream";

interface StreamWrapperProps {
  user: any;
  children: ReactNode;
}

export default function StreamWrapper({ user, children }: StreamWrapperProps) {
  if (!user) {
    return <div className="text-red-500 p-4">User not authenticated</div>;
  }

  return (
    <StreamVideoProvider user={user}>
      {children}
    </StreamVideoProvider>
  );
}
