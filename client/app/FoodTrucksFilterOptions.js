import {View, Text, Dimensions, TouchableOpacity, FlatList} from "react-native";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {useEffect, useState} from "react";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import i18n from "i18next";

const {width, height} = Dimensions.get("window");

export default (props) => {

    const {foodTrucksFilter, setFoodTruckFilter, setShowFilterOptions} = props;

    const styles = useStyles();

    const [governorates, setGovernorates] = useState([]);

    const [selectedGovernorate, setSelectedGovernorate] = useState(foodTrucksFilter);

    useEffect(() => {

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
            },
            {
                title: {
                    eng: "Dismiss",
                    arb: "إلغاء"
                },
                discard: true
            }
        ]);

    }, []);

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
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            style={[
                                {
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: selectedGovernorate === governoratesMap(index) ? "#0275d8" : "#fff",
                                    marginTop: 10,
                                    padding: 15,
                                    borderColor: "lightgrey",
                                    borderWidth: 1,
                                    borderRadius: 10
                                },
                                item.discard && {backgroundColor: "#d9534f"}
                            ]}
                            onPress={() => {

                                if (item.discard) {
                                    setShowFilterOptions(false);
                                    return;
                                }

                                if (selectedGovernorate === governoratesMap(index)) {
                                    setSelectedGovernorate(null);
                                    setFoodTruckFilter({
                                        filterValue: {...foodTrucksFilter, governorate: null},
                                        isFilterActive: true
                                    });
                                    return;
                                }

                                setSelectedGovernorate(governoratesMap(index));
                                setFoodTruckFilter({
                                    filterValue: {...foodTrucksFilter, governorate: governoratesMap(index)},
                                    isFilterActive: true
                                });
                                setShowFilterOptions(false);
                            }}
                        >
                            <Text
                                style={[
                                    {
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: selectedGovernorate === governoratesMap(index) ? "#fff" : "#0275d8"
                                    },
                                    item.discard && {color: "#fff"}
                                ]}
                            >
                                {i18n.language === "ar" ? item.title.arb : item.title.eng}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
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
