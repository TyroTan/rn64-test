import React, { useCallback, useEffect } from "react";
import { useBuyerStore, useUserStore } from "stores";
import type { UserSession } from "stores/useUserStore";

interface UseLoginReturn {
  showSplash: boolean;
  user: UserSession;
  isAuthed: boolean;
  landingToScreen: UserSession["landingToScreen"];
  setLoginShowSplash: (props: any) => void;
}

const useLogin = (): UseLoginReturn => {
  const {
    response: { user: userResponse },
    setLoginShowSplash,
    isLoading,
  } = useUserStore();
  const { showSplash } = isLoading ?? {};
  const { authToken, landingToScreen } = userResponse ?? {};
  const { email } = userResponse?.data ?? {};

  // populate user info async storage and states
  const asyncEffectAuth = useCallback(async () => {
    if (!showSplash) {
      setLoginShowSplash();
    }
  }, [showSplash, authToken, email]);

  // *Effects
  useEffect(() => {
    asyncEffectAuth();
  }, [authToken]);

  return {
    showSplash,
    setLoginShowSplash,
    user: userResponse,
    isAuthed: authToken ? true : false,
    landingToScreen,
  };
};

export default useLogin;
