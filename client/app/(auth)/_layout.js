import {View} from "react-native";
import {Stack} from "expo-router";
import {useDrawerProgress} from "@react-navigation/drawer";
import Animated, {interpolate, useAnimatedStyle} from "react-native-reanimated";

export default function LoginLayout () {
    const drawerProgress = useDrawerProgress();

    const viewAnimStyle = useAnimatedStyle(() => {

        const perspective = 1000;
        const scale = interpolate(drawerProgress.value, [0, 1], [1, 0.8], "clamp");
        const rotateY = `${interpolate(drawerProgress.value, [0, 1], [0, -0.2], "clamp")}rad`;
        const translateX = interpolate(drawerProgress.value, [0, 1], [0, -60], "clamp");
        const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 30]);
        return {
            transform: [
                {perspective},
                {scale},
                {rotateY},
                {translateX}
            ],
            borderRadius: borderRadius,
            overflow: "hidden"
        }
    });

    return(
        <Animated.View
            style={[{flex: 1}, viewAnimStyle]}
        >
            <Stack
                initialRouteName="login"
                screenOptions={{
                    statusBarHidden: false,
                    statusBarStyle: "dark",
                }}
            >
                <Stack.Screen
                    name="login"
                />
                <Stack.Screen
                    name="register"
                />
                <Stack.Screen
                    name="otp"
                />
                <Stack.Screen
                    name="governorates"
                    options={{
                        headerTitle: "Governorates",
                        presentation: "modal"
                    }}
                />
            </Stack>
        </Animated.View>
    )
}
