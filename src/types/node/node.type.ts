import type { CorePaginate, CorePayload } from "../common/api.interface";
import type { NodeMigInfo } from "./node.model";

export interface GetNodesPayload extends CorePayload, CorePaginate {}

export interface GetNodePayload {
  /** Node ID */
  id: string;
}

export interface UpdateMpsPayload {
  nodeName: string;
  mpsCapable: boolean;
  mpsReplicas: number;
}

export interface UpdateMigPayload extends NodeMigInfo {}

export interface UpdateNodeSchedulingPayload {
  nodeName: string;
  type: "ON" | "OFF";
}

// MIG 설정 대상 GPU
export type MigGpu = {
  gpuIndex: number;
  migEnable: boolean;
  configId: number;
};

/**
 * GPU 설정 인터페이스
 */
export interface GpuConfig {
  /** 컴퓨팅 단위 */
  compute: number;
  /** 메모리 용량 (GB) */
  memory: number;
}

/**
 * GPU 모델별 설정 인터페이스
 */
export interface GpuModelConfig {
  /** GPU 설정 배열 */
  configs: GpuConfig[];
}

/**
 * GPU 모델별 설정 맵 타입
 */
export type GpuConfigMap = Record<string, GpuModelConfig>;

/**
 * GPU 인스턴스 노드 타입 정의
 */
export interface GpuInstanceNode {
  type: "node" | "column";
  name?: string;
  gpuIndex?: number;
  children?: GpuInstanceNode[];
}

/**
 * GPU 인스턴스 행 구성 정의
 */
export interface GpuInstanceRow {
  height: number;
  nodes: GpuInstanceNode[];
}
