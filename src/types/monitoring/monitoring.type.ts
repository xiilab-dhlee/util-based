export type MonitoringMetricType =
  /** GPU 사용률 % */
  | "gpu-utilization"
  /** GPU 사용량 */
  | "gpu-memory"
  /** 메모리 사용률 */
  | "memory-utilization"
  /** 메모리 사용량 */
  | "memory-usage"
  /** CPU 사용률 */
  | "cpu-utilization"
  /** CPU 사용량 */
  | "cpu-usage"
  /** 디스크 사용률 */
  | "disk-utilization"
  /** 디스크 사용량 */
  | "disk-usage";
