// 서비스 모델
export interface Service {
  id: string;
  name: string;
  platformName: string;
  version: string;
  description: string;
  createdAt: string;
  status: "RUNNING" | "PENDING";
}
