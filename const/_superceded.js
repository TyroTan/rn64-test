export const IDLE_TIMEOUT_SECONDS = 5 * 60 * 1000; // time of inactivity until session timeout popup
export const IDLE_LOGOUT_SECONDS = 10 * 1000; // time until logout if user doesn't press 'continue session'

export const ANONYMOUS_PATHNAMES = ["/onboarding", "/register/"];
export const MERCHANTS_ANONYMOUS_PATHNAMES = ["/login/"];
export const MERCHANTS_NO_TIMEOUT_PATHNAMES = ["/login/", "/"];
export const NO_MOBILE_MENU_PATHNAMES = [
  "/credits/request/",
  "/shop/",
  "/order/",
];

export const USER_TYPE_BUYER = "buyer";
export const USER_TYPE_RESELLER = "reseller";
export const USER_TYPE_MERCHANT = "merchant";

export const SHOP_PAGE_SIZE = 8;

export const bankNameOptions = [
  { value: "", label: "" },
  { value: "DBSSSGSGXXX", label: "DBS Bank" },
  {
    value: "OCBCSGSGXXX",
    label: "Oversea-Chinese Banking Corporation Limited",
  },
  { value: "UOVBSGSGXXX", label: "United Overseas Bank Limited" },
  { value: "RHBBSGSGXXX", label: "RHB Bank Berhad" },
  { value: "CIBBSGSGXXX", label: "CIMB Bank Berhad" },
  { value: "CITISGSGXXX", label: "Citibank N.A" },
  {
    value: "HSBCSGSGXXX",
    label: "HongKong and Shanghai Banking Corporation Limited",
  },
  {
    value: "ANZBSGSXXXX",
    label: "Australia & New Zealand Banking Group Limited",
  },
  { value: "SCBLSGSGXXX", label: "Standard Chartered Bank" },
  { value: "BKCHSGSGXXX", label: "Bank Of China Limited" },
];
