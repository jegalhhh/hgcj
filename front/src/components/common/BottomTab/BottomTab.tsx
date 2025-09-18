import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import * as S from "./BottomTab.styles";
import map from "../../../assets/images/icon/map.png";
import donation from "../../../assets/images/icon/donation.png";
import mypage from "../../../assets/images/icon/mypage.png";
import mapActive from "../../../assets/images/icon/map_active.png";
import donationActive from "../../../assets/images/icon/donation_active.png";
import mypageActive from "../../../assets/images/icon/mypage_active.png";
import IconButton from "../../button/IconButton";

type Tab = {
  to: string;
  img: string;
  activeImage: string;
  label: string;
  disabled?: boolean;
  iconSize?: number;
};

const TABS: Tab[] = [
  {
    to: "/map",
    img: map,
    activeImage: mapActive,
    label: "지도",
    disabled: true,
    iconSize: 22,
  },
  {
    to: "/donation",
    img: donation,
    activeImage: donationActive,
    label: "기부",
  },
  { to: "/mypage", img: mypage, activeImage: mypageActive, label: "마이" },
];

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();

  const handleClick = (tab: Tab) => {
    if (tab.disabled) {
      window.alert("개발 중인 기능입니다.");
      return;
    }
    
    // 비회원이 마이페이지 접근 시 제한
    if (tab.to === "/mypage" && authState.isGuest) {
      window.alert("마이페이지는 회원만 이용 가능합니다. 회원가입 후 이용해주세요.");
      navigate("/");
      return;
    }
    
    navigate(tab.to);
  };

  return (
    <S.TabWrapper role="navigation" aria-label="하단 탭">
      {TABS.map((tab) => {
        const isActive = location.pathname.startsWith(tab.to);

        return (
          <S.TabButton
            key={tab.to}
            type="button"
            onClick={() => handleClick(tab)}
            aria-disabled={tab.disabled}
          >
            <S.Icon $active={isActive}>
              <IconButton
                icon={isActive ? tab.activeImage : tab.img}
                size={tab.iconSize ?? 33}
              />
            </S.Icon>
            <S.Label $active={isActive}>{tab.label}</S.Label>
          </S.TabButton>
        );
      })}
    </S.TabWrapper>
  );
};

export default BottomTab;
