import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 가능한 요소에 하단 box-shadow를 자동으로 추가하는 훅
 * 스크롤이 가능하고 맨 아래가 아닐 때만 shadow가 표시됩니다.
 *
 * @returns [ref, showShadow] - 요소에 연결할 ref와 shadow 표시 여부
 *
 * @example
 * ```tsx
 * const [scrollRef, showShadow] = useScrollShadow();
 *
 * return (
 *   <Container ref={scrollRef} $showShadow={showShadow}>
 *     {children}
 *   </Container>
 * );
 * ```
 */
export function useScrollShadow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkScroll = () => {
      const hasScroll = element.scrollHeight > element.clientHeight;
      const isAtBottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 1; // 1px 오차 허용

      // 스크롤이 가능하고 맨 아래가 아닐 때만 shadow 표시
      setShowShadow(hasScroll && !isAtBottom);
    };

    // 초기 체크
    checkScroll();

    // 스크롤 이벤트 감지
    element.addEventListener("scroll", checkScroll);

    // 크기 변경 감지 (내용이 추가/제거될 때)
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(element);

    // MutationObserver로 DOM 변경 감지 (자식 요소 추가/제거)
    const mutationObserver = new MutationObserver(checkScroll);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
    });

    return () => {
      element.removeEventListener("scroll", checkScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return [ref, showShadow] as const;
}
