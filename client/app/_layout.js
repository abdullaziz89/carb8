import {Tabs} from "expo-router";
import tabBar from "../component/tabBar";

export default () => {

    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                statusBarHidden: false,
            }}
            tabBar={tabBar}
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