import styled from "styled-components";

import { Builder } from "../types";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5em;
`;

const ImageContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${({ theme }) => theme.colours.secondaryNormalText};
  background-color: ${({ theme }) => theme.colours.secondaryBackground};

  position: relative;
`;

export function ImageRenderer({ children }: { children: JSX.Element[] }) {
  const image = children.find((item) => item.type.displayName === "Image");

  if (!image) {
    return <></>;
  }

  return (
    <Container>
      <ImageContainer>{image}</ImageContainer>
    </Container>
  );
}

export const ImageBuilder: Builder = {
  add: (type) => {
    if (type === "heading") return "headerImage";
    if (type === "image") return "manyImages";
    return "normal";
  },
  remove: (type) => {
    return "normal";
  },
};
