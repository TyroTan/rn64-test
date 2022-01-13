import React, { createRef, useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  TextProps,
  ScrollView,
} from "react-native";
import { mscale } from "utils/scales-util";
import HighlightText from "@sanar/react-native-highlight-text";

import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonTopTabShadow,
  ButtonText,
  SearchTextField,
  CardListView,
  CardListItemDivider,
} from "components";
import { theme } from "styles/theme";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBuyerStore } from "stores";
import { faqs } from "../../contents/faq";

const imgCaretUp = require("assets/images/caret-up-black.png");
const imgCaretDown = require("assets/images/caret-down-black.png");

const RenderAccordion = (props: any) => {
  const { title, text, textToHighlight } = props;
  const [collapsed, setCollapsed] = useState(false);
  const imgCaret = collapsed ? imgCaretUp : imgCaretDown;

  const onToggleAccordion = () => setCollapsed((prev) => !prev);

  interface CustomStyleTextProps extends TextProps {
    children?: any;
  }
  const TitleStyledText: React.FC<CustomStyleTextProps> = ({ children }) => {
    return (
      <StyledText
        textAlign="left"
        variant="titleTertiary"
        style={{ maxWidth: "90%" }}
      >
        {children}
      </StyledText>
    );
  };

  const ContentStyledText: React.FC<CustomStyleTextProps> = ({ children }) => {
    return (
      <StyledText
        variant="paragraphSmallest"
        textAlign="left"
        fontSize={mscale(12.5)}
      >
        {children}
      </StyledText>
    );
  };

  const Field = () => {
    return (
      <StyledBox
        variant="flexcr"
        justifyContent="space-between"
        backgroundColor={theme.colors.background2}
      >
        <HighlightText
          highlightStyle={{ backgroundColor: "yellow" }}
          searchWords={[textToHighlight]}
          textToHighlight={title}
          textComponent={TitleStyledText}
        />

        <TouchableOpacity onPress={onToggleAccordion}>
          <Image
            source={imgCaret}
            resizeMode="contain"
            style={{
              margin: mscale(2),
              width: mscale(12),
              height: mscale(12),
            }}
          />
        </TouchableOpacity>
      </StyledBox>
    );
  };

  if (collapsed) {
    return (
      <CardListView width="100%" padding={6}>
        <Field />
        <CardListItemDivider style={{ marginTop: mscale(15), width: "100%" }} />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E3E3E3",
            borderRadius: mscale(15),
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingVertical: mscale(11),
            paddingRight: mscale(16),
          }}
        >
          <HighlightText
            highlightStyle={{ backgroundColor: "yellow" }}
            searchWords={[textToHighlight]}
            textToHighlight={text}
            textComponent={ContentStyledText}
          />
        </View>
      </CardListView>
    );
  }

  return (
    <CardListView width="100%" padding={6}>
      <Field />
    </CardListView>
  );
};

const FAQSearchResults: React.FC<any> = ({ searchTerm }) => {
  const [searchResults, setSearchResults] = useState<any>([]);

  // *Effects
  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      const filteredResults: any = [];
      faqs.forEach((category) => {
        category.items.forEach((item) => {
          const { question, answer } = item;
          if (
            question.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
            answer.toLowerCase().search(searchTerm.toLowerCase()) > -1
          ) {
            filteredResults.push(item);
          }
        });
      });

      setSearchResults(filteredResults);
    }
  }, [searchTerm]);

  return (
    <>
      {searchResults.map((result: any) => {
        return (
          <RenderAccordion
            title={result.question}
            text={result.answer}
            key={result.question}
            textToHighlight={searchTerm}
          />
        );
      })}
    </>
  );
};

const FAQ: React.FC<any> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState("General");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    response: { cbsUpload: responseCbsUpload },
    submitCbsUpload,
  } = useBuyerStore();

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () => {
    navigation.navigate("NAVTEST3");
  };

  const onPressGeneral = () => setActiveTab("General");
  const onPressCredit = () => setActiveTab("Payments");
  const onPressPayments = () => setActiveTab("Orders");

  const onChangeSearchTerm = (text: string) => {
    setSearchTerm(text);
  };

  const handleNavigateContactUs = () => {
    navigation.navigate("ContactUs");
  };

  // *JSX
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <StyledSafeAreaView
        flex={1}
        flexDirectdion="column"
        justifyConent="flex-end"
        alignItems="stretch"
        backgroundColor={theme.colors.background}
        paddingHorizontal={25}
      >
        <SearchTextField
          newBgHeight={mscale(45)}
          placeholderText="Search FAQs"
          defaultValue={""}
          newBgWidth="100%"
          left="7.5%"
          value={searchTerm}
          onChangeText={onChangeSearchTerm}
        />

        <StyledBox
          flex={1}
          width="100%"
          backgroundColor={theme.colors.background}
          paddingTop={mscale(65)}
        >
          {searchTerm.length === 0 && (
            <StyledBox
              variant="flexcr"
              width="100%"
              justifyContent="space-between"
              backgroundColor={theme.colors.background}
              mb={8}
            >
              <ButtonTopTabShadow
                width="31%"
                pt={1}
                pb={1}
                variant={
                  activeTab === "General" ? "primary" : "primaryInverted"
                }
                children={"General"}
                onPress={onPressGeneral}
              />
              <ButtonTopTabShadow
                width="31%"
                pt={1}
                pb={1}
                variant={
                  activeTab === "Payments" ? "primary" : "primaryInverted"
                }
                children={"Payments"}
                onPress={onPressCredit}
              />
              <ButtonTopTabShadow
                width="31%"
                pt={1}
                pb={1}
                variant={activeTab === "Orders" ? "primary" : "primaryInverted"}
                children={"Orders"}
                numberOfLines={1}
                onPress={onPressPayments}
              />
            </StyledBox>
          )}

          {searchTerm.length > 0 && (
            <FAQSearchResults searchTerm={searchTerm} />
          )}

          {searchTerm === "" &&
            faqs?.map((faq) => {
              if (faq.categoryName === activeTab) {
                return faq.items.map((item) => {
                  return (
                    <RenderAccordion
                      title={item.question}
                      text={item.answer}
                      key={item.question}
                    />
                  );
                });
              }
            })}

          <TouchableOpacity onPress={handleNavigateContactUs}>
            <StyledText variant="paragraph" fontSize={11}>
              Don't see your questions here?
              <StyledText
                variant="paragraph"
                fontSize={11}
                color={theme.colors.buttons.marineBlue}
              >
                {" "}
                Contact us
              </StyledText>
            </StyledText>
          </TouchableOpacity>
        </StyledBox>
      </StyledSafeAreaView>
    </ScrollView>
  );
};

export default FAQ;
