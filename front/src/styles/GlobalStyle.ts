import { createGlobalStyle } from "styled-components";
import { colors } from "./colors";

export const GlobalStyle = createGlobalStyle`
    @font-face {
    font-family: 'Pretendard';
    font-weight: 100;
    src: url('/fonts/Pretendard-Thin.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 200;
    src: url('/fonts/Pretendard-ExtraLight.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 300;
    src: url('/fonts/Pretendard-Light.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 400;
    src: url('/fonts/Pretendard-Regular.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 500;
    src: url('/fonts/Pretendard-Medium.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 600;
    src: url('/fonts/Pretendard-SemiBold.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 700;
    src: url('/fonts/Pretendard-Bold.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 800;
    src: url('/fonts/Pretendard-ExtraBold.ttf') format('truetype');
    font-display: swap;
    }

    @font-face {
    font-family: 'Pretendard';
    font-weight: 900;
    src: url('/fonts/Pretendard-Black.ttf') format('truetype');
    font-display: swap;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body, #root {
        height: 100%;
    }

    html {
        -webkit-text-size-adjust: 100%;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    body {
        margin: 0;
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        line-height: 1.5;
        background: #fff;
        font-weight: 600;
    }

    .app {
        min-height: calc(var(--vh, 1vh) * 100);
        display: flex;
        justify-content: center;
        background: ${colors.cream};
        color: ${colors.gray8};
        width: 100%;
        max-width: 420px;
        margin: 0 auto;

    }

    .container {
        --gutter: 24px;
        --padTop: 42px;
        --padBottom: 44px;
        --design-h: 912;
        --scale: 1;
        padding: var(--padTop) var(--gutter) var(--padBottom);
        width: 100%;
    }

    @support (padding-top: env(safe-area-inset-top)) {
        .container {
            --padTop: calc(env(safe-area-inset-top) + 16px);
            --padBottom: calc(env(safe-area-inset-top) + 16px);
        }
    }
`;
