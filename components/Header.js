import Link from "next/link";
import styled from "styled-components";
import { ResetVariables } from "./Detector";
import Nav from "./Nav";
import metadata from "../metadata.json";

const Logo = styled.h1`
  margin-left: 5rem;
  position: relative;
  z-index: 2;
`;

const HeaderStyles = styled.header`
  .bar {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background-color: #2C55FF;
    height: 100px;
  }

  .border-gradient {
    border: 10px solid;
    border-image-slice: 1;
    border-width: 5px;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <img src="https://doc24-dev-public.s3-us-west-2.amazonaws.com/resources/images/miniapp/doc24/logo.png" alt="DOC24 Logo"></img>
          <Link href="/"  >
            <a onClick={() => ResetVariables()}></a>
          </Link>
        </Logo>
        <Nav />
        <div style={{position: "absolute", right: "30px", top: "60px", color: "white", fontSize: "15px", fontFamily:'Quicksand'}}>{`v.${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`}</div>
      </div>
    </HeaderStyles>
  );
}
