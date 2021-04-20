import styled from "styled-components";
import { useContext } from "react";
import { ReactComponent as ParagraphIcon } from "bootstrap-icons/icons/text-paragraph.svg";

import { SlidesContext } from "../../../context/slides";

import StyledButton from "../StyledButton";

const Container = styled.div`
  display: inline-block;
`;

function Paragraph() {
  const { currentSlide, addElement } = useContext(SlidesContext);

  return (
    <Container>
      <StyledButton
        title="Paragraph"
        onClick={() =>
          addElement(currentSlide, {
            id: new Date().getTime(),
            type: "paragraph",
            value:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          })
        }
      >
        <ParagraphIcon />
      </StyledButton>
    </Container>
  );
}

export default Paragraph;
