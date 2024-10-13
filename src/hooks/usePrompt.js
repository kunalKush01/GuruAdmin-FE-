// src/hooks/usePrompt.js
import { useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { useContext } from "react";

function useBlocker(blocker, when) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

function usePrompt(message, when) {
  useBlocker((tx) => {
    if (window.confirm(message)) {
      tx.retry();
    }
  }, when);
}

export default usePrompt;
