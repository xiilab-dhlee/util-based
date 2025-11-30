# 프론트엔드 개발 협의 사항

이 문서는 프론트엔드 개발 중 협의된 내용을 정리합니다.

---

## React Query (TanStack Query)

### useQuery의 enabled 옵션 처리

**협의일**: 2025-11-30

**상황**: `useQuery` 사용 시 특정 파라미터(예: `imageId`)를 전달받고, 해당 값이 `null` 또는 `undefined`인 경우에만 쿼리를 비활성화(`enabled: false`)해야 하는 경우

**협의 내용**: `es-toolkit`의 `isNil` 함수를 사용하여 `null` 또는 `undefined` 여부를 체크한다.

**예시 코드**:

```typescript
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

export const useGetInternalRegistryImageTagOptions = (
  imageId: InternalRegistryImageIdType,
) => {
  return useQuery({
    queryKey: internalregistryImageKeys.allTagList(imageId),
    queryFn: async () => {
      // ...
    },
    enabled: !isNil(imageId), // id가 null 또는 undefined가 아닌 경우에만 쿼리 활성화
  });
};
```

**참고 파일**: [use-get-internal-registry-image-tag-options.ts](../src/domain/internal-registry-image/hooks/use-get-internal-registry-image-tag-options.ts)

**이유**:
- `isNil`은 `null`과 `undefined`만 체크하므로 `0`, `""`, `false` 등 falsy 값은 유효한 값으로 취급됨
- `!imageId`를 사용하면 `0`이나 빈 문자열도 falsy로 처리되어 의도치 않게 쿼리가 비활성화될 수 있음
- 명시적이고 읽기 쉬운 코드 작성 가능

---

## 컴포넌트 위치 관리

### 다중 도메인 사용 컴포넌트의 shared 이동

**협의일**: 2025-11-30

**상황**: 특정 도메인에서 생성된 컴포넌트가 다른 도메인에서도 import되어 사용되는 경우

**협의 내용**: 두 개 이상의 도메인에서 사용되는 컴포넌트는 `shared` 폴더에서 관리한다.

**적용 사례**: `WorkloadVolumeCard` 컴포넌트

- **이전 위치**: `src/domain/volume/components/workload-volume-card.tsx`
- **이동 위치**: `src/shared/components/card/workload-volume-card.tsx`
- **이동 사유**: `volume`, `workload` 등 여러 도메인에서 import되어 사용됨

**참고 파일**: [workload-volume-card.tsx](../src/shared/components/card/workload-volume-card.tsx)

**이유**:
- 도메인 간 의존성을 최소화하고 명확한 경계를 유지
- 공유 컴포넌트의 위치를 일관성 있게 관리
- 컴포넌트의 특성에 따라 적절한 하위 폴더에 배치 (예: Card 기반 컴포넌트는 `shared/components/card/`)

---

## Import 경로 규칙

### @/ Alias 사용

**협의일**: 2025-11-30

**상황**: 프로젝트 내에서 import 경로가 상대 경로(`../`, `./`)와 절대 경로(`@/`)가 혼용되어 일관성이 부족한 경우

**협의 내용**: 모든 import 경로는 `@/` alias를 사용하여 절대 경로로 작성한다.

**예시 코드**:

```typescript
// ❌ Bad - 상대 경로 사용
import { settingKeys } from "../constants/setting.key";
import { ManageParameter } from "./manage-parameter";
import type { VolumeListType } from "../../schemas/volume.schema";

// ✅ Good - @/ alias 사용
import { settingKeys } from "@/domain/setting/constants/setting.key";
import { ManageParameter } from "@/domain/sourcecode/components/manage-parameter";
import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
```

**예외 사항**:
- `index.ts` 파일에서 같은 폴더 내 모듈을 re-export하는 경우는 상대 경로 사용 가능

```typescript
// src/domain/group/components/detail-panel/index.ts
// ✅ 허용 - index.ts에서의 re-export
export { AccountDetailPanel } from "./account-detail-panel";
export { GroupDetailPanel } from "./group-detail-panel";
```

**이유**:
- 파일 이동 시 import 경로 수정 최소화
- 코드 가독성 향상 및 파일 위치 파악 용이
- 일관된 코드 스타일 유지

---

<!-- 새로운 협의 사항은 위의 구분선 아래에 추가하세요 -->
