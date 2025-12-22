"use server";

import StreamWrapper from "@/components/rooms/stream-wrapper";
import { getCurrentUser } from "@/utils/auth-server";
import React from "react";

const StudyRoomLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await getCurrentUser();

	return <StreamWrapper user={user}>{children}</StreamWrapper>;
};

export default StudyRoomLayout;
