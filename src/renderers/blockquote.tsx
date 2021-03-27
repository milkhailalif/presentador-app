import styled from "styled-components";

import { colours } from "../theme";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${colours.lightText};

  .top {
  }

  .bottom {
  }
`;

export default function TwoHeaders({ children }: { children: JSX.Element[] }) {
  const blockquote = children.find(
    (item) => item.type.displayName === "Blockquote"
  );

  if (!blockquote) {
    return <></>;
  }

  return (
    <Container>
      <div className="top">{blockquote}</div>
      <div className="bottom"></div>
    </Container>
  );
}
