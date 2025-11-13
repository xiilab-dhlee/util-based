"use client";

import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { Table } from "xiilab-ui";

import {
  privateRegistryListAtom,
  privateRegistrySelectedItemsAtom,
} from "@/atoms/private-registry/private-registry-list.atom";
import { createPrivateRegistryListColumn } from "@/components/common/columns/private-registry-list-column.deprecated";
// TODO: API 연동 후 활성화
// import { useGetPrivateRegistryImages } from "@/hooks/private-registry/use-get-private-registry-images";
import { PRIVATE_REGISTRY_SAMPLE_RESPONSE } from "@/constants/private-registry/private-registry-sample.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

// TODO: API 연동 후 활성화
// import {
//   privateRegistryListPayloadAtom,
//   privateRegistrySearchTextAtom,
// } from "@/atoms/private-registry/private-registry-list.atom";

/**
 * 내부 레지스트리 목록 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 목록을 테이블 형태로 표시합니다.
 */
export function PrivateRegistryListBody() {
  const router = useRouter();
  // 선택된 행 관리 (atom 사용)
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(
    privateRegistrySelectedItemsAtom,
  );
  // 페이징 상태 가져오기
  const filterState = useAtomValue(privateRegistryListAtom);

  // 행 클릭 핸들러
  const handleRowClick = (record: PrivateRegistryImage) => {
    router.push(`/standard/private-registry/${record.id}`);
  };

  // TODO: API 연동 후 활성화
  // const payload = useAtomValue(privateRegistryListPayloadAtom);
  // 검색어

  // TODO: API 연동 후 활성화
  // const { data, isLoading, isFetching, isError, error, refetch } =
  //   useGetPrivateRegistryImages(payload);

  // 임시 샘플 데이터 사용
  const data = PRIVATE_REGISTRY_SAMPLE_RESPONSE;
  const isLoading = false;
  const isFetching = false;
  // TODO: API 연동 후 활성화
  // const isError = false;
  // const error: Error | null = null;
  // const refetch = () => console.log("TODO: API 연동 후 구현 예정");

  // 로딩 상태 처리
  if (isLoading || isFetching) {
    return (
      <ListWrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            color: "#666",
          }}
        >
          내부 레지스트리 이미지 목록을 불러오는 중...
        </div>
      </ListWrapper>
    );
  }

  // TODO: API 연동 후 에러 상태 처리 활성화
  // if (isError) {
  //   return (
  //     <ListWrapper>
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           minHeight: "200px",
  //           color: "#d32f2f",
  //           gap: "1rem",
  //         }}
  //       >
  //         <div>내부 레지스트리 이미지 목록을 불러오는데 실패했습니다.</div>
  //         <div style={{ fontSize: "0.9rem", color: "#666" }}>
  //           {error?.message || "알 수 없는 오류가 발생했습니다."}
  //         </div>
  //         <button
  //           onClick={() => refetch()}
  //           style={{
  //             padding: "0.5rem 1rem",
  //             backgroundColor: "#0070f3",
  //             color: "white",
  //             border: "none",
  //             borderRadius: "4px",
  //             cursor: "pointer",
  //           }}
  //         >
  //           다시 시도
  //         </button>
  //       </div>
  //     </ListWrapper>
  //   );
  // }

  // 데이터가 없는 경우
  const images = data?.images || [];
  if (images.length === 0) {
    return (
      <ListWrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            color: "#666",
          }}
        >
          내부 레지스트리 이미지가 없습니다.
        </div>
      </ListWrapper>
    );
  }

  // 페이징 처리 - 현재 페이지에 해당하는 데이터만 표시
  const startIndex = (filterState.page - 1) * filterState.size;
  const endIndex = startIndex + filterState.size;
  const paginatedImages = images.slice(startIndex, endIndex);

  return (
    <ListWrapper>
      <Table
        columns={createPrivateRegistryListColumn(handleRowClick)}
        dataSource={paginatedImages}
        pagination={false}
        size="small"
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: React.Key[]) => {
            console.log("Selection changed:", selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        style={{
          minHeight: "200px",
        }}
      />
    </ListWrapper>
  );
}

