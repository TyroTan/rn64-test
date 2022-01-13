import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  CardListView,
  StyledBox,
  StyledText,
  ProgressCircleLayered,
  CardListItemDivider,
} from "components";
import { mscale } from "utils/scales-util";
import {
  groupNotificationsIntoDays,
  capitalizeFirstLetter,
} from "utils/utils-common";
import { advancedDayjs } from "utils/date-utils";
import { theme } from "styles/theme";
import { useBuyerStore, useUserStore } from "stores";
import { backgroundColor } from "styled-system";

const creditCard = require("assets/images/credit-card.png");

const styles = StyleSheet.create({
  cardRowWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: mscale(18),
    paddingHorizontal: mscale(20),
  },
  cardRowDescription: {
    paddingLeft: mscale(12),
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardRowAmountWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: mscale(10),
  },
  signNotYetRead: {
    width: mscale(9),
    height: mscale(9),
    borderRadius: mscale(4.5),
    backgroundColor: theme.colors.rn64testBlue,
  },
});

const SignNotYetRead = () => {
  return <View style={styles.signNotYetRead}></View>;
};

const NotificationRow: React.FC<any> = (props) => {
  const navigation = useNavigation();
  const { notification, showDivider, markAllAsRead } = props;
  const { id, is_read, order, message, created_at } = notification;

  const [displayIsRead, setDisplayIsRead] = useState(is_read);

  const {
    response: {
      notificationRead: notificationReadResponse,
      notificationReadAll: notificationReadAllResponse,
    },
    errors: {
      notificationRead: notificationReadError,
      notificationReadAll: notificationReadAllError,
    },
    submitNotificationRead,
  } = useBuyerStore();

  // *Methods
  const handleReadNotification = (id: string) => {
    setDisplayIsRead(true);
    submitNotificationRead(id);
    navigation.navigate("CreditRemainingInitial");
  };

  // *Effects
  useEffect(() => {
    if (notificationReadAllResponse) {
      setDisplayIsRead(true);
    }
  }, [notificationReadAllResponse]);

  // *JSX
  return (
    <TouchableOpacity onPress={() => handleReadNotification(id)}>
      <View
        style={[
          styles.cardRowWrapper,
          {
            backgroundColor:
              displayIsRead || markAllAsRead
                ? "transparent"
                : theme.colors.faintBlue,
          },
        ]}
      >
        <Image
          source={
            order?.merchant?.logo ? { uri: order.merchant.logo } : creditCard
          }
          resizeMode="contain"
          style={{ width: 45, height: 45 }}
        />

        <View style={styles.cardRowDescription}>
          <StyledText variant="titleTertiary" textAlign="left">
            {capitalizeFirstLetter(message)}
          </StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            {capitalizeFirstLetter(advancedDayjs(created_at).fromNow())}
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          {!displayIsRead && !markAllAsRead && <SignNotYetRead />}
        </View>
      </View>

      {showDivider && (
        <CardListItemDivider
          style={{
            width: "100%",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const UpcomingPaymentsGrouped: React.FC<any> = (props) => {
  const { notifications, markAllAsRead } = props;

  // *JSX
  return (
    <CardListView
      alignSelf="center"
      paddingVertical={0}
      width={"100%"}
      marginTop={3}
      overflow="hidden"
    >
      {notifications ? (
        notifications.map((notification: any, index: number) => {
          return (
            <NotificationRow
              notification={notification}
              markAllAsRead={markAllAsRead}
              showDivider={index !== notifications.length - 1}
            />
          );
        })
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </CardListView>
  );
};

const Notifications = (props: any) => {
  const [groupedNotifications, setGroupedNotifications] = useState<any>(null);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);

  props.navigation.setOptions({
    headerRight: () => {
      const { submitNotificationReadAll } = useBuyerStore();

      const handleMarkAllAsRead = () => {
        setMarkAllAsRead(true);
        submitNotificationReadAll();
      };

      return (
        <TouchableOpacity
          style={{ padding: mscale(3) }}
          onPress={handleMarkAllAsRead}
        >
          <StyledText
            fontFamily={"PoppinsBold"}
            color={theme.colors.buttons.marineBlue}
          >
            Mark all as read
          </StyledText>
        </TouchableOpacity>
      );
    },
  });

  const {
    response: { user },
  } = useUserStore();
  const { countryCode } = user;

  const {
    isLoading: { notifications: notificationsIsLoading },
    response: { notifications: notificationsResponse },
    errors: { notifications: notificationsError },
    fetchNotifications,
    resetStates: resetStatesBuyer,
  } = useBuyerStore();

  // *Effects
  useEffect(() => {
    fetchNotifications(countryCode);

    return () => resetStatesBuyer("notifications");
  }, []);

  useEffect(() => {
    if (notificationsResponse) {
      const grouped = groupNotificationsIntoDays(
        notificationsResponse.notifications
      );
      setGroupedNotifications(grouped);
    }
  }, [notificationsResponse]);

  // *JSX
  return (
    <ScrollView>
      <StyledBox padding={mscale(15)} backgroundColor={theme.colors.background}>
        {groupedNotifications ? (
          Object.keys(groupedNotifications).map((date) => {
            return (
              <>
                <StyledText textAlign="left" variant="titleSecondary">
                  {date}
                </StyledText>
                <UpcomingPaymentsGrouped
                  notifications={groupedNotifications[date]}
                  markAllAsRead={markAllAsRead}
                />
              </>
            );
          })
        ) : (
          <StyledText>loading...</StyledText>
        )}
      </StyledBox>
    </ScrollView>
  );
};

export default Notifications;
