import {useEffect, useState} from "react";
import {View, Text, Dimensions, TouchableOpacity} from "react-native";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {getFoodTrucks} from "../services/FoodTruckServices";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";

const {width} = Dimensions.get("window");

export default (props) => {

    const {t, i18n} = useTranslation();
    const router = useRouter();

    const styles = useStyles();
    const {selectedCuisine, cuisines, searchByName, foodTrucksFilter} = props;

    const [foodTrucks, setFoodTrucks] = useState([]);
    const [filteredFoodTrucks, setFilteredFoodTrucks] = useState([]);

    const [searching, setSearching] = useState(false);

    useEffect(() => {

        getFoodTrucks()
            .then(response => {

                setFoodTrucks(response);
            });

        // setFilteredAcademies(academiesSets);
    }, []);

    useEffect(() => {

        if (selectedCuisine !== null) {

            const filteredFoodTrucks = foodTrucks.filter((item) => {
                return item.Cuisine.id === selectedCuisine;
            });

            setFilteredFoodTrucks(filteredFoodTrucks);
        } else {
            setFilteredFoodTrucks(foodTrucks);
        }
    }, [selectedCuisine, foodTrucks]);

    useEffect(() => {

        if (searchByName !== "") {
            const filteredAcademies = foodTrucks.filter((item) => {
                return item.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
                    item.nameArb.toLowerCase().includes(searchByName.toLowerCase()) ||
                    item.address.governorate.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
                    item.address.governorate.nameArb.toLowerCase().includes(searchByName.toLowerCase()) ||
                    item.Cuisine.nameEng.toLowerCase().includes(searchByName.toLowerCase()) ||
                    item.Cuisine.nameArb.toLowerCase().includes(searchByName.toLowerCase());
            });

            setFilteredFoodTrucks(filteredAcademies);
            setSearching(true);
        } else {
            setFilteredFoodTrucks(foodTrucks);
            setSearching(false);
        }

    }, [searchByName]);

    useEffect(() => {

        if (foodTrucksFilter.isFilterActive) {
            const fa = foodTrucks.filter((foodTruck) => {

                return (
                    (foodTrucksFilter.filterValue.governorate === foodTruck.address.governorate.nameEng || foodTrucksFilter.filterValue.governorate === null)
                );
            });

            setFilteredFoodTrucks(fa);
        }

    }, [foodTrucksFilter]);

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    };

    const academyRenderItem = ({item, index}) => {

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
                        source={{uri: findLogoImage(item.images)}}
                        style={[
                            {
                                width: 64,
                                height: 64,
                                borderRadius: 10
                            }
                        ]}
                        placeholder={require("../assets/kwft-logo-placeholder.png")}
                    />
                    <View
                        style={[
                            {
                                flexDirection: "column",
                                alignItems: "flex-start"
                            },
                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
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
                            {i18n.language === "ar" ? item.Cuisine.nameArb : item.Cuisine.nameEng}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View
            style={styles.container}
        >
            {
                filteredFoodTrucks.length > 0 ?
                    filteredFoodTrucks.map((item, index) => academyRenderItem({item, index})) :
                    searching ? <Text>No academies found</Text> : <Text>
                        {i18n.language === "ar" ? "لا توجد عربات" : "No Food Trucks Found"}
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
            width: width,
            paddingTop: 10,
            paddingBottom: 10,
        },
        academyItem: {
            flexDirection: "column",
            alignItems: "center",
            width: width - 20,
            height: 150,
            padding: 10,
            borderRadius: 10,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 3,
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
