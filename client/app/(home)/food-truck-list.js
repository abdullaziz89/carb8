import {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, Text, TouchableOpacity, View} from "react-native";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {useRouter} from "expo-router";
import {getFoodTrucks} from "../../services/FoodTruckServices";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";
import {DAYS} from "../../utils/Utils";
import {Entypo} from "@expo/vector-icons";
import * as Location from "expo-location";

const {width} = Dimensions.get("window");
const deg2rad = require('deg2rad')

export default (props) => {

    const {t, i18n} = useTranslation();
    const router = useRouter();

    const styles = useStyles();
    const {selectedCuisine, cuisines, searchByName, foodTrucksFilter, isRefreshing} = props;

    const [foodTrucks, setFoodTrucks] = useState([]);
    const [filteredFoodTrucks, setFilteredFoodTrucks] = useState([]);

    const [searching, setSearching] = useState(false);

    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [calculateDistanceLoading, setCalculateDistanceLoading] = useState(true);

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
            if (currentLocation !== null) {
                for (let i = 0; i < filteredFoodTrucks.length; i++) {
                    const item = filteredFoodTrucks[i];
                    getDistance(currentLocation, item.id, item.address.googleLat, item.address.googleLng);
                }
            }
        } else {
            setFilteredFoodTrucks(foodTrucks);
            if (currentLocation !== null) {
                for (let i = 0; i < foodTrucks.length; i++) {
                    const item = foodTrucks[i];
                    getDistance(currentLocation, item.id, item.address.googleLat, item.address.googleLng);
                }
            }
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
                let data = response.map((item) => {
                    return {
                        ...item,
                        distance: 0
                    }
                });

                setFoodTrucks(data);
                setFilteredFoodTrucks(data);

                getLocation()
                    .then((location) => {
                        setCurrentLocation(location.coords);
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i];
                            getDistance(location.coords, item.id, item.address.googleLat, item.address.googleLng);
                        }
                    });
            });
    }

    const getLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
             ("Permission to access location was denied");
        } else {
            return await Location.getCurrentPositionAsync({});
        }
    };

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

    const getDistance = (coords, id, lat, lng) => {

        // return 0;
        // const calculateDistance = async () => {
        //
        //     const KEY = "AIzaSyBGEkayxt-Q_-vDH7jNueDEilauu7w7yQQ"
        //     const startLoc = `${coords.latitude},${coords.longitude}`;
        //     const destinationLoc = `${lat},${lng}`;
        //     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`;
        //     let resp = await fetch(url);
        //     let respJson = await resp.json();
        //     // get how many km the route is
        //     let fullDistance = respJson.routes[0].legs[0].distance.text;
        //     return fullDistance.split(' ')[0];
        // }

        const getDistance = () => {
            const R = 6371; // Radius of the earth in km
            const dLat = deg2rad(lat - coords.latitude);  // deg2rad below
            const dLon = deg2rad(lng - coords.longitude);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(coords.latitude)) * Math.cos(deg2rad(lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c; // Distance in km

            // return without decimals point
            return Math.round(d);
        }

        setFilteredFoodTrucks((prev) => {
            return prev.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        distance: getDistance()
                    }
                }
                return item;
            });
        });
    }

    const foodTruckRenderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.foodTruckItem,
                    item.index !== 0 && {marginTop: 20}
                ]}
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
                        placeholder={require("../../assets/kwft-logo-placeholder.png")}
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
                            {i18n.language === "ar" ? item.descriptionArb : item.descriptionEng}
                        </Text>
                        <View
                            style={{
                                marginTop: 5,
                                width: "100%",
                                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                            }}
                        >
                            <Entypo name="location-pin" size={18} color="#f8b91c"/>
                            <Text
                                style={{textAlign: i18n.language === "ar" ? "right" : "left"}}>{i18n.language === "ar" ? item.address.governorate.nameArb : item.address.governorate.nameEng}</Text>
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
                    <View
                        style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 5,
                            borderRadius: 10
                        }}
                    >
                        {
                            item.distance > 0 ?
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.distance} km
                                </Text> :
                                <ActivityIndicator size="small" color="#000"/>
                        }
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
                    searching ? <Text>No food truck found</Text> : <Text>
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
            justifyContent: "flex-start",
            width: width,
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
