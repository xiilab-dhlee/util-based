import classNames from "classnames";
import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { Icon } from "xiilab-ui";

import { ColumnIconWrap } from "../../../styles/layers/column-layer.styled";

interface ToggleTableRowProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  toggle: boolean;
  onToggle: () => void;
  togglePosition: "last" | "first";
}

export function ToggleTableRow({
  children,
  toggle,
  onToggle,
  togglePosition,
  ...restProps
}: ToggleTableRowProps) {
  const mapToChildren = Children.map(children, (child, index) => {
    let posCondition;
    if (togglePosition === "last") {
      posCondition = index === (children as any).length - 1;
    } else {
      posCondition = index === 0;
    }
    if (isValidElement(child) && posCondition) {
      const newProps = {
        children: (
          <ColumnIconWrap
            onClick={onToggle}
            className={classNames("hide-box", { rotate: toggle })}
          >
            <Icon name="Dropdown" color="#000" size={16} />
          </ColumnIconWrap>
        ),
      };

      return cloneElement(child as ReactElement<any>, newProps);
    }
    return child;
  });

  return <tr {...restProps}>{mapToChildren}</tr>;
}

