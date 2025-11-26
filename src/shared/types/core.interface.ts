/**
 * 모든 페이지에서 사용되는 공통 인터페이스를 정의
 *
 */

// 보안 상태 타입
export type CoreSecurityLevel = "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
// 파일 트리 들여쓰기 위치 타입
export type CoreFileIndentPosition = "first" | "middle" | "last";
// 파일 압축 타입
export type CoreFileCompressionType = "ZIP" | "TAR";
// 리소스
export type CoreResourceType = "GPU" | "MIG" | "MPS" | "CPU" | "MEM" | "DISK";
// 노드 모드 타입
export type CoreNodeMode = "single" | "multi";
