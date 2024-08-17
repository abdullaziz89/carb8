import {
    Dimensions,
    View,
    Text,
    ScrollView, SafeAreaView, Platform, RefreshControl, Alert, FlatList, ImageBackground, TouchableOpacity
} from "react-native";
import {Link, SplashScreen, Stack, useNavigation, useRouter} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import CustomCarousel from "../(menu)/CustomCarousel";
import "../../config/i18n";
import {useTranslation} from "react-i18next";
import HeaderTitleView from "../(menu)/HeaderTitleView";
import {useSharedValue, withTiming} from "react-native-reanimated";
import {LogLevel, OneSignal} from 'react-native-onesignal';
import Constants from "expo-constants";
import {useAppStateStore} from "../../store/app-store";
import axios from "axios";
import TextWithFont from "../../component/TextWithFont";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Image} from "expo-image";

const {width, height} = Dimensions.get("window");

export default function Home() {

    const {i18n} = useTranslation();
    const {getOrders} = useAppStateStore();

    const styles = useStyles();
    const router = useRouter();
    const navigation = useNavigation();

    const [headerImages, setHeaderImages] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const modelViewScale = useSharedValue(0)

    useEffect(() => {

        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

        // Also need enable notifications to complete OneSignal setup
        OneSignal.Notifications.requestPermission(true);

        fetchData(false);

    }, []);

    useEffect(() => {

        // if (i18n.language === "en") {
        //   i18n.changeLanguage("ar")
        //     .then(() => {
        //       I18nManager.forceRTL(i18n.language === "ar");
        //       i18n.dir(i18n.language === "ar" ? "rtl" : "ltr");
        //     });
        // }

    }, []);

    const fetchData = (fromRefreshing) => {

        if (fromRefreshing) {
            setIsRefreshing(true);
        }

        const dateObj = new Date();
        let time = dateObj.getTime();
        let date = dateObj.getDate();

        // format datetime to 'yyyy-mm-dd hh:mm:ss', format time to 'hh:mm:ss', format date to 'yyyy-mm-dd'
        time = new Date(time).toLocaleTimeString('en-US', {hour12: false});
        date = new Date(date).toLocaleDateString('en-US');
        const dateTime = date + ' ' + time;

        axios.post('https://carb8-kw.com/DATAAPI/getfrontpage.php',
            {
                "Userid": "eo4o03coe800vddvuin9it7ah0",
                "CompID": "15",
                "Action": "Getfront",
                "Date": date,
                "Time": time,
                "Datetime": dateTime
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                setHeaderImages(response.data.FrontSlider);
                setPlans(response.data.MealPlans.filter(item => item.PranId === "145" || item.PranId === "159" || item.PranId === "162"));
            }).catch(error => {
            Alert.alert('Error', 'something went wrong, please try again late.');
        })
    };

    const currentYear = new Date().getFullYear();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#efefef",
                width: width,
                marginBottom: 100,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#efefef",
                    width: width,
                }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 50
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
                        title: "Carb 8",
                        headerLargeTitleStyle: {
                            fontFamily: 'BalsamiqSans_400Regular',
                            fontSize: 30,
                            color: "white"
                        },
                        headerTitleStyle: {
                            fontFamily: 'BalsamiqSans_400Regular',
                            fontSize: 20,
                            color: "white"
                        },
                        headerTitle: () => Platform.OS !== "ios" &&
                            <HeaderTitleView title={"Carb 8"} logo={require("../../assets/icon.png")}
                                             localLogo={true}/>,
                        headerBackTitleVisible: false,
                        headerStyle: {
                            backgroundColor: "#226377",
                        }
                    }}
                />

                {headerImages.length > 0 && <CustomCarousel images={headerImages} clickable={false}/>}

                <View
                    style={{
                        paddingStart: 10,
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? "باقاتنا" : "Out Plans"}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            fontFamily: 'BalsamiqSans_400Regular',
                            marginTop: 20,
                            width: width,
                            textAlign: "left",
                            paddingStart: 15
                        }}
                    />
                    <FlatList
                        style={{marginTop: 20, maxHeight: 220}}
                        contentContainerStyle={{
                            paddingStart: 10,
                            maxHeight: 220
                        }}
                        data={plans}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => (
                            <TouchableOpacity
                                style={{
                                    width: 350,
                                    height: 200,
                                    marginEnd: 15,
                                    borderRadius: 20,
                                    backgroundColor: "white",
                                    // drop shadow
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <ImageBackground
                                    source={{uri: 'https://imagedelivery.net/bxlE0nH6a9wkPR6_oDoHgA/fef5c94f-96bf-41d0-9ea4-20f9f627ca00/public'}}
                                    imageStyle={{
                                        borderRadius: 20,
                                        backgroundColor: "white",
                                        justifyContent: "flex-end",
                                    }}
                                    style={{
                                        width: 350,
                                        height: 200,
                                        borderRadius: 20,
                                        backgroundColor: "white",
                                        padding: 10,
                                        paddingTop: 20
                                    }}
                                    resizeMode={"contain"}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start"
                                        }}
                                    >
                                        <MaterialCommunityIcons name="food-apple-outline" size={24} color="#226377"/>
                                        <TextWithFont
                                            text={`${item.Meals} Meals`}
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'BalsamiqSans_400Regular',
                                                color: '#226377',
                                                marginStart: 10
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start"
                                        }}
                                    >
                                        <MaterialCommunityIcons name="food-steak" size={24} color="#f0ad4e"/>
                                        <TextWithFont
                                            text={`${item.Proteins} proteins`}
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'BalsamiqSans_400Regular',
                                                color: '#f0ad4e',
                                                marginStart: 10
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start"
                                        }}
                                    >
                                        <MaterialCommunityIcons name="food-croissant" size={24} color="#5cb85c"/>
                                        <TextWithFont
                                            text={`${item.Carbs} carbs`}
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'BalsamiqSans_400Regular',
                                                color: '#5cb85c',
                                                marginStart: 10
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            marginTop: 25
                                        }}
                                    >
                                        <TextWithFont
                                            text={`Start today ${item.AmtPerDay}KWD`}
                                            style={{
                                                fontSize: 26,
                                                fontFamily: 'BalsamiqSans_700Bold',
                                                color: '#226377',
                                                marginStart: 10
                                            }}
                                        />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />
                    <View>
                        <TextWithFont
                            text={'How it works'}
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                fontFamily: 'BalsamiqSans_400Regular',
                                width: width,
                                textAlign: "left",
                                paddingStart: 15,
                                marginTop: 20
                            }}
                        />
                        <TextWithFont
                            text={'Set your goals and let us do the work while you enjoy the taste and convenience of your meal plan.'}
                            style={{
                                fontSize: 16,
                                fontFamily: 'BalsamiqSans_400Regular',
                                maxWidth: width - 30,
                                textAlign: "left",
                                paddingStart: 15,
                                marginTop: 10
                            }}
                        />
                        <FlatList
                            style={{marginTop: 20, maxHeight: 250}}
                            contentContainerStyle={{
                                paddingStart: 10,
                                maxHeight: 250
                            }}
                            data={[
                                {
                                    id: 1,
                                    title: 'Select your meal plan',
                                    subtitle: 'Select the meal plan that is best suited for your lifestyle and helps you reach your goals.',
                                    img: 'https://carb8-kw.com/comp_logo/Calendar.webp'
                                },
                                {
                                    id: 2,
                                    title: 'Manage your meal plan',
                                    subtitle: 'Customise to your preferences and intolerances. Skip, pause or select meals from other plans.',
                                    img: 'https://carb8-kw.com/comp_logo/Box.webp'
                                },
                                {
                                    id: 3,
                                    title: 'Receive your meals',
                                    subtitle: 'Enjoy delicious freshly prepared meals delivered to your door.',
                                    img: 'https://carb8-kw.com/comp_logo/Bowl.webp'
                                }
                            ]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => (
                                <View
                                    style={{
                                        width: 220,
                                        height: 250,
                                        marginEnd: 15,
                                        borderRadius: 15,
                                        backgroundColor: "white",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        padding: 10,
                                        paddingBottom: 20,
                                    }}
                                >
                                    <Image
                                        source={{uri: item.img}}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            backgroundColor: "white",
                                        }}
                                        contentFit={"contain"}
                                    />
                                    <TextWithFont
                                        text={item.title}
                                        style={{
                                            fontSize: 18,
                                            fontFamily: 'BalsamiqSans_400Regular',
                                            color: '#000',
                                            marginTop: 10,
                                            textAlign: "left"
                                        }}
                                    />
                                    <TextWithFont
                                        text={item.subtitle}
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'BalsamiqSans_400Regular',
                                            color: '#000',
                                            marginTop: 10,
                                            textAlign: "left"
                                        }}
                                        numberOfLines={3}
                                    />
                                </View>
                            )}
                        />
                    </View>
                </View>

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
                        <Text>All rights reserved © Kuwait Food Trucks {currentYear}</Text>
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
        cuisinesHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width,
            paddingStart: 10,
            paddingEnd: 10
        },
        cuisinesHeaderHolder: {
            width: width,
            height: 220,
            marginTop: 30
        },
        foodTrucksHeaderHolder: {
            justifyContent: "space-between",
            alignItems: "center",
            width: width,
            marginTop: 25,
            marginBottom: 20,
            paddingStart: 10,
            paddingEnd: 10
        },
        foodTrucksHeader: {
            fontSize: 20,
            fontWeight: "bold",
        },
        filterOptionsModal: {
            width: width,
            height: height,
            alignSelf: "center",
            justifyContent: "flex-end",
            margin: 0
        },
        cuisineRenderItem: {
            flexDirection: "column",
            alignItems: "center",
            width: 100,
            height: 140,
            paddingTop: 15,
            marginEnd: 20,
            borderRadius: 35,
            // drop shadow
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
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
