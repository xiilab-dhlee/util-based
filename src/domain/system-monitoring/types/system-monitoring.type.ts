/**
 * 노드 요약 정보 API 응답
 * GET /api/v1/cluster/nodes/{nodeName}/system-resources/summary
 */
export interface SystemResourcesSummaryResponse {
  nodeName: string;
  nodeIp: string;
  resource: {
    cpuCore: number;
    memoryByte: number;
    gpuCount: number;
    diskByte: number;
  };
  gpuName: string[]; // ["NVIDIA TITAN Xp-1", "NVIDIA TITAN Xp-2", ...]
}

/**
 * 메트릭 데이터 포인트
 */
export interface MetricDataPoint {
  dateTime: string; // ISO8601 형식
  value: string; // 숫자지만 API에서 string으로 전달
}

/**
 * 리소스 메트릭 API 응답
 * GET /api/v1/cluster/nodes/{nodeName}/resources/metrics
 */
export interface ResourceMetricResponse {
  metricName: string;
  nameSpace?: string;
  internalIp?: string;
  nodeName: string;
  podName?: string;
  kubeNodeName?: string;
  modelName?: string; // GPU 모델명
  gpuIndex?: string; // GPU 인덱스
  instance?: string;
  prettyName?: string; // 표시용 이름 (NVIDIA TITAN Xp-1)
  value: MetricDataPoint[];
}

/**
 * 메트릭 조회 요청 페이로드
 */
export interface GetMetricsPayload {
  nodeName: string;
  metricName: string;
  startDateTime: Date;
  endDateTime: Date;
  gpuName?: string[]; // GPU 필터 (선택사항)
}
