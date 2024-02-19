import { CreateResponsiveStyle, DEVICE_SIZES } from "rn-responsive-styles";
import {
  ActivityIndicator,
  Dimensions,
  View,
  Text,
  ScrollView,
  Platform,
  Linking,
  TouchableOpacity
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import CustomCarousel from "./CustomCarousel";
import { Entypo, EvilIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFoodTruck, updateFoodTruckView } from "../services/FoodTruckServices";
import { LinearGradient } from "expo-linear-gradient";
import HeaderTitleView from "./HeaderTitleView";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";


export default (props) => {

  const params = useSearchParams();

  const { t, i18n } = useTranslation();

  const [showIndicator, setShowIndicator] = useState(false);
  const [academy, setAcademy] = useState(null);
  const [logo, setLogo] = useState(null);

  const router = useRouter();

  const styles = useStyles();

  const { navigation } = props;

  useEffect(() => {

    setShowIndicator(true);

    if (params.academy) {
      getFoodTruck(params.academy)
        .then((response) => {

          setAcademy(response);
          setLogo(findLogoImage(response.images));
          setShowIndicator(false);
          updateFoodTruckView(response.id);
        })
        .catch((error) => {
          router.push("/");
        });
    } else {
      // router.push("/");
    }
  }, [params.academy]);

  const findLogoImage = (images) => {

    return images.find((image) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] === "logo";
    });
  };

  const indicator = showIndicator ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : null;

  const gendersIcons = (gender) => {
    switch (gender) {
      case "MALE":
        return <MaterialCommunityIcons name="gender-male" size={24} color="lightblue" />;
      case "FEMALE":
        return <MaterialCommunityIcons name="gender-female" size={24} color="pink" />;
      case "BOTH":
        return <MaterialCommunityIcons name="gender-male-female" size={24} color="lightgreen" />;
      default:
        return;
    }
  };

  const filterImage = (images) => {
    return images.filter((image) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] !== "logo";
    });
  };

  const openGps = (lat, lng) => {

    if (isWeb) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
      return;
    }

    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
  };

  const openGoogleLocation = (googleLocation) => {

    if (isWeb) {
      window.open(`${googleLocation}`, "_blank");
      return;
    }

    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = scheme + `${googleLocation}`;
    Linking.openURL(url);
  };

  const viewTitle = (academy) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <Image
          source={{ uri: logo }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
          placeholder={require("../assets/allsports-placeholder.png")}
        />
        {
          academy !== null && (
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 15 }}>
              {i18n.language === "ar" ? academy.nameArb : academy.nameEng}
            </Text>
          )
        }
      </View>
    );
  };

  const openPhoneCall = (phoneNumber) => {
    phoneNumber = `+965${phoneNumber}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openInstagram = (instagramAccount) => {

    if (isWeb) {
      window.open(`https://www.instagram.com/${instagramAccount}`, "_blank");
      return;
    }

    Linking.openURL(`instagram://user?username=${instagramAccount}`)
      .catch(() => {
        Linking.openURL(`https://www.instagram.com/${instagramAccount}`);
      });
  };

  return (
    <View style={styles.container}>

      <Stack.Screen
        options={{
          headerLargeTitle: false,
          title: academy && academy.nameEng,
          headerTitle: () => academy !== null && <HeaderTitleView title={academy.nameEng} logo={logo} />
        }}
      />

      {indicator}

      {academy !== null && (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "white",
            width: width
          }}
          contentContainerStyle={{
            alignItems: "center",
            padding: 15
          }}
        >

          {
            filterImage(academy.images).length > 0 && (
              <View
                style={{
                  alignItems: "center"
                }}
              >
                <CustomCarousel
                  images={academy.images}
                />
              </View>
            )
          }

          <View
            style={[styles.informationContainer, { flexDirection: i18n.language === "ar" ? "row-reverse" : "row" }]}
          >
            {gendersIcons(academy.academyInfo.gender)}
            <View
              style={{
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center"
              }}
            >
              <Ionicons name="ios-people-circle-outline" size={24} color="#5cb85c" />
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  i18n.language === "ar" ? { marginEnd: 10 } : { marginStart: 10 }
                ]}
              >
                {t("academy.age", { from: academy.academyInfo.ageFrom, to: academy.academyInfo.ageTo })}
              </Text>
            </View>
            <View
              style={{
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center"
              }}
            >
              <Ionicons name="today-outline" size={24} color="#f0ad4e" />
              <Text
                style={
                  i18n.language === "ar" ? { marginEnd: 10 } : { marginStart: 10 }
                }
              >
                {t("academy.classInMonth", { numberOfClass: academy.academyInfo.daysInMonth })}
              </Text>
            </View>
          </View>

          {/*sport type*/}
          <View
            style={styles.sportTypeContainer}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: i18n.language === "ar" ? "right" : "left"
              }}
            >
              {t("academy.sportType")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: 10
              }}
            >
              <Image
                source={{ uri: academy.SportType.image }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32
                }}
                contentFit={"cover"}
                placeholder={require("../assets/allsports-placeholder.png")}
              />
              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: "bold"
                  },
                  i18n.language === "ar" ? { marginEnd: 10 } : { marginStart: 10 }
                ]}
              >
                {i18n.language === "ar" ? academy.SportType.nameArb : academy.SportType.nameEng}
              </Text>
            </View>
          </View>

          {/*description*/}
          <View
            style={styles.descriptionContainer}
          >
            <Text
              style={[
                {
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10
                },
                i18n.language === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              ]}
            >
              {t("academy.description")}
            </Text>
            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: "normal"
                },
                i18n.language === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              ]}
            >
              {i18n.language === "ar" ? academy.descriptionArb : academy.descriptionEng}
            </Text>
          </View>

          {/*address*/}
          <View
            style={styles.addressContainer}
          >
            <View
              style={{
                flex: 1,
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10
                }}
              >
                {t("academy.address")}
              </Text>
              {/*{*/}
              {/*    academy.address.googleLat !== 0 && academy.address.googleLang !== 0 && (*/}
              {/*        <TouchableOpacity*/}
              {/*            onPress={() => openGps(academy.address.googleLat, academy.address.googleLang)}*/}
              {/*        >*/}
              {/*            <Entypo name="location" size={24} color="#5bc0de"/>*/}
              {/*        </TouchableOpacity>*/}
              {/*    )*/}
              {/*}*/}
              {
                academy.address.googleLocation.length > 0 && (
                  <TouchableOpacity
                    onPress={() => openGoogleLocation(academy.address.googleLocation)}
                  >
                    <Entypo name="location" size={24} color="#5bc0de" />
                  </TouchableOpacity>
                )
              }
            </View>
            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: "normal"
                },
                i18n.language === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              ]}
            >
              {academy.address.address}
            </Text>
          </View>

          <View
            style={styles.contactContainer}
          >
            <TouchableOpacity
              style={[styles.contactItem, { backgroundColor: "#405de6" }]}
              onPress={() => openPhoneCall(academy.academyInfo.phoneNumber)}
            >
              <Ionicons name="call-outline" size={24} color="white" />
            </TouchableOpacity>
            <LinearGradient
              // Button Linear Gradient
              colors={["#405de6", "#5851db", "#833ab4", "#c13584", "#e1306c", "#fd1d1d"]}
              style={styles.contactItem}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openInstagram(academy.academyInfo.instagramAccount)}
              >
                <Entypo name="instagram" size={24} color="white" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/*check later for Google map*/}
          {/*<MapView*/}
          {/*  provider={PROVIDER_GOOGLE}*/}
          {/*  style={{ height: 300, width: width * 0.8, marginTop: 20 }}*/}
          {/*  region={{*/}
          {/*    latitude: academy.address.googleLat,*/}
          {/*    longitude: academy.address.googleLng*/}
          {/*  }}*/}
          {/*/>*/}
        </ScrollView>
      )}

    </View>
  );
}

const useStyles = CreateResponsiveStyle(
  {
    container: {
      flex: 1,
      width: width,
      backgroundColor: "#fff"
    },
    informationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20
    },
    sportTypeContainer: {
      width: "100%",
      marginTop: 20
    },
    descriptionContainer: {
      width: "100%",
      marginTop: 20
    },
    addressContainer: {
      width: "100%",
      marginTop: 20
    },
    contactContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 35
    },
    contactItem: {
      width: width * 0.45,
      height: 50,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center"
    }
  },
  {
    [DEVICE_SIZES.EXTRA_LARGE_DEVICE]: {
      informationContainer: {
        width: "50%"
      },
      sportTypeContainer: {
        width: "50%"
      },
      descriptionContainer: {
        width: "50%"
      },
      addressContainer: {
        width: "50%"
      },
      contactContainer: {
        width: "50%"
      },
      contactItem: {
        width: width * 0.2
      }
    }
  }
);
