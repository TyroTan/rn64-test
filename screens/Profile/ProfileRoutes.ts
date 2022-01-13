import type { ParamListBase } from "@react-navigation/native";

export enum ProfileRoutes {
  ProfileInitial = "ProfileInitial",
  Profile = "Profile",
  ProfileDeeplinkDummy = "ProfileDeeplinkDummy",
  AddPaymentMethod = "ProfRouteAddPaymentMethod",
  NoPaymentMethod = "ProfRouteNoPaymentMethod",
  PaymentMethodList = "ProfRoutePaymentMethodList",
  AddPaymentMethodSuccess = "ProfRouteAddPaymentMethodSuccess",
  Notifications = "Notifications",
  ContactUs = "ContactUs",
  FAQ = "FAQ",
  Settings = "Settings",
  Merchant = "ProfRouteMerchant",
}

export interface ProfileParamsList extends ParamListBase {
  [ProfileRoutes.ProfileInitial]: undefined;
  [ProfileRoutes.Profile]: undefined;
  [ProfileRoutes.AddPaymentMethod]: undefined;
  [ProfileRoutes.NoPaymentMethod]: undefined;
  [ProfileRoutes.PaymentMethodList]: undefined;
  [ProfileRoutes.Notifications]: undefined;
  [ProfileRoutes.ContactUs]: undefined;
  [ProfileRoutes.FAQ]: undefined;
  [ProfileRoutes.Settings]: undefined;
  [ProfileRoutes.Merchant]: undefined;
}
