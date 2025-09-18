import { Route, Routes } from "react-router-dom";
import useViewportHeight from "./hooks/useViewportHeight";
import { GlobalStyle } from "./styles/GlobalStyle.ts";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import Onboarding from "./pages/onboarding/Onboarding.tsx";
import DonationHome from "./pages/donation/DonationHome.tsx";
import DonationCertify from "./pages/donation/DonationCertify.tsx";
import DonorHall from "./pages/donation/DonorHall.tsx";
import MyPageHome from "./pages/mypage/MyPageHome.tsx";
import MyDonationHistory from "./pages/mypage/MyDonationHistory.tsx";
import MyStamp from "./pages/mypage/MyStamp.tsx";

function App() {
  useViewportHeight();

  return (
    <>
      <GlobalStyle />
      <AuthProvider>
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
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
