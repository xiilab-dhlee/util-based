/**
 * GPU 관련 타입 정의
 * TODO: Orval API 연동 시 실제 API 응답 타입으로 대체 필요
 */

/** GPU 목록 타입 */
export interface GpuListType {
  name: string;
  memory: number;
  isAvailable: boolean;
}

/** GPU 노드 목록 타입 */
export interface GpuNodeListType {
  name: string;
  cpuUsed: number;
  cpuTotal: number;
  memoryUsed: number;
  memoryTotal: number;
  gpuUsed: number;
  gpuTotal: number;
}

/** GPU 프로파일 목록 타입 */
export interface GpuProfileListType {
  name: string;
  total: number;
  used: number;
}
