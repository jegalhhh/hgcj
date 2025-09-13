import { useNavigate } from "react-router-dom";
import * as S from "./BottomTab.styles";
import map from "../../../assets/images/icon/map.png";
import donation from "../../../assets/images/icon/donation.png";
import mypage from "../../../assets/images/icon/mypage.png";

type Tab = {
  to: string;
  img: string;
  label: string;
  disabled?: boolean;
};

const TABS: Tab[] = [
  { to: "/map", img: map, label: "지도", disabled: true },
  { to: "/donation", img: donation, label: "기부" },
  { to: "/mypage", img: mypage, label: "마이" },
];

const BottomTab = () => {
  const navigate = useNavigate();

  const handleClick = (tab: Tab) => {
    if (tab.disabled) {
      window.alert("해당 기능은 개발 중입니다.");
      return;
    }
    navigate(tab.to);
  };

  return (
    <S.TabWrapper role="navigation" aria-label="하단 탭">
      {TABS.map((tab) => {
        return (
          <S.TabButton
            key={tab.to}
            type="button"
            onClick={() => handleClick(tab)}
            disabled={tab.disabled}
          >
            <S.Icon src={tab.img} alt={tab.label} />
            <S.Label>{tab.label}</S.Label>
          </S.TabButton>
        );
      })}
    </S.TabWrapper>
  );
};

export default BottomTab;
