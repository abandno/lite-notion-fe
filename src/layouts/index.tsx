import { useSettings } from "@/store/settingStore";
import { ThemeMode } from "@/types/enum";
import styled from "styled-components";
import {Home} from "@/pages/Home"
import {Outlet} from "react-router-dom";

export const SimpleLayout = () => {
  const { themeLayout, themeMode } = useSettings();
  return (
    <StyleWrapper $themeMode={themeMode}>
      {/*<Home />*/}
      <Outlet />
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div<{ $themeMode?: ThemeMode }>`
  /* 设置滚动条的整体样式 */
  ::-webkit-scrollbar {
    width: 8px; /* 设置滚动条宽度 */
  }

  /* 设置滚动条轨道的样式 */
  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background: ${(props) =>
      props.$themeMode === ThemeMode.Dark ? "#2c2c2c" : "#FAFAFA"};
  }

  /* 设置滚动条滑块的样式 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${(props) =>
      props.$themeMode === ThemeMode.Dark ? "#6b6b6b" : "#C1C1C1"};
  }

  /* 设置鼠标悬停在滚动条上的样式 */
  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.$themeMode === ThemeMode.Dark ? "#939393" : "##7D7D7D"};
  }
`;
