// 워크스페이스 리소스 요청
export type WorkspaceRequestResource = {
  // 리소스 요청 아이디
  id: number;
  // 워크스페이스 이름
  workspaceName: string;
  // 워크스페이스 ID
  workspaceResourceName: string;
  // 요청 사유
  requestReason: string;
  // 반려 사유
  rejectReason: string | null;
  // 상태
  status: string;
  // 수정일
  modDate: string;
  // 생성일
  regDate: string;
  // CPU 요청량
  cpuReq: number;
  // GPU 요청량
  gpuReq: number;
  // MEM 요청량
  memReq: number;
  // 요청자
  requester: string;
  // MIG 요청량(프로파일 목록)
  migGpu: string[];
};
