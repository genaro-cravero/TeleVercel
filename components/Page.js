import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import Head from "next/head";
import Header from "./Header";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    --red: #ff0000;
    --black: #393939;
    --grey: #3A3A3A;
    --gray: var(--grey);
    --lightGrey: #e1e1e1;
    --lightGray: var(--lightGrey);
    --offWhite: #ededed;
    --maxWidth: 1500px;
    --bs: 0 12px 24px 0 rgba(0,0,0,0.09);
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-family: 'Quicksand-Bold', --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height:2;
  }
  a {
    text-decoration: none;
    color: var(--black);
  }
  a:hover {
    text-decoration: underline;
  }
  button {
    font-family: 'Quicksand', --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const InnerStyles = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 2rem;
`;

export default function Page({ children, cool }) {
  return (
    <div>
      <GlobalStyles />
      <Head>
        <title>DOC24</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Header />
       {/* {noMostrar && <Header />} */}
      <InnerStyles>{children}</InnerStyles>
    </div>
  );
}

Page.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};