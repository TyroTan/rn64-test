import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Device from "expo-device";
import {
  CardListView,
  StyledBox,
  StyledText,
  ProgressCircleLayered,
  CardListItemDivider,
  StyledSafeAreaView,
  SearchTextField,
  StyledMerchantBanner,
  StyledScrollView,
} from "components";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import {
  useMerchantStore,
  useNestedNavigatorStore,
  useUserStore,
} from "stores";
import { useResetScreen } from "hooks";
import globalObjectState from "utils/global-object-per-country-code";
const imgNoResults = require("assets/images/img-no-searchresults.png");
const imgIconX = require("assets/images/icon-x.png");

const styles = StyleSheet.create({
  categoryWrapperBtn: {
    height: mscale(44),
    borderRadius: mscale(22),
    width: mscale(105),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: mscale(1),
    borderColor: theme.colors.buttons.lightGray,
  },
  imgIconX: {
    marginLeft: mscale(11),
    width: mscale(13),
    height: mscale(13),
  },
  merchantWrapperBtn: {
    // height: mscale(144),
    // borderRadius: mscale(22),
    backgroundColor: "transparent",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: mscale(1),
    borderColor: theme.colors.buttons.lightGray,
  },
  imgLogo: {
    width: mscale(49),
    height: mscale(49),
  },
  imgNoResults: {
    width: mscale(174),
    height: mscale(174),
  },
});

const RenderMerchantItem = (props: any) => {
  const { name, logo, description, categories = [] } = props?.item ?? {};
  const imgLogoSource = logo?.length > 0 ? { uri: logo } : imgIconX;
  const { name: categoryName } = categories?.[0];

  return (
    <TouchableOpacity style={styles.merchantWrapperBtn}>
      <StyledMerchantBanner
        alignSelf="flex-start"
        marginTop={22}
        marginBottom={20}
        source={imgLogoSource}
        imgProps={{
          style: styles.imgLogo,
        }}
      />
      <StyledBox
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        marginLeft={6}
      >
        <StyledText
          fontFamily="PoppinsBold"
          fontSize={12}
          lineHeight={12}
          color="#000"
        >
          {name}
        </StyledText>
        <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
          {description?.length ? description : categoryName}
        </StyledText>
      </StyledBox>
    </TouchableOpacity>
  );
};

const RenderMerchants = (props: any) => {
  const { merchants } = props;

  return (
    <>
      {merchants.map((item: any, index: number) => (
        <RenderMerchantItem item={item} key={index} />
      ))}
    </>
  );
};

const NoResults = () => {
  return (
    <StyledBox
      height="100%"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        source={imgNoResults}
        resizeMode="contain"
        style={styles.imgNoResults}
      />
      <StyledText variant="title" fontSize={16} lineHeight={16} mb={1}>
        No matching results
      </StyledText>
      <StyledText variant="paragraphSmall" marginBottom={19}>
        Please try searching for something else
      </StyledText>
    </StyledBox>
  );
};

const SearchResults = (props: any) => {
  const { route, navigation } = props;
  const { getNestedNavigatorStates } = useNestedNavigatorStore();
  const getFromBuy = () => getNestedNavigatorStates().response.fromBuy;

  const [merchants, setMerchants] = useState<any>(null);

  // onFocus/didMount

  const onReset = () => {
    setMerchants(null);
    onSearch();
  };

  useResetScreen({
    navigation,
    onReset,
  });

  const {
    response: {
      categories: responseCategories,
      searchResults: responseSearchResults,
    },
    refreshMerchantStates,
    fetchSearchResults,
  } = useMerchantStore();
  const statusBarHeight = getStatusBarHeight(Device);

  // *Events

  const { countryCode } = globalObjectState.getLibrary();
  const onSearch = useCallback(async () => {
    const { searchTerm = "" } = getFromBuy();
    // console.log("countryCodecountryCode", countryCode);
    await fetchSearchResults(searchTerm, "", countryCode);

    const items =
      refreshMerchantStates().response.searchResults?.merchants ?? [];
    console.log("items", items);
    if (items.length) {
      setMerchants(items);
    }

    // navigation.navigate(BuyRoutes.BuyHiddenSearchResults, { searchTerm });
  }, [countryCode, getFromBuy, refreshMerchantStates]);

  // *Effects
  // didmount
  useEffect(() => {
    setMerchants(null);
  }, []);

  const Contents = useMemo(() => {
    if (merchants === null) {
      return (
        <ActivityIndicator
          color={theme.colors.rn64testBlue}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}
          size="large"
        />
      );
    }

    return merchants?.length === 0 ? (
      <NoResults />
    ) : (
      <RenderMerchants merchants={merchants} />
    );
  }, [merchants]);

  return (
    <StyledSafeAreaView
      paddingTop={statusBarHeight >= 20 ? mscale(100) : mscale(90)}
      paddingHorizontal={20}
    >
      <SearchTextField
        defaultValue={getFromBuy()?.searchTerm ?? ""}
        newBgWidth="100%"
        left="5.5%"
      />
      {/* <RenderCategory /> */}
      <StyledScrollView
        contentContainerStyle={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          padding: mscale(20),
          paddingTop: mscale(15),
          margin: 0,
          alignSelf: "center",
          height: "100%",
        }}
      >
        {Contents}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default SearchResults;
