import styled from "styled-components";

const Title = styled.h3`
  margin: 1 0rem;
  margin-top: 0rem;

  text-align: center;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  a {
    background: Dodgerblue;
    display: inline;
    line-height: 1.3;
    font-size: 1.5rem;
    text-align: center;
    color: white;
    padding: 0 1rem;
  }
  button {
    background: Dodgerblue;
    padding: 1rem 1rem;
    font-size: 1rem;
  }
`;

export default Title;
