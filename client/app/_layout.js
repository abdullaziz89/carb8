import {Drawer} from 'expo-router/drawer';
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default () => {
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
                drawerContentStyle: {
                    backgroundColor: "#f8b91c",
                    width: "100%",
                },
                sceneContainerStyle: {
                    backgroundColor: "#f8b91c"
                },
                overlayColor: "transparent",
            }}
        >
            <Drawer.Screen
                name="(home)"
                options={{
                    title: "Home",
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
            />
            <Drawer.Screen
                name="(login)"
                options={{
                    title: "Login",
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