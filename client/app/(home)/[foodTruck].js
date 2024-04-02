import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {
    ActivityIndicator,
    Dimensions,
    View,
    Text,
    ScrollView,
    Platform,
    Linking,
    TouchableOpacity, FlatList, SectionList
} from "react-native";
import {Stack, useNavigation, useRouter, useLocalSearchParams} from "expo-router";
import {useEffect, useRef, useState} from "react";
import {Image} from "expo-image";
import CustomCarousel from "./CustomCarousel";
import {Entypo, EvilIcons, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {getFoodTruck, updateFoodTruckView} from "../../services/FoodTruckServices";
import {LinearGradient} from "expo-linear-gradient";
import HeaderTitleView from "./HeaderTitleView";
import {useTranslation} from "react-i18next";
import TextWithFont from "../../component/TextWithFont";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import deg2rad from "deg2rad";
import * as Location from "expo-location";
import {useAppStateStore} from "../../store/app-store";
import {MotiView, useDynamicAnimation} from "moti";

const {width} = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default (props) => {

    const {quantityInCart, removeCartItem, addCartItem, itemQuantityInCart, getCart} = useAppStateStore()
    const params = useLocalSearchParams();

    const {t, i18n} = useTranslation();

    const [showIndicator, setShowIndicator] = useState(false);
    const [foodTruck, setFoodTruck] = useState(null);
    const [logo, setLogo] = useState(null);
    const listScrollPosition = useSharedValue(0);
    const [currentLocation, setCurrentLocation] = useState(null);
    const contactViewRef = useRef(null);


    // create a state for quantityInCart
    const [quantityCart, setQuantityCart] = useState(quantityInCart());

    const router = useRouter();

    const styles = useStyles();

    const navigation = useNavigation();

    const checkoutAnimStyle = useDynamicAnimation(() => {
        return {
            opacity: 1,
            translateY: 60,
        }
    });

    const [foods, setFoods] = useState([
        {
            title: "Burger",
            data: [
                {
                    id: 1,
                    name: "Cheese Burger",
                    price: 1.5,
                    image: "https://s23209.pcdn.co/wp-content/uploads/2022/07/220602_DD_The-Best-Ever-Cheeseburger_267.jpg",
                    quantity: 0
                },
                {
                    id: 2,
                    name: "Double Cheese Burger",
                    price: 2.5,
                    image: "https://s7d1.scene7.com/is/image/mcdonalds/Header_DoubleCheeseburger_832x472:1-3-product-tile-desktop?wid=763&hei=472&dpr=off",
                    quantity: 0,
                }
            ]
        },
        {
            title: "Pizza",
            data: [
                {
                    id: 3,
                    name: "Cheese Pizza",
                    price: 2.5,
                    image: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
                    quantity: 0
                },
                {
                    id: 4,
                    name: "Pepperoni Pizza",
                    price: 3.5,
                    image: "https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-1024x682-583b275444104ef189d693a64df625da.jpg",
                    quantity: 0
                }
            ]
        },
        {
            title: "Drinks",
            data: [
                {
                    id: 5,
                    name: "Pepsi",
                    price: 0.5,
                    image: "https://cdnprod.mafretailproxy.com/sys-master-root/he9/hd8/17543283703838/30203_main.jpg_480Wx480H",
                    quantity: 0
                },
                {
                    id: 6,
                    name: "Coca Cola",
                    price: 0.5,
                    image: "https://m.media-amazon.com/images/I/51v8nyxSOYL._SL1500_.jpg",
                    quantity: 0
                }
            ]
        },
        {
            title: "Desserts",
            data: [
                {
                    id: 7,
                    name: "Chocolate Cake",
                    price: 2.5,
                    image: "https://scientificallysweet.com/wp-content/uploads/2020/09/IMG_4087-feature-2.jpg",
                    quantity: 0
                },
                {
                    id: 8,
                    name: "Cheese Cake",
                    price: 3.5,
                    image: "https://sugarspunrun.com/wp-content/uploads/2019/01/Best-Cheesecake-Recipe-2-1-of-1-4-500x500.jpg",
                    quantity: 0
                }
            ]
        }
    ]);

    useEffect(() => {

        setShowIndicator(true);

        if (params.foodTruck) {
            getFoodTruck(params.foodTruck)
                .then((response) => {
                    setFoodTruck(response);
                    (findLogoImage(response.images))
                    setLogo(findLogoImage(response.images));
                    setShowIndicator(false);
                    updateFoodTruckView(response.id);
                    getLocation()
                })
                .catch((error) => {
                    router.push("/");
                });
        } else {
            // router.push("/");
        }
    }, [params.foodTruck]);

    useEffect(() => {
        // update item quantity in food according to the cart
        setFoods((prevFoods) => {
            return prevFoods.map((food) => {
                return {
                    ...food,
                    data: food.data.map((item) => {
                        return {
                            ...item,
                            quantity: itemQuantityInCart(item.id)
                        }
                    })
                }
            });
        });
        setQuantityCart(quantityInCart());
    }, [getCart()]);

    useEffect(() => {
        if (quantityCart > 0) {
            checkoutAnimStyle.animateTo((current) => ({
                ...current,
                translateY: 0,
            }));
        } else {
            checkoutAnimStyle.animateTo((current) => ({
                ...current,
                translateY: 60,
            }));
        }
    }, [quantityCart]);

    // const reduceFoodItemQuantity = (itemId) => {
    //     const itemExistsInFoods = foods.some((food) => food.id === itemId);
    //
    //     if (!itemExistsInFoods) {
    //         console.error(`Item with id ${itemId} not found in foods array.`);
    //         return;
    //     }
    //
    //     setFoods((prevFoods) => {
    //         return prevFoods.map((food) => {
    //             return {
    //                 ...food,
    //                 data: food.data.map((item) => {
    //                     if (item.id === itemId) {
    //                         return {...item, quantity: item.quantity - 1};
    //                     }
    //                     return item;
    //                 })
    //             }
    //         });
    //     });
    //
    //     removeCartItem(itemId);
    // };

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    };

    const indicator = showIndicator ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large" color="#f8b91c"/>
        </View>
    ) : null;

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

    const viewTitle = (foodTruck) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}
            >
                <Image
                    source={{uri: logo}}
                    style={{width: 50, height: 50, borderRadius: 25}}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                {
                    foodTruck !== null && (
                        <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 15}}>
                            {i18n.language === "ar" ? foodTruck.nameArb : foodTruck.nameEng}
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

        if (instagramAccount.includes("http")) {
            Linking.openURL(instagramAccount);
            return;
        }

        if (isWeb) {
            window.open(`https://www.instagram.com/${instagramAccount}`, "_blank");
            return;
        }

        Linking.openURL(`instagram://user?username=${instagramAccount}`)
            .catch(() => {
                Linking.openURL(`https://www.instagram.com/${instagramAccount}`);
            });
    };

    const animationView = useAnimatedStyle(() => {
        // change view height when sectionsList scroll reduce 61
        const height = interpolate(listScrollPosition.value > 100 ? listScrollPosition.value : 0, [0, 1], [1, 0]);
        return {
            height
        }
    });

    const getLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            ("Permission to access location was denied");
        } else {
            setCurrentLocation(await Location.getCurrentPositionAsync({}));
        }
    };

    const getDistance = () => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(foodTruck.address.googleLat - currentLocation.coords.latitude);  // deg2rad below
        const dLon = deg2rad(foodTruck.address.googleLng - currentLocation.coords.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(currentLocation.coords.latitude)) * Math.cos(deg2rad(dLat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km

        // return without decimals point
        return Math.round(d);
    }

    const ListHeaderView = () => {

        return (
            <View
                style={
                    {
                        width: "100%",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        backgroundColor: "#f8b91c",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        paddingTop: Platform.OS === "ios" ? 50 : 25,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        shadowRadius: 10,
                        shadowColor: "black",
                        shadowOffset: {width: 0, height: 0},
                        shadowOpacity: 0.5,
                        elevation: 10
                    }
                }
            >
                {
                    filterImage(foodTruck.images).length > 0 && (
                        <View
                            style={{
                                alignItems: "center"
                            }}
                        >
                            <CustomCarousel
                                images={foodTruck.images}
                            />
                        </View>
                    )
                }

                {/*food truck*/}
                <View
                    style={styles.foodTruckContainer}
                >
                    <View
                        style={{
                            width: "100%",
                            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Image
                            source={{uri: logo}}
                            style={{
                                width: 92,
                                height: 92,
                                borderRadius: 46,
                                backgroundColor: "white",
                                padding: 5,
                            }}
                            shape={"circle"}
                            contentFit={"cover"}
                            placeholder={require("../../assets/kwft-logo-placeholder.png")}
                        />
                        <View
                            style={{
                                width: "50%",
                                flexDirection: "column",
                                alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                                justifyContent: "center",
                                marginStart: 5
                            }}
                        >
                            <TextWithFont
                                text={i18n.language === "ar" ? foodTruck.nameArb : foodTruck.nameEng}
                                style={[
                                    {
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    },
                                    i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                ]}
                            />
                            <TextWithFont
                                text={i18n.language === "ar" ? foodTruck.descriptionArb : foodTruck.descriptionEng}
                                style={[
                                    {
                                        fontSize: 16,
                                        fontWeight: "normal"
                                    },
                                    i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                    i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                ]}
                            />
                            {
                                currentLocation ? (
                                    <TextWithFont
                                        text={`${getDistance()} KM`}
                                        style={[
                                            {
                                                fontSize: 16,
                                                fontWeight: "normal",
                                                color: "#fff"
                                            },
                                            i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                        ]}
                                    />
                                ) : (
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                        style={i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}}
                                    />
                                )
                            }
                        </View>
                    </View>
                </View>

                {/*address*/}
                {/*<View*/}
                {/*    style={styles.addressContainer}*/}
                {/*>*/}
                {/*    <View*/}
                {/*        style={{*/}
                {/*            flex: 1,*/}
                {/*            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",*/}
                {/*            alignItems: "center",*/}
                {/*            justifyContent: "space-between"*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <Text*/}
                {/*            style={{*/}
                {/*                fontSize: 18,*/}
                {/*                fontWeight: "bold",*/}
                {/*                marginBottom: 10*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            {t("foodTruck.address")}*/}
                {/*        </Text>*/}
                {/*        /!*{*!/*/}
                {/*        /!*    foodTruck.address.googleLat !== 0 && foodTruck.address.googleLang !== 0 && (*!/*/}
                {/*        /!*        <TouchableOpacity*!/*/}
                {/*        /!*            onPress={() => openGps(foodTruck.address.googleLat, foodTruck.address.googleLang)}*!/*/}
                {/*        /!*        >*!/*/}
                {/*        /!*            <Entypo name="location" size={24} color="#5bc0de"/>*!/*/}
                {/*        /!*        </TouchableOpacity>*!/*/}
                {/*        /!*    )*!/*/}
                {/*        /!*}*!/*/}
                {/*    </View>*/}
                {/*    <Text*/}
                {/*        style={[*/}
                {/*            {*/}
                {/*                fontSize: 16,*/}
                {/*                fontWeight: "normal"*/}
                {/*            },*/}
                {/*            i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"}*/}
                {/*        ]}*/}
                {/*    >*/}
                {/*        {foodTruck.address.address}*/}
                {/*    </Text>*/}
                {/*</View>*/}

                <View
                    style={styles.contactContainer}
                >
                    {
                        foodTruck.address.googleLocation.length > 0 && (
                            <TouchableOpacity
                                style={styles.contactItem}
                                onPress={() => openGoogleLocation(foodTruck.address.googleLocation)}
                            >
                                <EvilIcons name="location" size={28} color="white"/>
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => openPhoneCall(foodTruck.foodTruckInfo.phoneNumber)}
                    >
                        <Ionicons name="call-outline" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => openInstagram(foodTruck.foodTruckInfo.instagramAccount)}
                    >
                        <Entypo name="instagram" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: foodTruck && foodTruck.nameEng,
                    headerTitle: () => foodTruck !== null &&
                        <HeaderTitleView title={foodTruck.nameEng} logo={logo} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    },
                    headerTintColor: "#fff",
                    headerBackTitleVisible: false,
                }}
            />

            {indicator}

            {foodTruck !== null && foods !== null && (
                <SectionList
                    data={foods}
                    sections={foods}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={({section: {title}}) => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    backgroundColor: "#efefef",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {title}
                                </Text>
                            </View>
                        );
                    }}
                    renderItem={({item}) => {
                        return (
                            <View
                                style={[
                                    {
                                        width: "100%",
                                        backgroundColor: "white",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingHorizontal: 20,
                                        paddingVertical: 20,
                                    },
                                    i18n.language === "ar" ? {flexDirection: "row-reverse"} : {flexDirection: "row"},
                                    item.quantity > 0 ? {
                                        borderLeftWidth: 5,
                                        borderLeftStyle: "solid",
                                        borderLeftColor: "#f8b91c",
                                    } : {}
                                ]}
                            >
                                <Image
                                    source={{uri: item.image}}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 20
                                    }}
                                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                                    contentFit={"contain"}
                                />
                                <View
                                    style={[
                                        {
                                            width: "50%",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        },
                                        i18n.language === "ar" ? {alignItems: "flex-end"} : {alignItems: "flex-start"}
                                    ]}
                                >
                                    <TextWithFont
                                        text={item.name}
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "normal",
                                            marginStart: 10
                                        }}
                                    />
                                    <TextWithFont
                                        text={`${item.price} KD`}
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "normal",
                                            marginStart: 10
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        borderWidth: 1,
                                        borderColor: "#c9c9c9",
                                        borderRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: 10,
                                        }}
                                    >
                                        {
                                            item.quantity > 0 ? (
                                                <View
                                                    style={{
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "space-around",
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => addCartItem(item)}
                                                    >
                                                        <MaterialCommunityIcons name="plus-circle" size={24}
                                                                                color="#f8b91c"/>
                                                    </TouchableOpacity>
                                                    <TextWithFont
                                                        text={item.quantity.toString()}
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => removeCartItem(item.id)}
                                                    >
                                                        <MaterialCommunityIcons name="minus-circle" size={24}
                                                                                color="#f8b91c"/>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => addCartItem(item)}
                                                >
                                                    <MaterialIcons name="add-circle" size={24} color="#f8b91c"/>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        width: "100%",
                        height: "100%"
                    }}
                    contentContainerStyle={{
                        backgroundColor: "#efefef",
                    }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={ListHeaderView()}
                    ListHeaderComponentStyle={{
                        paddingBottom: 20,
                        backgroundColor: "#efefef",
                    }}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    height: 2,
                                    backgroundColor: "#efefef",
                                }}
                            />
                        );
                    }}
                    stickySectionHeadersEnabled={true}
                />
            )}
            <MotiView
                state={checkoutAnimStyle}
                delay={100}
                style={{
                    width: "100%",
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    shadowColor: "black",
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.5,
                    elevation: 10,
                }}
            >
                <TouchableOpacity
                    style={[
                        {
                            width: "80%",
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                        },
                        quantityCart === 0 ? {backgroundColor: "grey"} : {backgroundColor: "#f8b91c"}
                    ]}
                    onPress={() => {
                        navigation.navigate("overview", {foodTruckParam: JSON.stringify(foodTruck)});
                    }}
                    disabled={quantityCart === 0}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? "الدفع" : "Checkout"}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "white"
                        }}
                    />
                </TouchableOpacity>
            </MotiView>
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
        foodTruckContainer: {
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
            marginTop: 20,
            borderTopColor: "rgba(255,255,255,0.5)",
            borderTopWidth: 1,
        },
        contactItem: {
            width: width * 0.25,
            height: 60,
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
            cuisineContainer: {
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
