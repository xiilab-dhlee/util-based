export type MonitoringMetricType =
  /** GPU 사용률 % */
  | "gpu-utilization"
  /** GPU 메모리 */
  | "gpu-memory"
  /** GPU 온도 */
  | "gpu-temperature"
  /** 팬 속도 */
  | "gpu-fan-speed"
  /** 전력 사용량 */
  | "gpu-power-usage"
  /** CPU 사용률 */
  | "cpu-utilization"
  /** CPU 사용량 */
  | "cpu-usage"
  /** CPU 온도 */
  | "cpu-temperature"
  /** CPU 평균부하 */
  | "cpu-load-average"
  /** 메모리 사용률 */
  | "memory-utilization"
  /** 메모리 사용량 */
  | "memory-usage"
  /** 메모리 상세 */
  | "memory-detail"
  /** 네트워크 데이터 송수신 */
  | "network-rt"
  /** 디스크 사용률 */
  | "disk-utilization"
  /** 디스크 읽기/쓰기 */
  | "disk-rw";
