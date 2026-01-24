import { useEffect, useState } from "react";

/**
 * 주기적인 업데이트를 트리거하는 훅
 * 컴포넌트를 주기적으로 리렌더링하기 위해 사용
 *
 * @param interval - 업데이트 간격 (밀리초, 기본값: 60000 = 1분)
 */
export function usePeriodicUpdate(interval: number = 60000) {
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setUpdateTrigger((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
}
