import type { CheckboxChangeEvent } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Checkbox, Icon, Input } from "xiilab-ui";

import { useGetWorkspaces } from "@/domain/workspace/hooks/use-get-workspaces";
import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";
import { ActiveOutsideClick } from "@/shared/components/active-outside-click";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { ArrowIcon } from "@/shared/components/icon/arrow-icon";
import { openCreateWorkspaceModalAtom } from "@/shared/hooks/modal.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function WorkspaceSelect() {
  const [isOpen, setIsOpen] = useState(false);

  const { onOpen } = useGlobalModal(openCreateWorkspaceModalAtom);
  // 선택된 워크스페이스
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceListType | null>(null);
  // 나의 워크스페이스 체크 여부
  const [isMyWorkspaceChecked, setIsMyWorkspaceChecked] = useState(false);

  const { data } = useGetWorkspaces({
    page: 1,
    size: 100,
    isMyWorkspace: isMyWorkspaceChecked,
    searchText: "",
  });

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOption = (workspace: WorkspaceListType) => {
    setSelectedWorkspace(workspace);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSearch = () => {};

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    onOpen();
  };

  const handleChangeMyWorkspace = (e: CheckboxChangeEvent) => {
    setIsMyWorkspaceChecked(e.target.checked);
  };

  useEffect(() => {
    if (data?.content) {
      setSelectedWorkspace(data.content[0]);
    }
  }, [data]);

  return (
    <ActiveOutsideClick onClick={handleClose}>
      <Container>
        <ActiveOption onClick={handleToggle}>
          {selectedWorkspace ? (
            <>
              <Badge>Default</Badge>
              <ValueWrapper>
                <Value className="truncate">{selectedWorkspace?.name}</Value>
              </ValueWrapper>
            </>
          ) : (
            <Placeholder>Select Workspace</Placeholder>
          )}
          <IconWrapper className={isOpen ? "open" : ""}>
            <ArrowIcon />
          </IconWrapper>
        </ActiveOption>
        {isOpen && (
          <Overlay>
            <OverlayBody>
              <Input.Search
                placeholder="워크스페이스 검색"
                onSearch={handleSearch}
                autoComplete="off"
                width={188}
                height={32}
                darkMode={true}
              />
              <Menu>
                {data?.content?.map((workspace: WorkspaceListType) => (
                  <Option
                    key={workspace.id}
                    className={classNames({
                      active: selectedWorkspace?.id === workspace.id,
                    })}
                    onClick={() => handleClickOption(workspace)}
                  >
                    <span>{workspace.name}</span>
                    <span>
                      <Icon name="PinFilled" size={20} color="#fff" />
                    </span>
                  </Option>
                ))}
              </Menu>
            </OverlayBody>
            <Footer>
              <FooterLeft>
                <Checkbox
                  id="my-workspace"
                  size="small"
                  darkMode
                  checked={isMyWorkspaceChecked}
                  onChange={handleChangeMyWorkspace}
                />
                <CheckboxLabel htmlFor="my-workspace">
                  나의 워크스페이스
                </CheckboxLabel>
              </FooterLeft>
              <div>
                <CreateModelButton
                  className="dark"
                  onClick={handleCreateWorkspace}
                  title="생성"
                />
              </div>
            </Footer>
          </Overlay>
        )}
      </Container>
    </ActiveOutsideClick>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 2px;
  outline: 1px solid #373a4c;
  padding: 5px;
`;

const ActiveOption = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 7px;
`;

const ValueWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  font-weight: 500;
  font-size: 1rem;
  color: #f5f5f5;
  overflow: hidden;
`;

const Value = styled.span``;

const Placeholder = styled(Value)`
  color: #808080;
`;

const Overlay = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 296px;
  background-color: #000;
  outline: 1px solid #373a4c;
  border-radius: 2px;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const OverlayBody = styled.div`
  padding: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Menu = styled.div`
  max-height: 210px;
  overflow-y: auto;

  ${customScrollbar("#515E80")}
`;

const Option = styled.div`
  width: 100%;
  height: 100%;
  color: #f5f5f5;
  height: 30px;
  display: flex;
  justify-content: space-between;
  gap: 7px;
  align-items: center;
  padding: 7px;
  padding-right: 0;
  font-weight: 400;
  border-radius: 2px;

  &:hover,
  &.active {
    background-color: #544ad8;
    font-weight: 600;
  }
`;

const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 4px 7px;
  background-color: #1c325e;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1.1rem;
  color: #f5f5f5;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #3f496e;
  width: 18px;
  height: 18px;
  background-color: #2d3041;

  --icon-fill: rgba(245, 245, 245, 0.9);

  &.open {
    transform: rotate(180deg);
  }
`;

const Footer = styled.div`
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #242b3c;
  padding: 8px;
`;

const FooterLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;

const CheckboxLabel = styled.label`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;

  color: #c6c6c7;
`;
