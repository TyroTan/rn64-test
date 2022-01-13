import { useEffect, useState } from "react";

export const useExtraDelay = (loading: boolean, delay: number = 0.7) => {
  const [start, setStart] = useState(false);
  const [delayDone, setDelayDone] = useState(true);

  useEffect(() => {
    if (loading === true && start === false) {
      setStart(true);
    }
  }, [loading]);

  useEffect(() => {
    const startDelay = () => {
      setTimeout(() => {
        setDelayDone(true);
      }, delay);
    };

    if (start === true) {
      setStart(false);
      setDelayDone(false);
      startDelay();
    }
  }, [start, setDelayDone, setStart]);

  return {
    loading: !delayDone || loading,
  };
};
