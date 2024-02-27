import {Stack} from "expo-router";
import Animated, {interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useDrawerProgress} from "@react-navigation/drawer";

export default function Layout() {

    const drawerProgress = useDrawerProgress();

    const viewAnimStyle = useAnimatedStyle(() => {

        const perspective = 1000;
        const scale = interpolate(drawerProgress.value, [0, 1], [1, 0.8], "clamp");
        const rotateY = `${interpolate(drawerProgress.value, [0, 1], [0, -0.2], "clamp")}rad`;
        const translateX = interpolate(drawerProgress.value, [0, 1], [0, -60], "clamp");
        const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 30]);
        const shadowOpacity = interpolate(drawerProgress.value, [0, 1], [0, 0.5]);
        return {
            transform: [
                {perspective},
                {scale},
                {rotateY},
                {translateX}
            ],
            borderRadius: borderRadius,
            overflow: "hidden",
        }
    });

    return (
        <Animated.View
            style={[{flex: 1}, viewAnimStyle]}
            screenOptions={{
                statusBarHidden: false,
                statusBarStyle: "dark",
            }}
        >
            <Stack/>
        </Animated.View>
    )
}
