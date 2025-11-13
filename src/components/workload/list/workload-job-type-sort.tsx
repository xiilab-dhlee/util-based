"use client";

import { useAtom } from "jotai";

import { workloadJobTypeAtom } from "@/atoms/workload/workload-list.atom";
import { MySelect } from "@/components/common/select";
import { Workload } from "@/models/workload.model";

/**
 * 워크로드 목록 페이지 작업 유형 정렬 컴포넌트
 *
 * 워크로드 목록 페이지에서 작업 유형(INTERACTIVE, BATCH)을 선택하여
 * 해당 유형의 워크로드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @returns 워크로드 목록 페이지 작업 유형 정렬 컴포넌트
 */
export function WorkloadJobTypeSort() {
  const [jobtype, setJobtype] = useAtom(workloadJobTypeAtom);

  const handleChange = (value: string | null) => {
    if (value) {
      setJobtype(value);
    }
  };

  return (
    <MySelect
      options={Workload.JOB_TYPE_OPTIONS}
      placeholder="워크로드 잡 타입"
      setValue={handleChange}
      value={jobtype}
      width={150}
      height={30}
    />
  );
}
