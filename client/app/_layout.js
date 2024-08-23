import {SplashScreen, Tabs} from "expo-router";
import tabBar from "../component/tabBar";
import {useCallback, useEffect} from "react";
import {useFonts} from "expo-font";
import {
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold, BalsamiqSans_700Bold_Italic
} from "@expo-google-fonts/balsamiq-sans";

export default () => {

    // const [fontsLoaded, fontError] = useFonts({
    //     BalsamiqSans_400Regular,
    //     BalsamiqSans_400Regular_Italic,
    //     BalsamiqSans_700Bold,
    //     BalsamiqSans_700Bold_Italic,
    // });

    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded) {
    //         console.log("fonts loaded");
    //         await SplashScreen.hideAsync();
    //     } else if (fontError) {
    //         console.error(fontError);
    //     }
    // }, [fontsLoaded, fontError]);

    // useEffect(async () => {
    //     await SplashScreen.hideAsync();
    // }, []);

    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                statusBarHidden: false,
            }}
            tabBar={tabBar}
            // onLayoutRootView={onLayoutRootView}
        >
            <Tabs.Screen
                name="(auth)"
                options={{
                    title: "auth",
                    icon: "person",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "home",
                    icon: "home",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="(menu)"
                options={{
                    title: "menu",
                    icon: "menu",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="(setting)"
                options={{
                    title: "setting",
                    icon: "settings",
                    headerShown: false
                }}
            />
        </Tabs>
    )
}