import { useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { CreateResponsiveStyle, DEVICE_SIZES } from "rn-responsive-styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAcademies } from "../services/AcademiesServices";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default (props) => {

  const { t, i18n } = useTranslation();
  const router = useRouter();

  const styles = useStyles();
  const { selectedSportType, sportsTypes, searchByName, academiesFilter } = props;

  const [academies, setAcademies] = useState([]);
  const [filteredAcademies, setFilteredAcademies] = useState([]);

  const [searching, setSearching] = useState(false);

  useEffect(() => {

    getAcademies()
      .then(response => {

        setAcademies(response);
      });

    // setFilteredAcademies(academiesSets);
  }, []);

  useEffect(() => {

    if (selectedSportType !== null) {

      const filteredAcademies = academies.filter((item) => {
        return item.SportType.id === selectedSportType;
      });

      setFilteredAcademies(filteredAcademies);
    } else {
      setFilteredAcademies(academies);
    }
  }, [selectedSportType, academies]);

  useEffect(() => {

    if (searchByName !== "") {
      const filteredAcademies = academies.filter((item) => {
        return item.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
          item.nameArb.toLowerCase().includes(searchByName.toLowerCase()) ||
          item.academyInfo.gender.toLowerCase() === searchByName.toLowerCase() ||
          item.address.governorate.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
          item.address.governorate.nameArb.toLowerCase().includes(searchByName.toLowerCase()) ||
          item.SportType.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
          item.SportType.nameArb.toLowerCase().includes(searchByName.toLowerCase());
      });

      setFilteredAcademies(filteredAcademies);
      setSearching(true);
    } else {
      setFilteredAcademies(academies);
      setSearching(false);
    }

  }, [searchByName]);

  useEffect(() => {

    if (academiesFilter.isFilterActive) {
      const fa = academies.filter((academy) => {

        return (
          (academiesFilter.filterValue.gender === academy.academyInfo.gender || academiesFilter.filterValue.gender === "BOTH") &&
          // (academy.ageFrom >= academiesFilter.filterValue.ageFrom || academiesFilter.filterValue.ageFrom !== '') ||
          // (academy.ageTo <= academiesFilter.filterValue.ageTo || academiesFilter.filterValue.ageTo !== '')
          (academiesFilter.filterValue.governorate === academy.address.governorate.nameEng || academiesFilter.filterValue.governorate === null)
        );
      });

      setFilteredAcademies(fa);
    }

  }, [academiesFilter]);

  const findLogoImage = (images) => {

    return images.find((image) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] === "logo";
    });
  };

  const academyRenderItem = ({ item, index }) => {

    return (
      <TouchableOpacity
        key={index}
        style={styles.academyItem}
        onPress={() => {
          router.push(`/${item.id}`);
        }}
      >
        <View
          style={{
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            justifyContent: "flex-start",
            width: "100%"
          }}
        >
          <Image
            source={{ uri: findLogoImage(item.images) }}
            style={[
              {
                width: 64,
                height: 64,
                borderRadius: 10
              }
            ]}
            placeholder={require("../assets/allsports-placeholder.png")}
          />
          <View
            style={[
              {
                flexDirection: "column",
                alignItems: "flex-start"
              },
              i18n.language === "ar" ? { marginEnd: 10 } : { marginStart: 10 }
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5
              }}
            >
              {i18n.language === "ar" ? item.nameArb : item.nameEng}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "normal",
                marginTop: 5,
                color: "lightgrey",
                width: "100%",
                textAlign: i18n.language === "ar" ? "right" : "left"
              }}
            >
              {i18n.language === "ar" ? item.SportType.nameArb : item.SportType.nameEng}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 30
          }}
        >
          {gendersIcons(item.academyInfo.gender)}
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
              {/*from {item.academyInfo.ageFrom} to {item.academyInfo.ageTo}*/}
              {t("academy.age", { from: item.academyInfo.ageFrom, to: item.academyInfo.ageTo })}
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
              {/*{item.academyInfo.daysInMonth} class in month*/}
              {t("academy.classInMonth", { numberOfClass: item.academyInfo.daysInMonth })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <View
      style={styles.container}
    >
      {
        filteredAcademies.length > 0 ?
          filteredAcademies.map((item, index) => academyRenderItem({ item, index })) :
          searching ? <Text>No academies found</Text> : <Text>
            {i18n.language === "ar" ? "لا يوجد أكاديميات" : "No academies"}
          </Text>
      }
    </View>
  );
}

const useStyles = CreateResponsiveStyle(
  {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: width
    },
    academyItem: {
      flexDirection: "column",
      alignItems: "center",
      width: width - 20,
      height: 150,
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "lightgray"
    }
  },
  {
    [DEVICE_SIZES.EXTRA_LARGE_DEVICE]: {
      container: {
        justifyContent: "space-around",
        flexWrap: "wrap",
        flexDirection: "row",
        padding: 8
      },
      academyItem: {
        width: width / 3.25,
        alignSelf: "flex-start"
      }
    },
    [DEVICE_SIZES.LARGE_DEVICE]: {
      container: {
        justifyContent: "space-around",
        flexWrap: "wrap",
        flexDirection: "row",
        padding: 8
      },
      academyItem: {
        width: width / 3.25,
        alignSelf: "flex-start"
      }
    }
  }
);
