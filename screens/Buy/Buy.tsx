import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as Progress from "react-native-progress";

import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable as Button,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
  KeyboardAwareScrollView,
  StyledMainButton as CardListViewBtn,
} from "components";
import { theme } from "styles/theme";
const imgBGBuyBlue = require("assets/images/bg-transaction-blue.png");
const imgCategoryHealthcare = require("assets/images/category-health-care.png");
const imgCategoryEducation = require("assets/images/category-education.png");
const imgDummyBecome = require("assets/images/dummy-become.png");

import { useDisableAndroidBackHook, useResetScreen } from "hooks";
import Layout from "constants/Layout";
import { hexToRGB } from "utils/hex-util";
import { SearchTextField } from "components";
import {
  useMerchantStore,
  useNestedNavigatorStore,
  useUserStore,
} from "stores";
import globalObjectState from "utils/global-object-per-country-code";

const styles = StyleSheet.create({
  featuredMerchantsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredMerchantBtn: {
    width: "44%",
    marginRight: "6%",
    // borderWidth: 1,
  },
});

export enum BuyRoutes {
  BuyInitial = "BuyInitial",
  Buy = "Buy",
  BuyHiddenSearchResults = "BuyHiddenSearchResults",
  Merchant = "Merchant",
}

export interface BuyParamsList extends ParamListBase {
  [BuyRoutes.BuyInitial]: undefined;
  [BuyRoutes.Buy]: undefined;
  [BuyRoutes.BuyHiddenSearchResults]: undefined;
  [BuyRoutes.Merchant]: undefined;
}

type BuyProps = NativeStackScreenProps<BuyParamsList, BuyRoutes.BuyInitial>;

const StyledBGHeader = ({
  onChangeHeaderBgImageDimension,
}: {
  onChangeHeaderBgImageDimension: ({
    finalHeight,
    finalWidth,
  }: {
    finalHeight: number;
    finalWidth: number;
  }) => void;
}) => {
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgBGBuyBlue);
  const { width, height: layoutHeight } = Layout?.window ?? {};

  useEffect(() => {
    const srcHeight = assetImgSrc?.height ?? 1,
      srcWidth = assetImgSrc?.width ?? 1;
    const maxHeight = layoutHeight ?? 1;
    const maxWidth = width ?? 1;
    const ratio = Math.min(
      maxWidth / (srcWidth ?? 1),
      maxHeight / (srcHeight ?? 1)
    );
    const finalHeight = srcHeight * ratio;
    setHeight(finalHeight);
    onChangeHeaderBgImageDimension({
      finalHeight,
      finalWidth: srcWidth * ratio,
    });
  }, [layoutHeight, width, assetImgSrc]);

  return (
    <>
      <Image
        resizeMode="contain"
        source={imgBGBuyBlue}
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
          zIndex: 1,
        }}
      />
      <StyledBox
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-end"
        width={width * 0.9}
        marginLeft={width * 0.05}
        height={height}
        backgroundColor="transparent"
        paddingBottom={6}
        postion="absolute"
        zIndex={2}
        // padding={10}
      >
        <StyledText variant="title" color={theme.colors.background2} mb={14}>
          Merchants
        </StyledText>
      </StyledBox>
    </>
  );
};

interface MerchantStoreResult {
  fetchCategories: () => any;
  fetchRecommended: (countryCode: string) => any;
  refreshMerchantStates: () => {
    response: {
      categories: {
        categories: {
          external_id: string;
          name: string;
        }[];
      };
      recommended: {
        merchants: {
          categories: {
            name: string;
          }[];
          logo: string;
          name: string;
          slug: string;
        }[];
      };
    };
  };
}

const RenderCategoryBtns = () => {
  const navigation = useNavigation();
  const { fetchCategories, refreshMerchantStates } =
    useMerchantStore() as MerchantStoreResult;

  useResetScreen({
    navigation,
    onReset: () => {
      // forces refetch every tab visit, might not be optimal
      fetchCategories();
    },
  });

  const { response: { categories: responseCategories } = {} } =
    refreshMerchantStates();
  const { categories } = responseCategories ?? {};

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {(categories ?? [])?.map((cat) => (
        <CardListView
          variant="card"
          key={cat.external_id}
          width={"auto"}
          minWidth={mscale(144)}
          margin={0}
          marginRight={mscale(13.5)}
        >
          <CardListViewBtn
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            borderWidth={0}
            margin={0}
          >
            <Image
              source={imgCategoryHealthcare}
              resizeMode="contain"
              style={{
                width: mscale(30),
                height: mscale(30),
                marginVertical: mscale(14),
                marginLeft: mscale(13),
                marginRight: mscale(10),
              }}
            />
            <StyledText variant="titleTertiary" mr={3}>
              {cat.name}
            </StyledText>
          </CardListViewBtn>
        </CardListView>
      )) ?? <></>}
    </View>
  );
};

const RenderFeaturedMerchantItem = (allProps: any) => {
  const { navigate, logo, name, categories } = allProps;
  const onGoToMerchant = () => {
    // useNested?
    navigate(BuyRoutes.Merchant);
    // navigate("");
  };
  const imgLogoFeatured = logo?.length > 0 ? { uri: logo } : imgDummyBecome;

  return (
    <TouchableOpacity
      style={styles.featuredMerchantBtn}
      onPress={onGoToMerchant}
    >
      <CardListView
        variant="cardMerchants"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        paddingHorizontal={mscale(15)}
        minHeight={mscale(170)}
        width="100%"
      >
        <Image
          source={imgLogoFeatured}
          resizeMode="contain"
          style={{
            width: mscale(105),
            height: mscale(105),
          }}
        />
        <StyledText variant="titleTertiary">{name}</StyledText>
        <StyledText variant="paragraphSmallest">
          {categories?.[0]?.name}
        </StyledText>
      </CardListView>
    </TouchableOpacity>
  );
};

const Buy: React.FC<BuyProps> = (props: any) => {
  const { navigation } = props;
  useDisableAndroidBackHook();

  const {
    response: { user },
  } = useUserStore();
  const { countryCode } = globalObjectState.getLibrary();
  const { setFromBuy } = useNestedNavigatorStore();

  const [newBgHeight, setNewBgHeight] = useState(0);
  const [newBgWidth, setNewBgWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const onSetNewDimension = (dim: {
    finalHeight: number;
    finalWidth: number;
  }) => {
    if (dim?.finalHeight) {
      setNewBgHeight(dim.finalHeight);
      setNewBgWidth(dim.finalWidth);
    }
  };

  useResetScreen({
    navigation,
    onReset: () => {
      setSearchTerm("");
    },
  });

  // *Events

  const onChangeSearchTerm = (text: string) => {
    setSearchTerm(text);
  };

  // const { countryCode } = responseUser;
  // console.log("countryCodecountryCode", countryCode);
  const onSearch = useCallback(() => {
    // fetchSearchResults(searchTerm, "", countryCode);
    setFromBuy({ searchTerm });
    navigation.navigate(BuyRoutes.BuyHiddenSearchResults);
  }, [searchTerm]);

  return (
    <View style={{ height: "100%" }}>
      <StyledBGHeader onChangeHeaderBgImageDimension={onSetNewDimension} />
      <SearchTextField
        value={searchTerm}
        onSearch={onSearch}
        onChangeText={onChangeSearchTerm}
        onSubmitEditing={onSearch}
        newBgHeight={newBgHeight}
        newBgWidth={newBgWidth}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          // paddingHorizontal: mscale(23),
          marginTop: mscale(27 + 23),
          paddingBottom: mscale(20),
        }}
      >
        <StyledText
          variant="titleSemi"
          textAlign="left"
          mb={2}
          marginLeft={mscale(23)}
        >
          Categories
        </StyledText>

        {/* <StyledBox border backgroundColor="#FFF"> */}
        <StyledScrollView
          directionalLockEnabled={false}
          horizontal
          contentInset={{ right: mscale(25) }}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          snapToInterval={mscale(160)}
          indicatorStyle="white"
          backgroundColor={"#FFF"}
          paddingTop={mscale(15)}
          paddingBottom={mscale(25)}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "flex-start",
            // backgroundColor: "#FFF",
            backgroundColor: "transparent",
            paddingHorizontal: mscale(18),
          }}
        >
          <RenderCategoryBtns />
        </StyledScrollView>
        {/* </StyledBox> */}

        <StyledText
          variant="titleSemi"
          textAlign="left"
          mb={2}
          marginLeft={mscale(23)}
        >
          Featured Merchants
        </StyledText>
        <RenderFeaturedMerchants
          countryCode={countryCode}
          navigation={navigation}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Buy;

const RenderFeaturedMerchants = (props: any) => {
  const { navigation, countryCode } = props;
  const { fetchRecommended, refreshMerchantStates } =
    useMerchantStore() as MerchantStoreResult;
  const [merchants, setMerchants] = useState([] as any);

  useResetScreen({
    navigation,
    onReset: () => {
      setMerchants([]);

      // forces refetch every tab visit, might not be optimal
      fetchRecommended(countryCode);
      // console.log(
      //   "refreshMerchantStates()?.response?.recommended?",
      //   refreshMerchantStates()?.response?.recommended
      // );
      setMerchants(
        refreshMerchantStates()?.response?.recommended?.merchants ?? []
      );
    },
  });

  const {
    response: { recommended: responseRecommended },
  } = useMerchantStore();
  // const {  } = responseRecommended ?? {};

  useEffect(() => {
    if (Array.isArray(responseRecommended?.merchants)) {
      setMerchants(responseRecommended.merchants);
    }
  }, [responseRecommended]);

  return (
    <StyledBox
      backgroundColor={theme.colors.background2}
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      marginLeft={mscale(23)}
      height={"auto"}
      flexWrap="wrap"
    >
      {merchants?.map((featuredMerchant: any, index: number) => (
        <RenderFeaturedMerchantItem
          key={index}
          navigate={navigation.navigate}
          {...featuredMerchant}
        />
      )) ?? <></>}
    </StyledBox>
  );
};
