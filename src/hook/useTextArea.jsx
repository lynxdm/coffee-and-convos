import { useEffect } from "react";

function useTextArea(textarea, content) {
  useEffect(() => {
    textarea.current.style.height = "0px";
    const scrollHeight = textarea.current.scrollHeight;
    textarea.current.style.height = scrollHeight + "px";
  }, [textarea, content]);
}

export default useTextArea;
