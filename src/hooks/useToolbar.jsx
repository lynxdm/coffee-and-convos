import React from "react";
import { useMemo } from "react";

function UseToolbar(textref, setArticleDraft, articleDraft) {
  //   const textarea = textref.current;
  const content = articleDraft.content;

  const undo = (length, newline = false, underline = false) => {
    const startPos = textref.current.selectionStart;
    const endPos = textref.current.selectionEnd;

    if (newline) {
      const newText = `${content.substring(0, startPos - length)}${content.substring(startPos, endPos)}${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });
    } else {
      if (underline) {
        const newText = `${content.substring(0, startPos - 3)}${content.substring(startPos, endPos)}${content.substring(endPos + 4)}`;
        setArticleDraft({ ...articleDraft, content: newText });
      } else {
        const newText = `${content.substring(0, startPos - length)}${content.substring(startPos, endPos)}${content.substring(endPos + length)}`;
        setArticleDraft({ ...articleDraft, content: newText });
      }
    }

    const timeoutId = setTimeout(() => {
      textref.current.focus();
      textref.current.setSelectionRange(startPos - length, endPos - length);
      clearTimeout(timeoutId);
    }, 0);
  };

  const runInlineBtnAction = (char) => {
    const startPos = textref.current.selectionStart;
    const endPos = textref.current.selectionEnd;
    const length = char.length;

    if (
      content.substring(startPos - length, startPos) === char &&
      content.substring(endPos, endPos + length) === char
    ) {
      undo(length);
    } else {
      const newText = `${content.substring(0, startPos)}${char}${content.substring(startPos, endPos)}${char}${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      const timeoutId = setTimeout(() => {
        textref.current.focus();
        textref.current.setSelectionRange(startPos + length, endPos + length);
        clearTimeout(timeoutId);
      }, 0);
    }
  };

  const runNewLineBtnAction = (char) => {
    const startPos = textref.current.selectionStart;
    const endPos = textref.current.selectionEnd;
    const length = char.length;

    if (content.substring(startPos - length, startPos) === char) {
      undo(length, true);
    } else {
      if (startPos === 0 || content[startPos - 1] === "\n") {
        const newText = `${content.substring(0, startPos)}${char}${content.substring(startPos, endPos)}${content.substring(endPos)}`;
        setArticleDraft({ ...articleDraft, content: newText });

        const timeoutId = setTimeout(() => {
          textref.current.focus();
          textref.current.setSelectionRange(startPos + length, endPos + length);
          clearTimeout(timeoutId);
        }, 0);
      } else {
        const newText = `${content.substring(0, startPos)}\n${char}${content.substring(startPos, endPos)}${content.substring(endPos)}`;
        setArticleDraft({ ...articleDraft, content: newText });

        const timeoutId = setTimeout(() => {
          textref.current.focus();
          textref.current.setSelectionRange(
            startPos + (length + 1),
            endPos + (length + 1),
          );
          clearTimeout(timeoutId);
        }, 0);
      }
    }
  };

  const handleBold = () => {
    runInlineBtnAction("**");
  };

  const handleItalic = () => {
    runInlineBtnAction("_");
  };

  const handleStrikethrough = () => {
    runInlineBtnAction("~~");
  };

  const handleOrderedList = () => {
    runNewLineBtnAction("1. ");
  };

  const handleUnOrderedList = () => {
    runNewLineBtnAction("- ");
  };

  const handleQuote = () => {
    runNewLineBtnAction("> ");
  };

  const handleUnderline = () => {
    const startPos = textref.current.selectionStart;
    const endPos = textref.current.selectionEnd;

    if (
      content.substring(startPos - 3, startPos) === "<u>" &&
      content.substring(endPos, endPos + 4) === "</u>"
    ) {
      undo(3, false, true);
    } else {
      const newText = `${content.substring(0, startPos)}<u>${content.substring(startPos, endPos)}</u>${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      const timeoutId = setTimeout(() => {
        textref.current.focus();
        textref.current.setSelectionRange(startPos + 3, endPos + 3);
        clearTimeout(timeoutId);
      }, 0);
    }
  };

  const handleHeadings = (char) => {
    runNewLineBtnAction(`${char} `);
  };

  const handleLinking = () => {
    const startPos = textref.current.selectionStart;
    const endPos = textref.current.selectionEnd;
    let selectedText = content.substring(startPos, endPos);
    let length = selectedText.length;

    if (
      content.substring(
        textref.current.selectionStart,
        textref.current.selectionEnd,
      ) === "url"
    ) {
      const prevTextArr = content.substring(0, startPos - 2).split("[");

      const originalText = prevTextArr[prevTextArr.length - 1];

      const newText = `${content.substring(0, startPos - (originalText.length + 3))}${originalText}${content.substring(endPos + 1)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      const timeoutId = setTimeout(() => {
        textref.current.focus();
        textref.current.setSelectionRange(
          startPos - (originalText.length + 3),
          endPos - 6,
        );
        clearTimeout(timeoutId);
      }, 0);
    } else {
      const newText = `${content.substring(0, startPos)}[${selectedText}](url)${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      const timeoutId = setTimeout(() => {
        textref.current.focus();
        textref.current.setSelectionRange(startPos + (length + 3), endPos + 6);
        clearTimeout(timeoutId);
      }, 0);
    }
  };

  const handleAddImage = (loading, url, startPos, endPos) => {
    if (loading) {
      const newText = `${content.substring(0, startPos)}\n![Uploading](...)${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });
      return;
    }

    if (startPos === 0 || content[startPos - 1] === "\n") {
      const newText = `${content.substring(0, startPos)}![Image alt description](${url})${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });
    } else {
      const newText = `${content.substring(0, startPos)}\n![Image alt description](${url})${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });
    }
    textref.current.focus();
  };

  return {
    handleBold,
    handleItalic,
    handleStrikethrough,
    handleOrderedList,
    handleUnderline,
    handleLinking,
    handleQuote,
    handleUnOrderedList,
    handleAddImage,
    handleHeadings,
  };
}
export default UseToolbar;
