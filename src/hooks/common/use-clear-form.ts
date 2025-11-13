import { useCallback, useState } from "react";

/**
 * 폼 초기화를 위한 커스텀 훅
 *
 * renderKey를 사용한 강제 리렌더링과 상태 초기화 기능을 제공합니다.
 * 폼의 모든 입력값을 초기 상태로 리셋할 때 사용합니다.
 *
 * @returns 폼 초기화 관련 상태와 함수들
 */
export const useClearForm = () => {
  // 리렌더링을 위한 key 상태
  const [renderKey, setRenderKey] = useState<number>(0);

  /**
   * 폼 초기화 함수
   *
   * renderKey를 증가시켜 컴포넌트를 강제로 리렌더링합니다.
   * 이 함수를 호출하면 폼의 모든 입력값이 초기화됩니다.
   */
  const clearForm = useCallback(() => {
    setRenderKey((prev) => prev + 1);
  }, []);

  /**
   * 현재 renderKey 값을 반환합니다.
   * 폼 컴포넌트에 key prop으로 전달하여 사용합니다.
   */
  const getFormKey = useCallback(() => renderKey, [renderKey]);

  return {
    clearForm,
    getFormKey,
    renderKey,
  };
};
