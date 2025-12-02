"use client";
import { Popover } from "antd";
import classNames from "classnames";
import { useAtom } from "jotai";
import Image from "next/image";
import { toast } from "react-toastify";
import styled from "styled-components";

import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";
import { terminalThemeAtom } from "@/shared/state/terminal.atom";
import { toolButtonStyle } from "@/styles/mixins/button";
import { createTermBgClasses } from "@/styles/mixins/terminal";

export function TerminalThemeButton() {
  const [terminalTheme, setTerminalTheme] = useAtom(terminalThemeAtom);
  const [, setThemeType] = useLocalStorage("terminalTheme", "MaterialDark");

  // 테마 변경 핸들러
  const handleClickThemeOption = (theme: string) => {
    setTerminalTheme(theme);
    setThemeType(theme);
    toast.success(`테마가 적용되었습니다.`);
  };

  // 테마 팝업 내용
  const themePopupContent = (
    <Container>
      <Title>배경 색상 선택</Title>
      <OptionList>
        {Object.keys(TERMINAL_THEME_LIST).map((v) => (
          <Option
            key={v}
            onClick={() => handleClickThemeOption(v)}
            className={classNames(v, {
              selected: terminalTheme === v,
            })}
          />
        ))}
      </OptionList>
    </Container>
  );

  return (
    <Popover
      content={themePopupContent}
      trigger="click"
      placement="bottomRight"
    >
      <ThemeButton>
        <Image
          src="/images/color-picker.png"
          width={18}
          height={18}
          alt="Picker"
        />
      </ThemeButton>
    </Popover>
  );
}

const ThemeButton = styled.button`
  ${toolButtonStyle}
`;

const Container = styled.div`
  padding: 2px 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #000;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Option = styled.div`
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 24px;
  height: 24px;
  border-radius: 50%;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    z-index: 1;
  }

  &.selected::before {
    border: 1px solid #fff;
  }

  ${createTermBgClasses()}
`;
