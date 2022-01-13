import React from "react";

import { SuccessConfetti } from "components";

const ManualReviewSuccess: React.FC = (allProps: any) => {
  const { navigation } = allProps;

  const onReturn = () => {
    navigation.goBack();
  };
  // const { onReturn } = route ?? {};

  return (
    <SuccessConfetti
      onReturn={onReturn}
      note={`You will be notified of your outcome within 1-2 working days`}
      successText={"Documents submitted!"}
    />
  );
};

export default ManualReviewSuccess;
