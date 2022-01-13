/* warning, this is experimental, use with care */
/* global variables or objects should be avoided */
/* as much as possible do not add more features to this */
/* do not override any object/class member/fields */

type ScreenStateTypes =
  | "fromPaymentReceipt"
  | "modalProceedPurchase"
  | "orderDLToManualReview"
  | "orderDLToVerify"
  | "fromTransactionItem"
  | "fromTransactionItemPaymentMethodSuccess"
  | "fromTransactionItemPaymentMethodFailed"
  | "fromOrderConfirm"
  | "fromOrderConfirmPaymentMethodSuccess"
  | "fromOrderConfirmPaymentMethodFailed";
interface ParamsFromPaymentReceipt {
  orderCode: null | string;
}

interface ActionState<D = undefined | ParamsFromPaymentReceipt> {
  action: null | ScreenStateTypes;
  data?: D;
}

const defaultState: ActionState = {
  action: null,
};

const fromPaymentReceiptState: ActionState<ParamsFromPaymentReceipt> = {
  action: "fromPaymentReceipt",
  data: {
    orderCode: "null",
  },
};

const modalProceedPurchaseState: ActionState = {
  // applies to all credit related modals
  // maybe only to specific modals?
  action: "modalProceedPurchase",
};

const orderDLToManualReviewState: ActionState = {
  // applies to all credit related modals
  // maybe only to specific modals?
  // stack: [modalProceedPurchaseState],
  action: "orderDLToManualReview",
};

const orderDLToVerifyState: ActionState = {
  // applies to all credit related modals
  // maybe only to specific modals?
  // stack: [modalProceedPurchaseState],
  action: "orderDLToVerify",
};

const fromTransactionItem: ActionState = {
  action: "fromTransactionItem",
};

const fromTransactionItemPaymentMethodSuccess: ActionState = {
  action: "fromTransactionItemPaymentMethodSuccess",
};

const fromTransactionItemPaymentMethodFailed: ActionState = {
  action: "fromTransactionItemPaymentMethodFailed",
};

const fromOrderConfirm: ActionState = {
  action: "fromOrderConfirm",
};

const fromOrderConfirmPaymentMethodSuccess: ActionState = {
  action: "fromOrderConfirmPaymentMethodSuccess",
};

const fromOrderConfirmPaymentMethodFailed: ActionState = {
  action: "fromOrderConfirmPaymentMethodFailed",
};

// const getStatePerScreenAction = (type: ScreenStateTypes) => {
//   if (type === "fromPaymentReceiptState") {
//     return { ...fromPaymentReceiptState };
//   }

//   return { ...defaultState };
// };

interface GlobalObjectLastActionState {
  get: () => ActionState;
  resetBeforeUse: () => void;
  resetAfterUse: () => void;
  set: (
    type: ScreenStateTypes,
    props?: ActionState<{
      orderCode: null | string;
    }>
  ) => void;
}

const globalObjectLastActionState: GlobalObjectLastActionState = {
  // my by default
  get: () => ({ ...defaultState }),
  resetBeforeUse: () => {
    globalObjectLastActionState.get = () => ({ ...defaultState });
  },
  resetAfterUse: () => {
    globalObjectLastActionState.get = () => ({ ...defaultState });
  },
  set: (
    type: ScreenStateTypes,
    props?: ActionState<{
      orderCode: null | string;
    }>
  ) => {
    switch (type) {
      case "fromPaymentReceipt":
        globalObjectLastActionState.get = () => {
          return { ...fromPaymentReceiptState, ...props };
        };
        break;

      case "modalProceedPurchase":
        globalObjectLastActionState.get = () => {
          return { ...modalProceedPurchaseState };
        };
        break;

      case "orderDLToManualReview":
        globalObjectLastActionState.get = () => {
          return { ...orderDLToManualReviewState } as ActionState;
        };
        break;

      case "orderDLToVerify":
        globalObjectLastActionState.get = () => {
          return { ...orderDLToVerifyState } as ActionState;
        };
        break;

      case "fromTransactionItem":
        globalObjectLastActionState.get = () => {
          return { ...fromTransactionItem };
        };
        break;

      case "fromTransactionItemPaymentMethodSuccess":
        globalObjectLastActionState.get = () => {
          return { ...fromTransactionItemPaymentMethodSuccess };
        };
        break;

      case "fromTransactionItemPaymentMethodFailed":
        globalObjectLastActionState.get = () => {
          return { ...fromTransactionItemPaymentMethodFailed };
        };
        break;

      case "fromOrderConfirm":
        globalObjectLastActionState.get = () => {
          return { ...fromOrderConfirm };
        };
        break;

      case "fromOrderConfirmPaymentMethodSuccess":
        globalObjectLastActionState.get = () => {
          return { ...fromOrderConfirmPaymentMethodSuccess };
        };
        break;

      case "fromOrderConfirmPaymentMethodFailed":
        globalObjectLastActionState.get = () => {
          return { ...fromOrderConfirmPaymentMethodFailed };
        };
        break;

      default:
        globalObjectLastActionState.get = () => {
          return { ...defaultState };
        };
        break;
    }
  },
};

export default globalObjectLastActionState;
