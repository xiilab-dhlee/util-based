import type { Metadata } from "next";

import { RequestImageListMain } from "@/domain/request-image/components/request-image-list-main";

export const metadata: Metadata = {
  title: "Request Image",
};

export default function AdminRequestImagePage() {
  return <RequestImageListMain />;
}
