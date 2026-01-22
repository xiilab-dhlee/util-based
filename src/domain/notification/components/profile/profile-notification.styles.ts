import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  min-height: 0; /* flex 자식이 부모 높이 제약을 받도록 */
  background-color: var(--profile-popover-child-bg-color);
  display: flex;
  flex-direction: column;

  --user-notification-border-color: rgba(81, 94, 128, 0.3);
`;

export const Header = styled.div`
  height: 38px;
  border-bottom: 1px solid var(--user-notification-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #fff;
`;

export const Body = styled.div`
  flex: 1;
  min-height: 0; /* flex 자식이 overflow 스크롤 가능하도록 */
  display: flex;
  flex-direction: column;
`;

export const Tab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TabPanel = styled.div`
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* flex 자식이 overflow 스크롤 가능하도록 */
`;

export const TabItem = styled.button`
  flex: 1;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #a3afd0;
  border-bottom: 1px solid #4a567c;
  position: relative;

  &.active {
    color: #e1e4e7;
    font-weight: 600;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #4a567c;
  }
`;

export const TabPanelHeader = styled.div`
  position: relative;
  z-index: 10;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--user-notification-border-color);
`;

export const Total = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  color: #dfdfe0;
`;

export const TabPanelBody = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0; /* flex 자식이 overflow 스크롤 가능하도록 */
`;

export const SentinelDiv = styled.div`
  height: 1px;
  width: 100%;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 100px;
`;
