import {Drawer} from 'expo-router/drawer';
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useAppStateStore} from "../store/app-store";
import {useCallback, useEffect, useState} from "react";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {View, Text} from "react-native";
import {Image} from "expo-image";
import TextWithFont from "../component/TextWithFont";
import {getFoodTruckViews} from "../services/FoodTruckServices";
import {SplashScreen, useNavigationContainerRef} from "expo-router";
import {useTranslation} from "react-i18next";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import Constants from "expo-constants";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Sentry from "@sentry/react-native";

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
    dsn: "https://86d556e97d63e40532cd8ab0094ede13@o4507008560726016.ingest.us.sentry.io/4507008649527296",
    enableAutoSessionTracking: true,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    debug: __DEV__,
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation
        }),
    ],
});

function customDrawerContent(props, user, isLogin, i18n) {

    const [numberViews, setNumberViews] = useState(0);
    const {setLogin, setUser, setVerified} = useAppStateStore();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isLogin) {
            getFoodTruckViews(user.foodTruck.id)
                .then((response) => {
                    setNumberViews(response.views);
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }, [isLogin]);

    const onLayoutRootView = useCallback(async () => {
        setTimeout(async () => {
            await SplashScreen.hideAsync();
        }, 3000);
    }, []);

    const getLogo = () => {
        const logo = `https://file.kwfts.com/foodTruck/${user.foodTruck.id}/logo.jpg`
        return (
            <Image
                source={{uri: logo}}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginBottom: 10,
                }}
            />
        )
    }

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    backgroundColor: "#f8b91c",
                    width: "100%",
                    height: "100%",
                    paddingTop: 50,
                }}
                onLayout={onLayoutRootView}
            >
                {
                    isLogin &&
                    <View
                        style={{
                            width: "100%",
                            height: 200,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                            marginBottom: 15,
                        }}
                    >
                        {getLogo()}
                        <View
                            style={{
                                marginTop: 15,
                            }}
                        >
                            <TextWithFont
                                text={i18n.language === "ar" ? user.foodTruck.nameArb : user.foodTruck.nameEng}
                                style={{
                                    color: "#000",
                                    fontSize: 20,
                                    textAlign: "center",
                                }}
                            />
                            <TextWithFont
                                text={`Number of views: ${numberViews}`}
                                style={{
                                    color: "#000",
                                    fontSize: 16,
                                    textAlign: "center",
                                }}
                            />
                        </View>
                    </View>
                }
                <DrawerItem
                    {...props}
                    label={i18n.language === "ar" ? "الرئيسية" : "Home"}
                    onPress={() => props.navigation.navigate("(home)")}
                    focused={props.state.index === 0}
                    activeTintColor={"#000"}
                    inactiveTintColor={"#000"}
                    activeBackgroundColor={props.state.index === 0 ? "#fff" : "transparent"}
                    inactiveBackgroundColor={"transparent"}
                    icon={() => (
                        <AntDesign
                            name="home"
                            size={24}
                            color="black"
                            style={{marginLeft: 10}}
                        />
                    )}
                />
                {
                    isLogin ?
                        <DrawerItem
                            {...props}
                            label={i18n.language === "ar" ? "الملف الشخصي" : "Profile"}
                            onPress={() => props.navigation.navigate("(user)")}
                            focused={props.state.index === 1}
                            activeTintColor={"#000"}
                            inactiveTintColor={"#000"}
                            activeBackgroundColor={props.state.index === 1 ? "#fff" : "transparent"}
                            inactiveBackgroundColor={"transparent"}
                            icon={({size}) => (
                                <MaterialCommunityIcons
                                    name="account-circle-outline"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            )}
                        /> :
                        <DrawerItem
                            {...props}
                            label={i18n.language === "ar" ? "تسجيل الدخول" : "Login"}
                            onPress={() => props.navigation.navigate("(auth)")}
                            focused={props.state.index === 2}
                            activeTintColor={"#000"}
                            inactiveTintColor={"#000"}
                            activeBackgroundColor={props.state.index === 2 ? "#fff" : "transparent"}
                            inactiveBackgroundColor={"transparent"}
                            icon={({size}) => (
                                <MaterialCommunityIcons
                                    name="login"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            )}
                        />
                }
                <View
                    style={{
                        width: "100%",
                        borderTopColor: "#fff",
                        borderTopWidth: 1,
                        marginTop: 20,
                        paddingTop: 20,
                    }}
                >
                    {
                        isLogin &&
                        <DrawerItem
                            {...props}
                            label={i18n.language === "ar" ? "تسجيل الخروج" : "Logout"}
                            onPress={() => {
                                setLogin(false);
                                setUser({});
                                setVerified(false);

                                SplashScreen.preventAutoHideAsync();
                                props.navigation.navigate("(home)");
                            }}
                            focused={props.state.index === 3}
                            activeTintColor={"#000"}
                            inactiveTintColor={"#000"}
                            activeBackgroundColor={props.state.index === 3 ? "#fff" : "transparent"}
                            inactiveBackgroundColor={"transparent"}
                            icon={({size}) => (
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            )}
                        />
                    }
                </View>
                <DrawerItem
                    {...props}
                    label={i18n.language === "ar" ? "السياسة والخصوصية" : "Policy and Privacy"}
                    onPress={() => {
                        props.navigation.navigate("policy");
                    }}
                    focused={props.state.index === 3}
                    activeTintColor={"#000"}
                    inactiveTintColor={"#000"}
                    activeBackgroundColor={props.state.index === 3 ? "#fff" : "transparent"}
                    inactiveBackgroundColor={"transparent"}
                    icon={({size}) => (
                        <MaterialCommunityIcons
                            name="police-badge-outline"
                            size={size}
                            color={"#000"}
                            style={{marginLeft: 10}}
                        />
                    )}
                />
                <DrawerItem
                    {...props}
                    label={i18n.language === "ar" ? "الأعدادات" : "Settings"}
                    onPress={() => {
                        props.navigation.navigate("(setting)");
                    }}
                    focused={props.state.index === 3}
                    activeTintColor={"#000"}
                    inactiveTintColor={"#000"}
                    activeBackgroundColor={props.state.index === 3 ? "#fff" : "transparent"}
                    inactiveBackgroundColor={"transparent"}
                    icon={({size}) => (
                        <Ionicons
                            name="settings-outline"
                            size={size}
                            color={"#000"}
                            style={{marginLeft: 10}}
                        />
                    )}
                />
            </DrawerContentScrollView>
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingBottom: insets.bottom + 10,
                    backgroundColor: "#f8b91c",
                }}
            >
                <Text style={{color: '#efefef'}}>V{Constants.expoConfig.version}</Text>
            </View>
        </View>
    )
}

const MyDrawer = (props) => {

    if (!__DEV__) {
        for (const iterator of Object.keys(global.console)) {
            global.console[iterator] = () => 0;
        }
    }

    const {isLogin, user} = useAppStateStore();
    const {i18n} = useTranslation();

    // Capture the NavigationContainer ref and register it with the instrumentation.
    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            routingInstrumentation.registerNavigationContainer(ref);
        }
    }, [ref]);

    useEffect(() => {
        // add isLogin to props
        props.isLogin = isLogin;
        // throw new Error("This is a test error");
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#f8b91c",
            }}
        >
            <GestureHandlerRootView style={{flex: 1}}>
                <Drawer
                    initialRouteName={"(home)"}
                    screenOptions={{
                        headerShown: false,
                        drawerType: "slide",
                        drawerActiveBackgroundColor: "transparent",
                        drawerInactiveBackgroundColor: "transparent",
                        drawerActiveTintColor: "#fff",
                        drawerInactiveTintColor: "#000",
                        sceneContainerStyle: {
                            backgroundColor: "#f8b91c"
                        },
                        overlayColor: "transparent",
                        drawerPosition: i18n.language === "ar" ? "right" : "left",
                    }}
                    drawerContent={(props) => customDrawerContent(props, user, isLogin, i18n)}
                >
                    <Drawer.Screen
                        name="(home)"
                        options={{
                            drawerIcon: ({size}) => (
                                <MaterialCommunityIcons
                                    name="home"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            ),
                            drawerActiveBackgroundColor: "#efefef",
                            drawerInactiveBackgroundColor: "transparent",
                            drawerActiveTintColor: "#000",
                            drawerInactiveTintColor: "#000",
                        }}
                    />
                    <Drawer.Screen
                        name="(user)"
                        options={{
                            drawerIcon: ({size}) => (
                                <MaterialCommunityIcons
                                    name="account"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            ),
                            drawerActiveBackgroundColor: "#efefef",
                            drawerInactiveBackgroundColor: "transparent",
                            drawerActiveTintColor: "#000",
                            drawerInactiveTintColor: "#000",
                        }}
                    />
                    <Drawer.Screen
                        name="(auth)"
                        options={{
                            drawerIcon: ({size}) => (
                                <MaterialCommunityIcons
                                    name="login"
                                    size={size}
                                    color={"#000"}
                                    style={{marginLeft: 10}}
                                />
                            ),
                            drawerActiveBackgroundColor: "#efefef",
                            drawerInactiveBackgroundColor: "transparent",
                            drawerActiveTintColor: "#000",
                            drawerInactiveTintColor: "#000",
                        }}
                    />
                    <Drawer.Screen
                        name="(setting)"
                        options={{
                            drawerActiveBackgroundColor: "#efefef",
                            drawerInactiveBackgroundColor: "transparent",
                            drawerActiveTintColor: "#000",
                            drawerInactiveTintColor: "#000",
                            sceneContainerStyle: {
                                backgroundColor: "#efefef"
                            },
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Sentry.wrap(MyDrawer);
