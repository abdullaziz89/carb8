import { View, Text, Dimensions, TouchableOpacity, FlatList } from "react-native";
import { CreateResponsiveStyle, DEVICE_SIZES } from "rn-responsive-styles";
import { useEffect, useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "i18next";

const { width, height } = Dimensions.get("window");

export default (props) => {

  // {filterFor: null, filterValue: null, isFilterActive: false}

  const { setShowFilterOptions, academiesFilter, setAcademiesFilter } = props;

  const styles = useStyles();

  const [genders, setGenders] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [ageRange, setAgeRange] = useState([4, 45]);

  const [selectedGender, setSelectedGender] = useState(academiesFilter.filterValue.gender);
  const [selectedGovernorate, setSelectedGovernorate] = useState(academiesFilter.filterValue.governorate);

  useEffect(() => {

    // set genders options
    setGenders([
      {
        title: {
          eng: "Male",
          arb: "ذكور"
        },
        icon: () => <MaterialCommunityIcons name="gender-male" size={24} color="lightblue" />
      },
      {
        title: {
          eng: "Female",
          arb: "إناث"
        },
        icon: () => <MaterialCommunityIcons name="gender-female" size={24} color="pink" />
      }
    ]);

    setGovernorates([
      {
        title: {
          eng: "Capital",
          arb: "العاصمة"
        }
      },
      {
        title: {
          eng: "Farwaniya",
          arb: "الفروانية"
        }
      },
      {
        title: {
          eng: "Mubarak Al Kabeer",
          arb: "مبارك الكبير"
        }
      },
      {
        title: {
          eng: "Ahmadi",
          arb: "الأحمدي"
        }
      },
      {
        title: {
          eng: "Hawalli",
          arb: "حولي"
        }
      },
      {
        title: {
          eng: "Jahra",
          arb: "الجهراء"
        }
      }
    ]);

  }, []);

  const gendersMap = (index) => {
      switch (index) {
          case 0:
            return 'MALE'
          case 1:
            return 'FEMALE'
          default:
            return 'BOTH'
      }
  };

  const governoratesMap = (index) => {
      switch (index) {
          case 0:
            return 'Capital'
          case 1:
            return 'Farwaniya'
          case 2:
            return 'Mubarak Al Kabeer'
          case 3:
            return 'Ahmadi'
          case 4:
            return 'Hawalli'
          case 5:
            return 'Jahra'
          default:
            return 'Capital'
      }
  }

  return (
    <View
      style={styles.container}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={{
            alignSelf: "flex-start"
          }}
          onPress={() => setShowFilterOptions(false)}
        >
          <AntDesign name="closecircleo" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>

      <View>
        <Text
          style={styles.title}
        >
          {i18n.language === "ar" ? "الجنس" : "Genders"}
        </Text>
        <FlatList
          style={{
            marginTop: 10
          }}
          contentContainerStyle={{
            padding: 10,
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row"
          }}
          data={genders}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                padding: 10,
                backgroundColor: selectedGender === gendersMap(index) ? "#0275d8" : "#fff",
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 10
              }}
              onPress={() => {

                if (selectedGender === gendersMap(index)) {
                  setSelectedGender('BOTH');
                  setAcademiesFilter({
                    filterValue: { ...academiesFilter.filterValue, gender: 'BOTH' },
                    isFilterActive: true
                  });
                  return;
                }

                setSelectedGender(gendersMap(index));
                setAcademiesFilter({
                  filterValue: { ...academiesFilter.filterValue, gender: gendersMap(index) },
                  isFilterActive: true
                });
              }}
            >
              {item.icon()}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: selectedGender === gendersMap(index) ? "#fff" : "#0275d8",
                  marginLeft: 10
                }}
              >
                {i18n.language === "ar" ? item.title.arb : item.title.eng}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
        />
      </View>

      {/*<View*/}
      {/*    style={styles.ageHolder}*/}
      {/*>*/}
      {/*    <Text*/}
      {/*        style={[styles.title]}*/}
      {/*    >*/}
      {/*        Age*/}
      {/*    </Text>*/}
      {/*    <View*/}
      {/*        style={styles.ageRangeHolder}*/}
      {/*    >*/}
      {/*        <View*/}
      {/*            style={styles.ageRangeSubtitle}*/}
      {/*        >*/}
      {/*            <Text>From: {ageRange[0]}</Text>*/}
      {/*            <Text>To: {ageRange[1]}</Text>*/}
      {/*        </View>*/}
      {/*        <MultiSlider*/}
      {/*            containerStyle={{*/}
      {/*                marginTop: 10*/}
      {/*            }}*/}
      {/*            isMarkersSeparated={true}*/}
      {/*            values={[4, 45]}*/}
      {/*            min={4}*/}
      {/*            max={45}*/}
      {/*            step={1}*/}
      {/*            allowOverlap={false}*/}
      {/*            snapped={true}*/}
      {/*            onValuesChange={(values) => setAgeRange(values)}*/}
      {/*        />*/}
      {/*    </View>*/}
      {/*</View>*/}

      <View>
        <Text
          style={styles.title}
        >
          {i18n.language === "ar" ? "المحافظات" : "Governorates"}
        </Text>
        <FlatList
          contentContainerStyle={{
            padding: 10,
            marginTop: 10
          }}
          data={governorates}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: selectedGovernorate === governoratesMap(index) ? "#0275d8" : "#fff",
                marginRight: 10,
                padding: 15,
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 10
              }}
              onPress={() => {

                if (selectedGovernorate === governoratesMap(index)) {
                  setSelectedGovernorate(null);
                  setAcademiesFilter({
                    filterValue: { ...academiesFilter.filterValue, governorate: null },
                    isFilterActive: true
                  });
                  return;
                }

                setSelectedGovernorate(governoratesMap(index));
                setAcademiesFilter({
                  filterValue: { ...academiesFilter.filterValue, governorate: governoratesMap(index) },
                  isFilterActive: true
                });
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: selectedGovernorate === governoratesMap(index) ? "#fff" : "#0275d8"
                }}
              >
                {i18n.language === "ar" ? item.title.arb : item.title.eng}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const useStyles = CreateResponsiveStyle(
  {
    container: {
      height: (height * 0.60),
      backgroundColor: "#fff",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000000",
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowOpacity: 0.10,
      shadowRadius: 3,
      elevation: 20
    },
    title: {
      fontSize: 16,
      fontWeight: "bold"
    },
    ageHolder: {
      width: width - 20,
      flexDirection: "column",
      justifyContent: "space-around",
      marginTop: 10
    },
    ageRangeHolder: {
      width: width,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    },
    ageRangeSubtitle: {
      width: width * 0.7,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10
    }
  },
  {
    [DEVICE_SIZES.EXTRA_LARGE_DEVICE]: {
      ageHolder: {
        width: width * 0.35
      },
      ageRangeHolder: {
        width: width * 0.35
      },
      ageRangeSubtitle: {
        width: width * 0.35
      }
    },
    [DEVICE_SIZES.LARGE_DEVICE]: {
      ageHolder: {
        width: width * 0.35
      },
      ageRangeHolder: {
        width: width * 0.35
      },
      ageRangeSubtitle: {
        width: width * 0.35
      }
    }
  }
);
