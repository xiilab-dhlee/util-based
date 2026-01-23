"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { UserResourceService } from "@/domain/monitoring/api/user-resource.service";
import { NodeService } from "@/domain/node/api/node.service";
import { RedfishService } from "@/domain/node/api/redfish.service";
import { RedfishBmcService } from "@/domain/node/api/redfish-bmc.service";
import { ReportService } from "@/domain/report/api/report.service";
import { ReportReservationService } from "@/domain/report-reservation/api/report-reservation.service";
import { RequestImageService } from "@/domain/request-image/api/request-image.service";
import { ResourcePresetService } from "@/domain/resource-preset/api/resource-preset.service";
import { RevokeHistoryService } from "@/domain/revoke/api/revoke-history.service";
import { FileSecurityService } from "@/domain/security/api/file-security.service";
import { RegistrySecurityService } from "@/domain/security/api/registry-security.service";
import { SourcecodeService } from "@/domain/sourcecode/api/sourcecode.service";
import { HpeService } from "@/domain/system-setting/api/hpe.service";
import { SmtpService } from "@/domain/system-setting/api/smtp.service";
import { WorkspaceResourceSettingService } from "@/domain/system-setting/api/workspace-resource-setting.service";
import { AdminWorkloadService } from "@/domain/workload/api/admin-workload.service";
import { WorkloadService } from "@/domain/workload/api/workload.service";
import { WorkspaceService } from "@/domain/workspace/api/workspace.service";
import { GpuService } from "@/shared/api/gpu.service";

// 서비스 컨텍스트 타입 정의
interface ServiceContextType {
  workspaceService: WorkspaceService;
  workloadService: WorkloadService;
  sourcecodeService: SourcecodeService;
  userResourceService: UserResourceService;
  adminWorkloadService: AdminWorkloadService;
  nodeService: NodeService;
  redfishBmcService: RedfishBmcService;
  redfishService: RedfishService;
  requestImageService: RequestImageService;
  reportService: ReportService;
  reportReservationService: ReportReservationService;
  gpuService: GpuService;
  registrySecurityService: RegistrySecurityService;
  fileSecurityService: FileSecurityService;
  resourcePresetService: ResourcePresetService;
  revokeHistoryService: RevokeHistoryService;
  hpeService: HpeService;
  smtpService: SmtpService;
  workspaceResourceSettingService: WorkspaceResourceSettingService;
}

// 서비스 컨텍스트 생성
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// 서비스 컨텍스트 사용을 위한 훅
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: ServiceContextType = {
    workspaceService: new WorkspaceService(),
    workloadService: new WorkloadService(),
    sourcecodeService: new SourcecodeService(),
    userResourceService: new UserResourceService(),
    adminWorkloadService: new AdminWorkloadService(),
    nodeService: new NodeService(),
    redfishBmcService: new RedfishBmcService(),
    redfishService: new RedfishService(),
    requestImageService: new RequestImageService(),
    reportService: new ReportService(),
    reportReservationService: new ReportReservationService(),
    gpuService: new GpuService(),
    registrySecurityService: new RegistrySecurityService(),
    fileSecurityService: new FileSecurityService(),
    resourcePresetService: new ResourcePresetService(),
    revokeHistoryService: new RevokeHistoryService(),
    hpeService: new HpeService(),
    smtpService: new SmtpService(),
    workspaceResourceSettingService: new WorkspaceResourceSettingService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
