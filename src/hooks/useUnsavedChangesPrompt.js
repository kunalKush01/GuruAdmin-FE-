import { useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export const useUnsavedChangesPrompt = (when) => {
  const navigator = React.useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const unblock = navigator.block((tx) => {
      if (when) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (confirmLeave) {
          unblock();
          tx.retry();
        }
      }
    });

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unblock();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, navigator]);
};
