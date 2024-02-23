import {useEffect, useState} from "react";
import {View, Text, Dimensions, TouchableOpacity} from "react-native";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {useRouter} from "expo-router";
import {getFoodTrucks} from "../services/FoodTruckServices";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";
import {DAYS} from "../utils/Utils";
import {Entypo, EvilIcons} from "@expo/vector-icons";

const {width} = Dimensions.get("window");

export default (props) => {

    const {t, i18n} = useTranslation();
    const router = useRouter();

    const styles = useStyles();
    const {selectedCuisine, cuisines, searchByName, foodTrucksFilter, isRefreshing} = props;

    const [foodTrucks, setFoodTrucks] = useState([]);
    const [filteredFoodTrucks, setFilteredFoodTrucks] = useState([]);

    const [searching, setSearching] = useState(false);

    useEffect(() => {

        fetchFoodTrucks();
    }, []);

    useEffect(() => {

            if (isRefreshing) {
                fetchFoodTrucks();
            }
    }, [isRefreshing]);

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

    const fetchFoodTrucks = async () => {
        await getFoodTrucks()
            .then(response => {
                setFoodTrucks(response);
            });
    }

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    };

    const checkClosed = (foodTruckWorkingDay) => {
        let isClosed = false;
        const day = new Date().getDay();
        for (let i = 0; i < foodTruckWorkingDay.length; i++) {
            // get hour from string date and set to variable
            const workingFrom = foodTruckWorkingDay[i].workingFrom;
            const workingTo = foodTruckWorkingDay[i].workingTo;

            if (foodTruckWorkingDay[i].day === 'All Days' || 'Week Days' || 'Weekend') {
                // check now time if between start and end time
                isClosed = !(workingFrom <= new Date().getHours() && (workingTo) >= new Date().getHours());
            } else {
                // check if today day is equal to food truck working day then check the time
                isClosed = !(DAYS[day].name === foodTruckWorkingDay[i].day && workingFrom <= new Date().getHours() && workingTo >= new Date().getHours());
            }
        }
        return isClosed;
    }

    const foodTruckRenderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.foodTruckItem}
                onPress={() => {
                    router.push(`/${item.id}`);
                }}
            >
                <View
                    style={{
                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                        justifyContent: "flex-start",
                        width: "100%",
                        height: "100%",
                        padding: 12,
                    }}
                >
                    <Image
                        source={{uri: findLogoImage(item.images)}}
                        style={[
                            {
                                width: 120,
                                height: 120,
                                borderRadius: 10
                            }
                        ]}
                        placeholder={require("../assets/kwft-logo-placeholder.png")}
                    />
                    <View
                        style={[
                            {
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-start",

                            },
                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    marginTop: 5,
                                    width: "100%",
                                },
                                i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"}
                            ]}
                        >
                            {i18n.language === "ar" ? item.nameArb : item.nameEng}
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "normal",
                                marginTop: 5,
                                width: "100%",
                                textAlign: i18n.language === "ar" ? "right" : "left",
                            }}
                            numberOfLines={3}
                        >
                            {i18n.language === "ar" ? item.descriptionEng : item.descriptionArb}
                        </Text>
                        <View
                            style={{
                                marginTop: 5,
                                width: "100%",
                                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                            }}
                        >
                            <Entypo name="location-pin" size={18} color="#f8b91c"/>
                            <Text style={{textAlign: i18n.language === "ar" ? "right" : "left"}}>{i18n.language === "ar" ? item.address.governorate.nameArb : item.address.governorate.nameEng}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f8b91c",
                            padding: 5,
                            borderRadius: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                            }}
                        >
                            {checkClosed(item.foodTruckInfo.FoodTruckWorkingDay) ? "CLOSED" : "OPEN"}
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
                    filteredFoodTrucks.map((item, index) => foodTruckRenderItem({item, index})) :
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
            paddingBottom: 10,
        },
        foodTruckItem: {
            flexDirection: "column",
            alignItems: "center",
            width: width - 20,
            height: 150,
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
            foodTruckItem: {
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
            foodTruckItem: {
                width: width / 3.25,
                alignSelf: "flex-start"
            }
        }
    }
);
