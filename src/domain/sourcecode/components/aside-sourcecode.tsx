"use client";

import { useAtomValue } from "jotai";

import { sourcecodeSelectedAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { CreateSourcecode } from "./create-sourcecode";
import { UpdateSourcecode } from "./update-sourcecode";

/**
 * AsideSourcecode 컴포넌트
 *
 * 소스코드 Aside 영역의 메인 컴포넌트입니다.
 * 선택된 소스코드가 없으면 생성 폼을, 있으면 수정 폼을 표시합니다.
 *
 * @returns 소스코드 생성/수정 UI를 포함한 JSX 요소
 */
export function AsideSourcecode() {
  const selectedId = useAtomValue(sourcecodeSelectedAtom);

  if (selectedId === null) {
    return <CreateSourcecode />;
  }

  return <UpdateSourcecode id={selectedId} />;
}
