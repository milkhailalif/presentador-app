import React, { useCallback, useRef, useState, useContext } from "react";
import styled from "styled-components";
import sanitizeHtml from "sanitize-html";
import { ReactComponent as TrashIcon } from "bootstrap-icons/icons/trash.svg";
import { ReactComponent as ClearFormattingIcon } from "bootstrap-icons/icons/x.svg";

import EditableToolbar from "../EditableToolbar";

import { ActionsButton, ButtonsBar } from "../ActionsButton";
import useClickOutside from "./hooks/clickOutside";
import { SlidesContext } from "../../../context/slides";
import { Element } from "../../../types";
import { HistoryContext } from "../../../context/history";

const Container = styled.div`
  position: relative;
  flex: 1;

  text-align: center;

  &:last-child {
    text-align: right;
  }
  &:first-child {
    text-align: left;
  }
`;

const StyledFooterItem = styled.div<{ selected: boolean }>`
  font-size: 0.9em;
  line-height: 1.4em;
  padding: 0.5em;
  border: 2px solid
    ${({ selected }) => (selected ? "#15aabf" : "rgba(0, 0, 0, 0)")};
  color: ${({ theme }) => theme.colours.secondaryNormalText};

  .bold {
    font-weight: bold;
  }
  .italic {
    font-style: italic;
  }
`;

function FooterItem({
  slideNumber,
  item,
  present,
}: {
  present: boolean;
  slideNumber: number;
  item: Element;
}) {
  const [selected, setSelected] = useState(false);
  const editingElement = useRef<HTMLDivElement | null>(null);

  const { addElement, removeElement, changeElementValue } = useContext(
    SlidesContext
  );
  const { addAction } = useContext(HistoryContext);

  const { clickContainer } = useClickOutside(() => {
    if (selected) {
      finishEditing();
    }
  });

  function editHeading() {
    if (editingElement.current) {
      if (editingElement.current.getAttribute("contenteditable") !== "true") {
        editingElement.current.setAttribute("contenteditable", "true");
        editingElement.current.focus();
      }
    }
  }

  const finishEditing = useCallback(() => {
    if (editingElement.current) {
      editingElement.current.setAttribute("contenteditable", "false");
      setSelected(false);
      if (editingElement.current.innerHTML === "") {
        addAction(
          () => removeElement(slideNumber, item.id),
          () => addElement(slideNumber, item)
        );
      } else if (editingElement.current.innerHTML !== item.value) {
        addAction(
          () =>
            editingElement.current &&
            changeElementValue(
              slideNumber,
              item.id,
              editingElement.current.innerHTML
            ),
          () => changeElementValue(slideNumber, item.id, item.value)
        );
      }
    }
  }, [
    editingElement,
    setSelected,
    removeElement,
    addElement,
    addAction,
    changeElementValue,
    item,
    slideNumber,
  ]);

  function checkMouseDown(event: React.KeyboardEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (event.code === "Enter") {
      event.preventDefault();
      finishEditing();
    }
  }

  function remove() {
    addAction(
      () => removeElement(slideNumber, item.id),
      () => addElement(slideNumber, item)
    );
  }

  function select() {
    if (!present && !selected) {
      setSelected(true);
      editHeading();
    }
  }

  return (
    <Container
      ref={clickContainer}
      tabIndex={0}
      onFocus={select}
      onBlur={(event) => {
        if (
          !event.relatedTarget ||
          !event.currentTarget.contains(event.relatedTarget as Node)
        ) {
          finishEditing();
        }
      }}
    >
      {selected && <EditableToolbar ref={editingElement} />}
      <StyledFooterItem
        selected={selected}
        onKeyDown={checkMouseDown}
        ref={editingElement}
        onMouseDown={() => {
          if (!present) {
            setSelected(true);
            editHeading();
          }
        }}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(item.value, {
            allowedTags: ["span", "a"],
            allowedAttributes: { a: ["href"], span: ["class"] },
          }),
        }}
      />
      {selected && (
        <ButtonsBar>
          <ActionsButton
            data-tooltip="Clear formatting"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (editingElement.current) {
                const div = document.createElement("div");
                div.innerHTML = editingElement.current.innerHTML;
                editingElement.current.innerHTML = div.textContent as string;
              }
            }}
          >
            <ClearFormattingIcon />
          </ActionsButton>
          <ActionsButton data-tooltip="Remove" onClick={remove}>
            <TrashIcon />
          </ActionsButton>
        </ButtonsBar>
      )}
    </Container>
  );
}

FooterItem.displayName = "FooterItem";

export default FooterItem;
