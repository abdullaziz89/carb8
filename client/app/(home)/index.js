import {
    Dimensions,
    FlatList,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Modal, SafeAreaView, Platform, RefreshControl, I18nManager, ImageBackground, DevSettings
} from "react-native";
import {Link, SplashScreen, Stack, useNavigation, useRouter} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {getHeadersImages} from "../../services/HeadersImagesServices";
import {getCuisine, updateCuisineView} from "../../services/CuisineServices";
import FoodTruckList from "./food-truck-list";
import {CreateResponsiveStyle, DEVICE_SIZES, useDeviceSize} from "rn-responsive-styles";
import {AntDesign, Feather, FontAwesome, MaterialIcons} from "@expo/vector-icons";
import FoodTrucksFilterOptions from "./FoodTrucksFilterOptions";
import {Image} from "expo-image";
import CustomCarousel from "./CustomCarousel";
import {forkJoin} from "rxjs";
import "../../config/i18n";
import {useTranslation} from "react-i18next";
import HeaderTitleView, {HeaderLogo} from "./HeaderTitleView";
import {
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
} from '@expo-google-fonts/balsamiq-sans';
import Animated, {interpolate, useSharedValue, withTiming} from "react-native-reanimated";
import {useFonts} from "expo-font";
import {LogLevel, OneSignal} from 'react-native-onesignal';
import Constants from "expo-constants";
import {useAppStateStore} from "../../store/app-store";
import TextWithFont from "../../component/TextWithFont";
import {Restart} from 'fiction-expo-restart';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DrawerToggleButton} from "@react-navigation/drawer";

SplashScreen.preventAutoHideAsync();

const {width, height} = Dimensions.get("window");

export default function Home() {

    const [fontsLoaded, fontError] = useFonts({
        BalsamiqSans_400Regular,
        BalsamiqSans_400Regular_Italic,
        BalsamiqSans_700Bold,
        BalsamiqSans_700Bold_Italic,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    const {i18n} = useTranslation();
    const {getOrders} = useAppStateStore();

    const styles = useStyles();
    const router = useRouter();
    const navigation = useNavigation();

    const [headerImages, setHeaderImages] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [searchNameValue, setSearchNameValue] = useState("");
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [FoodTrucksFilter, setFoodTrucksFilter] = useState({
        filterValue: {
            governorate: null
        }, isFilterActive: false
    });

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

        forkJoin([getCuisine(), getHeadersImages()])
            .subscribe(([cuisines, headersImages]) => {
                setIsRefreshing(false);
                setCuisines(cuisines);
                setHeaderImages(headersImages);
            });
    };

    useEffect(() => {

        if (showFilterOptions) {
            withTiming(modelViewScale.value, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            })
        } else {
            withTiming(modelViewScale.value, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            })
        }

    }, [showFilterOptions]);

    const currentYear = new Date().getFullYear();

    const cuisineRenderItem = ({item, index}) => {

        const isFirst = index === 0;
        return (
            <TouchableOpacity
                style={[
                    styles.cuisineRenderItem,
                    selectedCuisine === item.id ? {backgroundColor: "#f8b91c"} : {backgroundColor: "#fff"},
                    {marginStart: isFirst ? 10 : 0}
                ]}
                onPress={() => {
                    // set selected sport type
                    updateCuisineView(item.id);
                    setSelectedCuisine(item.id);
                }}
            >
                <Image
                    source={{uri: item.image}}
                    style={[
                        {
                            width: 64,
                            height: 64,
                        },
                        selectedCuisine === item.id ? {borderRadius: 22, backgroundColor: "white"} : {}
                    ]}
                    contentFit={"cover"}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 10
                    }}
                >
                    {i18n.language === "ar" ? item.nameArb : item.nameEng}
                </Text>
            </TouchableOpacity>
        );
    };

    const modelView = () => {

        const color = interpolate(
            modelViewScale.value,
            [0, 1],
            ["rgba(255,255,255,0.5)", "rgba(0,0,0,0.5)"]
        );

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFilterOptions}
            >
                <Animated.View
                    style={[styles.filterOptionsModal, {backgroundColor: color}]}
                >
                    <FoodTrucksFilterOptions
                        setShowFilterOptions={setShowFilterOptions}
                        foodTrucksFilter={FoodTrucksFilter}
                        setFoodTruckFilter={setFoodTrucksFilter}
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
                    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
                        .then(async () => {
                            await AsyncStorage.setItem("settings.lang", i18n.language);
                            if (__DEV__) {
                                DevSettings.reload()
                                return
                            }
                            Restart();
                        });
                }}
            >
                <FontAwesome
                    name="language"
                    size={24}
                    color="#fff"
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
            onLayout={onLayoutRootView}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#efefef",
                    width: width,
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
                        title: "Kuwait Food Trucks",
                        headerTitle: () => Platform.OS !== "ios" &&
                            <HeaderTitleView title={"Kuwait Food Trucks"} logo={require("../../assets/icon.png")}
                                             localLogo={true}/>,
                        headerLeft: () => <DrawerToggleButton tintColor={'#fff'}/>,
                        // headerRight: () => rightHeader(),
                        headerBackTitleVisible: false,
                        headerStyle: {
                            backgroundColor: "#f8b91c",
                        }
                    }}
                />

                {headerImages.length > 0 && <CustomCarousel images={headerImages} clickable={true}/>}

                {
                    getOrders().length > 0 && (
                        <TouchableOpacity
                            style={{
                                width: width,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                marginTop: 20,
                                padding: 10,
                                backgroundColor: "#ffffff",
                            }}
                            onPress={() => {
                                // navigate to orders
                                // navigation.navigate("order");
                                router.push("orders");
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    margin: 10
                                }}
                            >
                                <TextWithFont
                                    text={i18n.language === "ar" ? "طلباتي" : "My Orders"}
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        fontFamily: 'BalsamiqSans_400Regular',
                                    }}
                                />
                                {i18n.language === "ar" ?
                                    <MaterialIcons name="arrow-back-ios" size={20} color="#f8b91c"/> :
                                    <MaterialIcons name="arrow-forward-ios" size={20} color="#f8b91c"/>}
                            </View>
                        </TouchableOpacity>
                    )
                }

                <View
                    style={styles.cuisinesHeaderHolder}
                >
                    <View
                        style={styles.cuisinesHeader}
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
                                    fontWeight: "bold",
                                    fontFamily: 'BalsamiqSans_400Regular',
                                }}
                            >
                                {i18n.language === "ar" ? "الأقسام" : "Categories"}
                            </Text>
                            {
                                selectedCuisine !== null &&
                                <TouchableOpacity
                                    style={{
                                        marginStart: 20
                                    }}
                                    onPress={() => {
                                        // clear selected sport type
                                        setSelectedCuisine(null);
                                    }}
                                >
                                    <AntDesign name="closecircle" size={20} color="#f8b91c"/>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <FlatList
                        style={{
                            marginTop: 20,
                        }}
                        contentContainerStyle={{
                            padding: 10,
                            // flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                        }}
                        data={cuisines}
                        renderItem={cuisineRenderItem}
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
                                        {i18n.language === "ar" ? "لا يوجد مأكولات" : "No Cuisines"}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </View>
                <View
                    style={[styles.foodTrucksHeaderHolder, {flexDirection: i18n.language === "ar" ? "row-reverse" : "row"}]}
                >
                    <Text
                        style={styles.foodTrucksHeader}
                    >
                        {i18n.language === "ar" ? "عربات الطعام" : "Food Trucks"}
                    </Text>
                    {
                        cuisines.length > 0 &&
                        <TouchableOpacity
                            onPress={() => {
                                setShowFilterOptions(true);
                            }}
                        >
                            <Feather name="filter" size={24} color="#f8b91c"/>
                        </TouchableOpacity>
                    }
                </View>
                {
                    cuisines.length > 0 ?
                        <View
                            style={{
                                flex: 1,
                                minHeight: height / 2,
                            }}
                        >
                            <FoodTruckList
                                searchByName={searchNameValue}
                                selectedCuisine={selectedCuisine}
                                cuisines={cuisines}
                                foodTrucksFilter={FoodTrucksFilter}
                                isRefreshing={isRefreshing}
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
                                {i18n.language === "ar" ? "لا توجد عربات" : "No Food Trucks"}
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
