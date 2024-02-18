import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Modal,
  Animated, SafeAreaView, Platform, RefreshControl, I18nManager
} from "react-native";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getHeadersImages } from "../services/HeadersImagesServices";
import { getSportsTypes, updateSportTypeView } from "../services/SportTypesServices";
import AcademyList from "./academy-list";
import { CreateResponsiveStyle, DEVICE_SIZES, useDeviceSize } from "rn-responsive-styles";
import { Feather, FontAwesome } from "@expo/vector-icons";
import AcademiesFilterOptions from "./AcademiesFilterOptions";
import { Image } from "expo-image";
import CustomCarousel from "./CustomCarousel";
import OneSignal from "react-native-onesignal";
import Constants from "expo-constants";
import { forkJoin } from "rxjs";
import "../config/i18n";
import { useTranslation } from "react-i18next";
import HeaderTitleView from "./HeaderTitleView";

const { width, height } = Dimensions.get("window");

export default function Home() {

  const { i18n } = useTranslation();

  const styles = useStyles();

  const [headerImages, setHeaderImages] = useState([]);
  const [sportsTypes, setSportsTypes] = useState([]);
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [searchNameValue, setSearchNameValue] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [academiesFilter, setAcademiesFilter] = useState({
    filterValue: {
      gender: "BOTH",
      ageFrom: "",
      ageTo: "",
      governorate: null
    }, isFilterActive: false
  });

  const [modelViewScale, setModelViewScale] = useState(new Animated.Value(0));

  useEffect(() => {

    // OneSignal.SetLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);
    console.log(Constants.manifest.extra.oneSignalAppId);
    OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log("User response to push notification permission prompt:", response);
    });

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData;
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });

    fetchData(false);

  }, []);

  useEffect(() => {

    if (i18n.language === "en") {
      i18n.changeLanguage("ar")
        .then(() => {
          I18nManager.forceRTL(i18n.language === "ar");
          i18n.dir(i18n.language === "ar" ? "rtl" : "ltr");
        });
    }

  }, []);

  const fetchData = (fromRefreshing) => {
    // setIsRefreshing(true)
    // get sports types
    // getSportsTypes()
    //     .then((data) => {
    //             setSportsTypes(data);
    //             setIsRefreshing(false)
    //         }
    //     );
    //
    // getHeadersImages()
    //     .then((data) => {
    //         setHeaderImages(data);
    //     });

    if (fromRefreshing) {
      setIsRefreshing(true);
    }

    forkJoin([getSportsTypes(), getHeadersImages()])
      .subscribe(([sportsTypes, headersImages]) => {
        setIsRefreshing(false);
        setSportsTypes(sportsTypes);
        setHeaderImages(headersImages);
      });

  };

  useEffect(() => {

    if (showFilterOptions) {
      Animated.timing(modelViewScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(modelViewScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start();
    }

  }, [showFilterOptions]);

  const currentYear = new Date().getFullYear();

  const sportTypeRenderItem = ({ item, index }) => {

    const isFirst = index === 0;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginStart: isFirst ? 10 : 40,
          height: "100%"
        }}
        onPress={() => {
          // set selected sport type
          updateSportTypeView(item.id);
          setSelectedSportType(item.id);
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            marginBottom: 15
          }}
          contentFit={"cover"}
          placeholder={require("../assets/allsports-placeholder.png")}
        />
        <Text>{i18n.language === "ar" ? item.nameArb : item.nameEng}</Text>
      </TouchableOpacity>
    );
  };

  const modelView = () => {

    const color = modelViewScale.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(255,255,255,0.5)", "rgba(0,0,0,0.5)"]
    });

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterOptions}
      >
        <Animated.View
          style={[styles.filterOptionsModal, { backgroundColor: color }]}
        >
          <AcademiesFilterOptions
            setShowFilterOptions={setShowFilterOptions}
            academiesFilter={academiesFilter}
            setAcademiesFilter={setAcademiesFilter}
          />
        </Animated.View>
      </Modal>
    );
  };

  const rightHeader = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginEnd: 10,
          height: "100%"
        }}
        onPress={() => {
          i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
        }}
      >
        <FontAwesome
          name="language"
          size={24}
          color="#5bc0de"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        width: width
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          width: width
        }}
        contentContainerStyle={{
          alignItems: "center"
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchData(true)}
          />
        }
      >
        {/* Use the `Screen` component to configure the layout. */}
        <Stack.Screen
          options={{
            headerLargeTitle: true,
            title: "All Sports",
            headerTitle: () => Platform.OS !== "ios" &&
              <HeaderTitleView title={"All Sports"} logo={require("../assets/icon.png")} localLogo={true} />,
            headerRight: () => rightHeader(),
            headerBackTitleVisible: false
          }}
        />

        <CustomCarousel images={headerImages} clickable={true} />

        <View
          style={styles.sportTypesHeaderHolder}
        >
          <View
            style={styles.sportTypesHeader}
          >
            <View
              style={{
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                {i18n.language === "ar" ? "الرياضات" : "Sports Types"}
              </Text>
              {
                selectedSportType !== null &&
                <TouchableOpacity
                  style={{
                    marginStart: 20
                  }}
                  onPress={() => {
                    // clear selected sport type
                    setSelectedSportType(null);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#d9534f"
                    }}
                  >
                    {i18n.language === "ar" ? "إلغاء" : "Clear"}
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
          <FlatList
            style={{
              marginTop: 20
            }}
            contentContainerStyle={{
              padding: 10
              // flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            }}
            data={sportsTypes}
            renderItem={sportTypeRenderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    width: width,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "lightgray"
                    }}
                  >
                    {i18n.language === "ar" ? "لا يوجد رياضات" : "No Sports"}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View
          style={[styles.academiesHeaderHolder, { flexDirection: i18n.language === "ar" ? "row-reverse" : "row" }]}
        >
          <Text
            style={styles.academiesHeader}
          >
            {i18n.language === "ar" ? "الأكاديميات" : "Academies"}
          </Text>
          {
            sportsTypes.length > 0 && <TouchableOpacity
              onPress={() => {
                setShowFilterOptions(true);
              }}
            >
              <Feather name="filter" size={24} color="#5bc0de" />
            </TouchableOpacity>
          }
        </View>
        {
          sportsTypes.length > 0 ?
            <View
              style={{
                flex: 1,
                alignItems: "center",
                marginTop: 30
              }}
            >
              <AcademyList
                searchByName={searchNameValue}
                selectedSportType={selectedSportType}
                sportsTypes={sportsTypes}
                academiesFilter={academiesFilter}
              />
              {modelView()}
            </View> :
            <View
              style={{
                flex: 1,
                alignItems: "center",
                marginTop: 80,
                width: width
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "lightgray",
                  textAlign: "center"
                }}
              >
                {i18n.language === "ar" ? "لا يوجد أكاديميات" : "No Academies"}
              </Text>
            </View>
        }
        {
          Platform.OS === "web" &&
          <View
            style={{
              height: 80,
              marginTop: 100,
              backgroundColor: "lightgray",
              width: width,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>All rights reserved © All Sports Club {currentYear}</Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 14,
                fontWeight: "bold",
                color: "rgba(250,32,32,0.4)"
              }}
            >
              made &#x2765;
              <Link
                href="https://abdullaziz.me"
                hrefAttrs={{
                  target: "_blank"
                }}
              >
                iDeveloprs Co.
              </Link>
            </Text>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = CreateResponsiveStyle(
  {
    sportTypesHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: width,
      paddingStart: 10,
      paddingEnd: 10
    },
    sportTypesHeaderHolder: {
      width: width,
      height: 160,
      marginTop: 30
    },
    academiesHeaderHolder: {
      justifyContent: "space-between",
      alignItems: "center",
      width: width,
      marginTop: 25,
      marginBottom: 20,
      paddingStart: 10,
      paddingEnd: 10
    },
    academiesHeader: {
      fontSize: 20,
      fontWeight: "bold"
    },
    filterOptionsModal: {
      width: width,
      height: height,
      alignSelf: "center",
      justifyContent: "flex-end",
      margin: 0
    }
  },
  {
    [DEVICE_SIZES.EXTRA_LARGE_DEVICE]: {
      sportTypesHeader: {
        width: "50%"
      },
      sportTypesHeaderHolder: {
        alignItems: "center"
      },
      academiesHeaderHolder: {
        width: width * 0.5
      },
      filterOptionsModal: {
        width: width * 0.75
      }
    },
    [DEVICE_SIZES.LARGE_DEVICE]: {
      sportTypesHeader: {
        width: "50%"
      },
      sportTypesHeaderHolder: {
        alignItems: "center"
      },
      academiesHeaderHolder: {
        width: width * 0.5
      },
      filterOptionsModal: {
        width: width * 0.4
      }
    }
  }
);
