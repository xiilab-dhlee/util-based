import type {
  DaemonsetListResponse,
  DeploymentListResponse,
  GetDaemonsetsPayload,
  GetDeploymentsPayload,
  GetNamespacesPayload,
  GetNodesPayload,
  GetPersistentVolumesPayload,
  GetPodsPayload,
  GetServicesPayload,
  GetStatefulsetsPayload,
  NamespaceListResponse,
  NodeListResponse,
  PersistentVolumeListResponse,
  PodListResponse,
  ServiceListResponse,
  StatefulsetListResponse,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class KubernetesMonitoringService extends AxiosService {
  private readonly BASE_URL = "/api/v1/k8s/resources";

  /**
   * Nodes 목록 조회
   * GET /api/v1/k8s/resources/Nodes
   */
  public async getNodes(
    payload: GetNodesPayload,
  ): Promise<{ data: NodeListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<NodeListResponse>(`${this.BASE_URL}/Nodes`, {
      params,
    });
  }

  /**
   * Service 목록 조회
   * GET /api/v1/k8s/resources/Service
   */
  public async getServices(
    payload: GetServicesPayload,
  ): Promise<{ data: ServiceListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<ServiceListResponse>(
      `${this.BASE_URL}/Service`,
      { params },
    );
  }

  /**
   * Daemonsets 목록 조회
   * GET /api/v1/k8s/resources/Daemonsets
   */
  public async getDaemonsets(
    payload: GetDaemonsetsPayload,
  ): Promise<{ data: DaemonsetListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<DaemonsetListResponse>(
      `${this.BASE_URL}/Daemonsets`,
      { params },
    );
  }

  /**
   * PersistentVolume 목록 조회
   * GET /api/v1/k8s/resources/PersistentVolume
   */
  public async getPersistentVolumes(
    payload: GetPersistentVolumesPayload,
  ): Promise<{ data: PersistentVolumeListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<PersistentVolumeListResponse>(
      `${this.BASE_URL}/PersistentVolume`,
      { params },
    );
  }

  /**
   * Namespaces 목록 조회
   * GET /api/v1/k8s/resources/Namespaces
   */
  public async getNamespaces(
    payload: GetNamespacesPayload,
  ): Promise<{ data: NamespaceListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<NamespaceListResponse>(
      `${this.BASE_URL}/Namespaces`,
      { params },
    );
  }

  /**
   * Deployments 목록 조회
   * GET /api/v1/k8s/resources/Deployments
   */
  public async getDeployments(
    payload: GetDeploymentsPayload,
  ): Promise<{ data: DeploymentListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<DeploymentListResponse>(
      `${this.BASE_URL}/Deployments`,
      { params },
    );
  }

  /**
   * Statefulsets 목록 조회
   * GET /api/v1/k8s/resources/Statefulsets
   */
  public async getStatefulsets(
    payload: GetStatefulsetsPayload,
  ): Promise<{ data: StatefulsetListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<StatefulsetListResponse>(
      `${this.BASE_URL}/Statefulsets`,
      { params },
    );
  }

  /**
   * Pods 목록 조회
   * GET /api/v1/k8s/resources/Pods
   */
  public async getPods(
    payload: GetPodsPayload,
  ): Promise<{ data: PodListResponse }> {
    const params = payloadToParams(payload);
    return this.getAxios().get<PodListResponse>(`${this.BASE_URL}/Pods`, {
      params,
    });
  }
}

export const kubernetesMonitoringService = new KubernetesMonitoringService();
