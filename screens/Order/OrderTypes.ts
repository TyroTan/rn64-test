export interface Store {
  slug: string;
  name: string;
  logo: string;
  categories: {
    external_id: string;
    name: string;
  }[];
  description: string;
  website: string;
  highlighted_products: any[];
  stores: {
    external_id: string;
    slug: string;
    name: string;
    address: string;
    photo: null;
  }[];
}

export interface OrderPaymentPlan {
  payment_plan_def_id: string;
  instalment_frequency: string;
  instalment_count: number;
  instalment_amount: string;
  instalment_processing_fee_amount: string;
  downpayment_amount: string;
  total_amount: string;
  credit_used_amount: string;
  insufficient_credit: boolean;
  sufficient_credit_amount: string;
  repayments: {
    sequence: number;
    downpayment_amount: string;
    instalment_amount: string;
    instalment_processing_fee_amount: string;
    total_amount: string;
    due_at: string;
  }[];
}

type OrderDeepLinkType =
  | "store_id"
  | "order_campaign_referred_code"
  | "checkout_id";

interface SelectedPaymentPlan {
  payment_plan_def_id: string;
  instalment_frequency: string;
  instalment_count: number;
  instalment_amount: string;
  instalment_processing_fee_amount: string;
  downpayment_amount: string;
  total_amount: string;
  credit_used_amount: string;
  insufficient_credit: boolean;
  sufficient_credit_amount: string;
}

export interface OrderState {
  // deeplink_type: OrderDeepLinkType;
  country: string;
  merchant: {
    slug: string;
    name: string;
    logo: string;
  };
  code: string;
  state: string;
  grand_total_amount: string;
  repayments_total_mount: string;
  repayments_remaining_amount: string;
  created_at: string;
  selected_payment_plan: null | SelectedPaymentPlan;
  repayments_fully_paid_at: null;
  vouchers: {
    code: string;
    type: string;
    min_credit: {
      min_credit_amount: string;
      additional_credit_amount: string;
      credit_amount: string;
      credit_balance: string;
    };
  }[];
  available_payment_plans: OrderPaymentPlan[];
  has_min_credit_amount_for_profit: boolean;
  min_credit_amount_for_profit: string;
  merchant_credit_amount: null;
  merchant_credit_balance: null;
  is_merchant_credit_balance: boolean;
}

export interface ResponseFetchOrder {
  success: boolean;
  data: {
    country: string;
    merchant: {
      slug: string;
      name: string;
      logo: string;
    };
    store: {
      slug: string;
      name: string;
    };
    code: string;
    state: string;
    grand_total_amount: string;
    repayments_total_mount: string;
    repayments_remaining_amount: string;
    created_at: string;
    due_at: string;
    selected_payment_plan: {
      payment_plan_def_id: string;
      instalment_frequency: string;
      instalment_count: number;
      instalment_amount: string;
      instalment_processing_fee_amount: string;
      downpayment_amount: string;
      total_amount: string;
      credit_used_amount: string;
      insufficient_credit: boolean;
      sufficient_credit_amount: string;
    };
    repayments_fully_paid_at: null;
    vouchers: [];
    collection_payment_method: {
      id: string;
      third_party_name: string;
      status: string;
      created_at: string;
      mode: string;
      expired_at: string;
      card: {
        brand: string;
        funding: string;
        ending_digits: string;
      };
    };
    repayments: {
      sequence: number;
      downpayment_amount: string;
      instalment_amount: string;
      instalment_processing_fee_amount: string;
      total_amount: string;
      due_at: string;
      id: string;
      state: string;
      payment_transaction: null | {
        payment_method: ResponseFetchOrder["data"]["collection_payment_method"];
        created_at: string;
      };
      can_pay: boolean;
    }[];
  };
  message: null;
  errors: null;
}

export interface OrderPaymentModalResult {
  onModalCheck: () => void;
  onReset: () => void;
  isLoading: {
    orderPaymentModal: null | boolean;
  };
  response: {
    orderPaymentModal:
      | null
      | "ModalNoError"
      | "ModalExpiredIdentity"
      | "ModalInsufficientCredit"
      | "ModalMoreCredit"
      | "ModalOnboardingIdentity"
      | "ModalOnboardingPaymentMethod"
      | "ModalDiscardSuccess"
      | "ModalNoPaymentPlan";
  };
  // modalState:
  //   | null
  //   | "ModalExpiredIdentity"
  //   | "ModalInsufficientCredit"
  //   | "ModalMoreCredit"
  //   | "ModalOnboardingIdentity"
  //   | "ModalOnboardingPaymentMethod"
  //   | "ModalDiscardSuccess"
  //   | "ModalNoPaymentPlan";

  // checkedVerifyIdentity: null | boolean;
  // setCheckedVerifyIdentity: (props: any) => void;
  // checkedPaymentMethod: null | boolean;
  // setCheckedPaymentMethod: (props: any) => void;

  // onResetModalState: () => void;
}

/*
{
    "country": "sg",
    "merchant": {
        "slug": "string-soul-sg",
        "name": "String Soul SG",
        "logo": "https://res.cloudinary.com/hflj9cmhy/image/upload/v1/media/uploads/merchants/merchant/2021/03/17/43e7a7c2-71fe-428a-96f5-a2540feb8ce5_demo-store-logo-square_tard43"
    },
    "code": "ODR-TZN84TMRF4F",
    "state": "created",
    "grand_total_amount": "111.99",
    "repayments_total_mount": "0.00",
    "repayments_remaining_amount": "0.00",
    "created_at": "2021-12-03T00:46:36.307404+08:00",
    "selected_payment_plan": null,
    "repayments_fully_paid_at": null,
    "vouchers": [
        {
            "code": "SSSG2000",
            "type": "min_credit",
            "min_credit": {
                "min_credit_amount": "2000.00",
                "additional_credit_amount": "0.00",
                "credit_amount": "3000.00",
                "credit_balance": "3000.00"
            }
        }
    ],
    "available_payment_plans": [
        {
            "payment_plan_def_id": "sg-monthly-3-dp-000-mu-000-mdr-400-suf-tzn84tmrf4f",
            "instalment_frequency": "monthly",
            "instalment_count": 3,
            "instalment_amount": "37.33",
            "instalment_processing_fee_amount": "0.00",
            "downpayment_amount": "0.00",
            "total_amount": "111.99",
            "credit_used_amount": "111.99",
            "insufficient_credit": false,
            "sufficient_credit_amount": "111.99",
            "repayments": [
                {
                    "sequence": 0,
                    "downpayment_amount": "0.00",
                    "instalment_amount": "37.33",
                    "instalment_processing_fee_amount": "0.00",
                    "total_amount": "37.33",
                    "due_at": "2021-12-03T00:46:36.328742+08:00"
                },
                {
                    "sequence": 1,
                    "downpayment_amount": "0.00",
                    "instalment_amount": "37.33",
                    "instalment_processing_fee_amount": "0.00",
                    "total_amount": "37.33",
                    "due_at": "2022-01-03T00:46:36.328742+08:00"
                },
                {
                    "sequence": 2,
                    "downpayment_amount": "0.00",
                    "instalment_amount": "37.33",
                    "instalment_processing_fee_amount": "0.00",
                    "total_amount": "37.33",
                    "due_at": "2022-02-03T00:46:36.328742+08:00"
                }
            ]
        }
    ],
    "has_min_credit_amount_for_profit": true,
    "min_credit_amount_for_profit": "0.00",
    "merchant_credit_amount": null,
    "merchant_credit_balance": null,
    "is_merchant_credit_balance": false
}
*/

export interface OrderDraft {
  country: string;
  merchant: {
    slug: string;
    name: string;
    logo: string;
  };
  code: string;
  state: string;
  grand_total_amount: string;
  repayments_total_mount: string;
  repayments_remaining_amount: string;
  created_at: string;
  selected_payment_plan: null;
  repayments_fully_paid_at: null;
  vouchers: {
    code: string;
    type: string;
  }[];
}

/*
[
  {
      "country": "sg",
      "merchant": {
          "slug": "string-soul-sg",
          "name": "String Soul SG",
          "logo": "https://res.cloudinary.com/hflj9cmhy/image/upload/v1/media/uploads/merchants/merchant/2021/03/17/43e7a7c2-71fe-428a-96f5-a2540feb8ce5_demo-store-logo-square_tard43"
      },
      "code": "ODR-TZN84TMRF4F",
      "state": "created",
      "grand_total_amount": "111.99",
      "repayments_total_mount": "0.00",
      "repayments_remaining_amount": "0.00",
      "created_at": "2021-12-03T00:46:36.307404+08:00",
      "selected_payment_plan": null,
      "repayments_fully_paid_at": null,
      "vouchers": [
          {
              "code": "SSSG2000",
              "type": "min_credit"
          }
      ]
  }
]
*/

export interface ResponseConfirmOrder {
  success: boolean;
  data: {
    order: {
      country: string;
      merchant: {
        slug: string;
        name: string;
        logo: string;
      };
      code: string;
      state: string;
      grand_total_amount: string;
      repayments_total_mount: string;
      repayments_remaining_amount: string;
      created_at: string;
      selected_payment_plan: {
        payment_plan_def_id: string;
        instalment_frequency: string;
        instalment_count: number;
        instalment_amount: string;
        instalment_processing_fee_amount: string;
        downpayment_amount: string;
        total_amount: string;
        credit_used_amount: string;
        insufficient_credit: boolean;
        sufficient_credit_amount: string;
      };
      repayments_fully_paid_at: null;
      vouchers: [
        {
          code: string;
          type: string;
        }
      ];
      collection_payment_method: {
        id: string;
        third_party_name: string;
        status: string;
        created_at: string;
        mode: string;
        expired_at: string;
        card: {
          brand: string;
          funding: string;
          ending_digits: string;
        };
      };
      repayments: {
        sequence: number;
        downpayment_amount: string;
        instalment_amount: string;
        instalment_processing_fee_amount: string;
        total_amount: string;
        due_at: string;
        id: string;
        state: string;
        payment_transaction: null | {
          id: string;
          third_party_name: string;
          status: string;
          created_at: string;
          amount: string;
          currency: string;
          payment_method: {
            mode: string;
            expired_at: string;
            card: {
              brand: string;
              funding: string;
              ending_digits: string;
            };
          };
          stripe: {
            payment_intent_id: null;
            payment_method_id: null;
            client_secret: string;
          };
        };
        can_pay: boolean;
      }[];
    };
    repayment: {
      sequence: 0;
      downpayment_amount: string;
      instalment_amount: string;
      instalment_processing_fee_amount: string;
      total_amount: string;
      due_at: string;
      id: string;
      state: string;
      payment_transaction: {
        id: string;
        third_party_name: string;
        status: string;
        created_at: string;
        amount: string;
        currency: string;
        payment_method: {
          mode: string;
          expired_at: string;
          card: {
            brand: string;
            funding: string;
            ending_digits: string;
          };
        };
        stripe: {
          payment_intent_id: null;
          payment_method_id: null;
          client_secret: string;
        };
      };
      can_pay: boolean;
    };
    redirect_url: null;
  };
  message: null;
  errors: null;
}

export interface GroupedRepayment {
  sequence: number;
  downpayment_amount: string;
  instalment_amount: string;
  instalment_processing_fee_amount: string;
  total_amount: string;
  due_at: string;
  id: string;
  state: string;
  payment_transaction: null;
  can_pay: boolean;
  order: {
    country: string;
    merchant: {
      slug: string;
      name: string;
      logo: string;
    };
    code: string;
    state: string;
    grand_total_amount: string;
    repayments_total_mount: string;
    repayments_remaining_amount: string;
    created_at: string;
  };
}
