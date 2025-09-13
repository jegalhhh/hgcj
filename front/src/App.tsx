import { Route, Routes } from "react-router-dom";
import useViewportHeight from "./hooks/useViewportHeight";
import { GlobalStyle } from "./styles/GlobalStyle.ts";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import Onboarding from "./pages/onboarding/Onboarding.tsx";
import DonationHome from "./pages/donation/DonationHome.tsx";
import DonationCertify from "./pages/donation/DonationCertify.tsx";
import DonorHall from "./pages/donation/DonorHall.tsx";
import MyPageHome from "./pages/mypage/MyPageHome.tsx";
import MyDonationHistory from "./pages/mypage/MyDonationHistory.tsx";
import MyStamp from "./pages/mypage/MyStamp.tsx";
import MyInfo from "./pages/mypage/MyInfo.tsx";

function App() {
  useViewportHeight();

  return (
    <>
      <GlobalStyle />
      <div className="app">
        <main className="container">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            <Route path="/donation" element={<DonationHome />} />
            <Route path="/donation/certify" element={<DonationCertify />} />
            <Route path="/donation/hall" element={<DonorHall />} />

            <Route path="/mypage" element={<MyPageHome />} />
            <Route path="/mypage/history" element={<MyDonationHistory />} />
            <Route path="/mypage/stamp" element={<MyStamp />} />
            <Route path="/mypage/info" element={<MyInfo />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
