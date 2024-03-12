import {Drawer} from 'expo-router/drawer';
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {useAppStateStore} from "../store/app-store";
import {useCallback, useEffect, useState} from "react";
import {DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import {View, Text, I18nManager, DevSettings} from "react-native";
import {Image} from "expo-image";
import TextWithFont from "../component/TextWithFont";
import {getFoodTruckViews} from "../services/FoodTruckServices";
import {SplashScreen} from "expo-router";
import i18n from "i18next";
import {useTranslation} from "react-i18next";
import {Restart} from "fiction-expo-restart";

export function customDrawerContent(props, user, isLogin) {

    const [numberViews, setNumberViews] = useState(0);
    const {setLogin, setUser, setVerified} = useAppStateStore();
    const {t, i18n} = useTranslation();

    const [logoutClicked, setLogoutClicked] = useState(false);

    useEffect(() => {
        if (isLogin) {
            getFoodTruckViews(user.foodTruck.id)
                .then((response) => {
                    console.log('response: ', response)
                    setNumberViews(response.views);
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
        }
    }, [isLogin]);

    const onLayoutRootView = useCallback(async () => {
        setTimeout(async () => {
            await SplashScreen.hideAsync();
        }, 3000);
    }, []);

    const getLogo = () => {
        const logo = `http://192.168.3.8:8081/foodTruck/${user.foodTruck.id}/logo.jpg`
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
                label={t("drawer.home")}
                onPress={() => props.navigation.navigate("(home)")}
                focused={props.state.index === 0}
                activeTintColor={"#000"}
                inactiveTintColor={"#000"}
                activeBackgroundColor={props.state.index === 0 ? "#fff" : "transparent"}
                inactiveBackgroundColor={"transparent"}
                icon={({focused, size}) => (
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
                        icon={({focused, size}) => (
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
                        icon={({focused, size}) => (
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
                        icon={({focused, size}) => (
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
        </DrawerContentScrollView>
    )
}

export default (props) => {

    const {isLogin, user} = useAppStateStore();
    const {i18n} = useTranslation();

    useEffect(() => {
        // add isLogin to props
        props.isLogin = isLogin;
    }, []);

    useEffect(() => {
        console.log('isLogin: ', isLogin);
    }, [isLogin]);

    return (
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
            drawerContent={(props) => customDrawerContent(props, user, isLogin)}
        >
            <Drawer.Screen
                name="(home)"
                options={{
                    drawerIcon: ({focused, size}) => (
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
                customDrawerContent={customDrawerContent}
            />
            <Drawer.Screen
                name="(user)"
                options={{
                    drawerIcon: ({focused, size}) => (
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
                    drawerIcon: ({focused, size}) => (
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
        </Drawer>
    )
}
