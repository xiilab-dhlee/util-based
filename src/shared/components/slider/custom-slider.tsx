import { Slider as AntdSlider, ConfigProvider } from "antd";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Icon, InputNumber, Typography } from "xiilab-ui";

import { getResourceInfo } from "@/shared/utils/resource.util";
import type { SliderProps } from "./types";
import { DEFAULT_SLIDER_CONFIG } from "./types";

const MIN_EDGE_POSITION = 8;
const MAX_EDGE_POSITION = 92;

const getMarkPosition = (value: number, min: number, max: number): number => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;

  if (safeMax <= safeMin) {
    return 0;
  }

  const clampedValue = Math.min(Math.max(value, safeMin), safeMax);
  return ((clampedValue - safeMin) / (safeMax - safeMin)) * 100;
};

const getMarkTransform = (position: number): string => {
  if (position <= MIN_EDGE_POSITION) {
    return "translateX(0)";
  }

  if (position >= MAX_EDGE_POSITION) {
    return "translateX(-100%)";
  }

  return "translateX(-50%)";
};

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
  type = "GPU",
  marks,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  sliderProps,
  inputProps,
  showInput = true,
  error = false,
}: SliderProps) => {
  const currentValue = value ?? defaultValue;

  // 리소스 타입에 따른 색상/단위 정보
  const resourceInfo = useMemo(() => {
    const safeType = type ?? "GPU";
    return getResourceInfo(safeType);
  }, [type]);

  // 리소스 색상에 따른 ConfigProvider 테마 생성
  const sliderTheme = useMemo(() => {
    const color = resourceInfo.color;
    return {
      components: {
        Slider: {
          // 기본 색상들
          colorPrimary: color,
          colorPrimaryBorder: color,
          colorPrimaryHover: color,

          // 핸들 관련 색상들 (readMode일 때는 투명하게)
          handleColor: readMode ? "transparent" : color,
          handleActiveColor: readMode ? "transparent" : color,
          handleActiveOutlineColor: readMode ? "transparent" : `${color}30`,

          // 핸들 호버 상태 색상들 (readMode일 때는 투명하게)
          handleColorHover: readMode ? "transparent" : color,
          handleColorFocus: readMode ? "transparent" : color,

          // 포커스 상태 (readMode일 때는 투명하게)
          colorFocusOutline: readMode ? "transparent" : `${color}40`,
          colorFocus: readMode ? "transparent" : color,

          // 핸들 크기 (readMode일 때는 0으로)
          handleSize: readMode ? 0 : 12,
          handleSizeHover: readMode ? 0 : 13,

          // 트랙 색상
          trackBg: color,
          trackHoverBg: color,

          // 레일 색상
          railBg: "var(--color-gray-10)",
          railHoverBg: "var(--color-gray-10)",
        },
      },
    };
  }, [resourceInfo, readMode]);

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
              >
                <Icon name="Minus" color="#000" size={12} />
              </IconWrapper>

              <Divider />
            </>
          )}

          <SliderWrapper $readMode={readMode}>
            <SliderTrackContainer>
              <AntdSlider
                value={currentValue}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                onChange={
                  readMode
                    ? undefined
                    : (val) => {
                        const nextValue = Array.isArray(val)
                          ? val[val.length - 1]
                          : val;

                        if (typeof nextValue === "number") {
                          handleSliderChange(nextValue);
                        }
                      }
                }
                aria-label={ariaLabel}
                styles={sliderStyles}
                {...sliderProps}
              />
              {marks && marks.length > 0 && (
                <MarksContainer>
                  {marks.map((mark, index) => {
                    const position = getMarkPosition(
                      mark.value,
                      min ?? 0,
                      max ?? 100,
                    );
                    const transform = getMarkTransform(position);

                    // 첫 번째 마크(기존 할당량), 두 번째 마크(요청량)
                    const isRequest = index !== 0;
                    return (
                      <MarkItem
                        key={`mark-${mark.value}`}
                        style={{
                          left: `${position}%`,
                          transform: `${transform} translateY(-50%)`,
                        }}
                      >
                        <MarkDot $isRequest={isRequest} />
                        <MarkLabel $isRequest={isRequest}>
                          {mark.label}
                        </MarkLabel>
                      </MarkItem>
                    );
                  })}
                </MarksContainer>
              )}
            </SliderTrackContainer>
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
            customUnit={resourceInfo.unit}
            status={error ? "error" : undefined}
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

const SliderTrackContainer = styled.div`
  position: relative;
  width: 100%;
`;

const MarksContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
`;

const MarkItem = styled.div`
  position: absolute;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkDot = styled.div<{ $isRequest?: boolean }>`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background-color: ${({ $isRequest }) => ($isRequest ? "#F2F7FF" : "#fff")};
  border: 1px solid ${({ $isRequest }) => ($isRequest ? "#BFD3FF" : "#E0E0E0")};
`;

const MarkLabel = styled.div<{ $isRequest?: boolean }>`
  position: absolute;
  top: -2.2rem;
  padding: 0.2rem 0.6rem;
  background-color: ${({ $isRequest }) => ($isRequest ? "#F2F7FF" : "#fff")};
  color: ${({ $isRequest }) => ($isRequest ? "#003BC5" : "#404040")};
  border: 1px solid ${({ $isRequest }) => ($isRequest ? "#BFD3FF" : "#E0E0E0")};
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 0.4rem;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid ${({ $isRequest }) => ($isRequest ? "#BFD3FF" : "#E0E0E0")};
  }

  &::before {
    content: "";
    position: absolute;
    bottom: -0.35rem;
    left: 50%;
    transform: translateX(-50%);
    border-left: 0.4rem solid transparent;
    border-right: 0.4rem solid transparent;
    border-top: 0.4rem solid ${({ $isRequest }) => ($isRequest ? "#F2F7FF" : "#fff")};
    z-index: 1;
  }
`;
