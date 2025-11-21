import { Slider as AntdSlider, ConfigProvider } from "antd";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
// import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Icon, InputNumber, Typography } from "xiilab-ui";

import type { SliderProps } from "./types";
import { DEFAULT_SLIDER_CONFIG, SLIDER_COLOR_CONFIG } from "./types";

/**
 * Ant Design 기반 Slider 컴포넌트
 */
export const Slider = ({
  value,
  defaultValue = DEFAULT_SLIDER_CONFIG.defaultValue,
  min = DEFAULT_SLIDER_CONFIG.min,
  max = DEFAULT_SLIDER_CONFIG.max,
  step = DEFAULT_SLIDER_CONFIG.step,
  onChange,
  disabled = false,
  readOnly = false,
  readMode = false,
  width = DEFAULT_SLIDER_CONFIG.width,
  type = "gpu",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  sliderProps,
  inputProps,
  showInput = true,
}: SliderProps) => {
  const currentValue = value ?? defaultValue;

  // 색상 타입에 따른 ConfigProvider 테마 생성
  const sliderTheme = useMemo(() => {
    const colorConfig = SLIDER_COLOR_CONFIG[type];
    return {
      components: {
        Slider: {
          // 기본 색상들
          colorPrimary: colorConfig.track,
          colorPrimaryBorder: colorConfig.handle,
          colorPrimaryHover: colorConfig.handle,

          // 핸들 관련 색상들 (readMode일 때는 투명하게)
          handleColor: readMode ? "transparent" : colorConfig.handle,
          handleActiveColor: readMode ? "transparent" : colorConfig.handle,
          handleActiveOutlineColor: readMode
            ? "transparent"
            : `${colorConfig.handle}30`,

          // 핸들 호버 상태 색상들 (readMode일 때는 투명하게)
          handleColorHover: readMode ? "transparent" : colorConfig.handle,
          handleColorFocus: readMode ? "transparent" : colorConfig.handle,

          // 포커스 상태 (readMode일 때는 투명하게)
          colorFocusOutline: readMode
            ? "transparent"
            : `${colorConfig.handle}40`,
          colorFocus: readMode ? "transparent" : colorConfig.handle,

          // 핸들 크기 (readMode일 때는 0으로)
          handleSize: readMode ? 0 : 14,
          handleSizeHover: readMode ? 0 : 16,

          // 트랙 색상
          trackBg: colorConfig.track,
          trackHoverBg: colorConfig.track,

          // 레일 색상
          railBg: "var(--color-gray-10)",
          railHoverBg: "var(--color-gray-10)",
        },
      },
    };
  }, [type, readMode]);

  // 기본 스타일 (크기 및 모양)
  const sliderStyles = useMemo(() => {
    return {
      rail: {
        height: 6,
        borderRadius: 3,
      },
      track: {
        height: 6,
        borderRadius: 3,
      },
    };
  }, []);

  const clamp = useCallback(
    (val: number) => {
      const minVal = min ?? Number.NEGATIVE_INFINITY;
      const maxVal = max ?? Number.POSITIVE_INFINITY;
      return Math.min(Math.max(val, minVal), maxVal);
    },
    [min, max],
  );

  const handleInputChange = useCallback(
    (val: number | string | null) => {
      if (val === null || val === "") return;
      const numeric = typeof val === "string" ? Number(val) : val;
      if (Number.isNaN(numeric)) return;
      onChange?.(clamp(numeric));
    },
    [clamp, onChange],
  );

  const handleSliderChange = useCallback(
    (val: number) => {
      onChange?.(clamp(val));
    },
    [clamp, onChange],
  );

  const handleDecrease = useCallback(() => {
    if (disabled || readOnly) return;
    handleInputChange((currentValue ?? 0) - (step ?? 1));
  }, [disabled, readOnly, currentValue, step, handleInputChange]);

  const handleIncrease = useCallback(() => {
    if (disabled || readOnly) return;
    handleInputChange((currentValue ?? 0) + (step ?? 1));
  }, [disabled, readOnly, currentValue, step, handleInputChange]);

  return (
    <ConfigProvider theme={sliderTheme}>
      <SliderMainContainer
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        <SliderContainer $readMode={readMode}>
          {!readMode && (
            <>
              <IconWrapper
                aria-label="값 감소"
                onClick={handleDecrease}
                disabled={
                  disabled ||
                  readOnly ||
                  (currentValue ?? 0) <= (min ?? Number.NEGATIVE_INFINITY)
                }
                tabIndex={0}
              >
                <Icon name="Minus" color="#000" size={12} />
              </IconWrapper>

              <Divider />
            </>
          )}

          <SliderWrapper $readMode={readMode}>
            <AntdSlider
              value={currentValue}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              onChange={
                readMode
                  ? undefined
                  : (val) => handleSliderChange(val as number)
              }
              aria-label={ariaLabel}
              styles={sliderStyles}
              {...sliderProps}
            />
          </SliderWrapper>

          <MaxValueWrapper $readMode={readMode}>
            <Typography.Text variant="body-4-2" color="var(--color-gray-05)">
              {max}
            </Typography.Text>
          </MaxValueWrapper>

          {!readMode && (
            <>
              <Divider />

              <IconWrapper
                aria-label="값 증가"
                onClick={handleIncrease}
                disabled={
                  disabled ||
                  readOnly ||
                  (currentValue ?? 0) >= (max ?? Number.POSITIVE_INFINITY)
                }
                tabIndex={0}
              >
                <Icon name="Plus" color="#000" size={16} />
              </IconWrapper>
            </>
          )}
        </SliderContainer>

        {showInput && (
          <CenteredInputNumber
            value={currentValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled || readMode}
            readOnly={readOnly}
            onChange={readMode ? undefined : handleInputChange}
            aria-label={ariaLabel || "숫자 입력"}
            aria-describedby={ariaDescribedBy}
            width="6rem"
            height="3rem"
            customUnit={SLIDER_COLOR_CONFIG[type].unit}
            {...inputProps}
          />
        )}
      </SliderMainContainer>
    </ConfigProvider>
  );
};

const SliderMainContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const SliderContainer = styled.div<{ $readMode: boolean }>`
  display: flex;
  align-items: center;
  height: 3rem;
  gap: 0.2rem;
  border-radius: 0.2rem;
  border: 0.1rem solid var(--color-gray-10);
  background: var(--color-gray-17);
  flex: 1;
`;

const SliderWrapper = styled.div<{ $readMode: boolean }>`
  flex: 1;
  margin: 0rem 0.7rem;
  pointer-events: ${({ $readMode }) => ($readMode ? "none" : "auto")};
`;

const IconWrapper = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled }) =>
    disabled ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.88)"};
  transition: all 0.2s ease;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: var(--color-gray-10);
`;

const MaxValueWrapper = styled.div<{ $readMode: boolean }>`
  display: flex;
  align-items: center;
  margin-right: ${({ $readMode }) => ($readMode ? "0.9rem" : "0.5rem")};
`;

const CenteredInputNumber = styled(InputNumber)`
  input {
    text-align: center !important;
  }
`;
