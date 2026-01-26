"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { UserResourceService } from "@/domain/monitoring/api/user-resource.service";
import { ReportService } from "@/domain/report/api/report.service";
import { ReportReservationService } from "@/domain/report-reservation/api/report-reservation.service";
import { ResourcePresetService } from "@/domain/resource-preset/api/resource-preset.service";
import { FileSecurityService } from "@/domain/security/api/file-security.service";
import { RegistrySecurityService } from "@/domain/security/api/registry-security.service";
import { SourcecodeService } from "@/domain/sourcecode/api/sourcecode.service";
import { HpeService } from "@/domain/system-setting/api/hpe.service";
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
  reportService: ReportService;
  reportReservationService: ReportReservationService;
  gpuService: GpuService;
  registrySecurityService: RegistrySecurityService;
  fileSecurityService: FileSecurityService;
  resourcePresetService: ResourcePresetService;
  hpeService: HpeService;
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
    reportService: new ReportService(),
    reportReservationService: new ReportReservationService(),
    gpuService: new GpuService(),
    registrySecurityService: new RegistrySecurityService(),
    fileSecurityService: new FileSecurityService(),
    resourcePresetService: new ResourcePresetService(),
    hpeService: new HpeService(),
    workspaceResourceSettingService: new WorkspaceResourceSettingService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
