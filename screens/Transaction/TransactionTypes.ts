export interface ResponsePayNext {
  success: boolean;
  data: {
    order: {
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
      repayments_fully_paid_at: string;
      vouchers: [];
    };
    repayment: {
      sequence: number;
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
          payment_intent_id: null | string;
          payment_method_id: null | string;
          client_secret: string;
        };
      };
      can_pay: boolean;
    };
  };
  message: null;
  errors: null;
}
