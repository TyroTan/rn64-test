import { useEffect, useState } from "react";
import { useBuyerStore, useUserStore } from "stores";
import globalObjectLastActionState from "utils/global-object-last-action";

const useUserStoreRefreshableInitialStoreStates = () => {
  const {
    response,
    isLoading: { user: isLoadingUser },
    setStartingStates,
    refreshUserStore,
  } = useUserStore();
  const { setterBuyerInitialStoreState } = useBuyerStore();
  // setterBuyerInitialStoreState(response.initialStoreStates);

  const [refreshing, isRefreshing] = useState(false);
  const [resfreshedResponse, setRefreshedResponse] = useState({ ...response });

  const refreshInitialStoreStates = async () => {
    isRefreshing(true);

    try {
      const ddd = globalObjectLastActionState.get();
      console.log("batd dataaa", ddd);
      // debug;
      await setStartingStates("shouldnt");

      // invoking refreshUserStore() gets the real latest state that was recently set during setStartingStates()
      const responseLatest = refreshUserStore().response;
      setRefreshedResponse(responseLatest);

      // parallelly set initialStoreStates to actual state owner (merchantStore) too
      setterBuyerInitialStoreState(responseLatest.initialStoreStates);
    } catch (e: any) {
      e; // noop
    } finally {
      isRefreshing(false);
    }
  };

  const refreshingInitialStoreStates = isLoadingUser || refreshing;

  return {
    response: resfreshedResponse,
    refreshInitialStoreStates,
    refreshingInitialStoreStates,
    setterBuyerInitialStoreState,
  };
};

export default useUserStoreRefreshableInitialStoreStates;
