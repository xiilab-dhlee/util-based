import type { MySelectOption } from "@/components/common/select";

const ROLE: MySelectOption[] = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
];

const workspaceMemberConstants = {
  // 페이지 크기
  pageSize: 20,
  // 권한
  role: ROLE,
};

export default workspaceMemberConstants;
