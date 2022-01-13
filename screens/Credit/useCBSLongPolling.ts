import { useEffect, useRef, useState } from "react";
import { getCredit } from "services";
import { getKycsObject } from "utils/utils-common";
import { awaitableDelay } from "utils/js-utils";

export type Outcome =
  | null
  | "no-increase"
  | "increased"
  | "data_error"
  | "timed-out";

const useCBSLongPolling = (
  loopBreakPoint: number,
  errors: any,
  countryCode: string,
  previousCredit: any,
  execute: boolean = false
) => {
  const refLoopLimit = useRef(0);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const onPolling = async () => {
    try {
      refLoopLimit.current = (refLoopLimit?.current ?? 0) + 1;
      if (refLoopLimit.current > loopBreakPoint) {
        setOutcome("timed-out");
        return;
      }

      const result = await getCredit(countryCode);
      const { data: newerCredit } = result ?? {};

      if (newerCredit?.assessment) {
        if (
          previousCredit?.completedAt &&
          // toISOString() -> string comparison '2021-11-18T03:04:31.390Z'
          newerCredit.assessment?.completed_at > previousCredit.completedAt
        ) {
          const hasCreditIncreased =
            newerCredit?.amount > previousCredit.amount;

          if (hasCreditIncreased) {
            // end
            setOutcome("increased");
            return;
          } else {
            // end
            setOutcome("no-increase");
            return;
          }
        }
      }

      if (newerCredit?.kycs) {
        const kycsObject = getKycsObject(newerCredit);
        kycsObject;
        if (kycsObject.sg_credit_bureau_report === "data_error") {
          // end
          setOutcome("data_error");
          return;
        }
      }

      console.log("polling again after 3000ms", errors, execute);
      if (!errors) {
        await awaitableDelay(3000);
        onPolling();
      }
    } catch (e) {
      console.log("err", e);
      setOutcome("data_error");
    }
  };

  // *Effects
  useEffect(() => {
    if (execute) {
      // process long polling

      onPolling();
    }
  }, [execute, onPolling]);

  return {
    outcomeData: outcome,
    reset: () => {
      setOutcome(null);
    },
  } as { outcomeData: Outcome; reset: () => void };
};

export default useCBSLongPolling;
