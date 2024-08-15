import {Stack} from "expo-router";
import {Text} from "react-native";
import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

export default function Layout() {

    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                Home: {
                    path: "",
                    screens: {
                        Home: "home",
                        Profile: "profile",
                        Settings: "settings",
                    }
                },
                Payment: {
                    path: "payment",
                    screens: {
                        PaymentSuccess: "success",
                        PaymentReject: "reject",
                    }
                },
                NotFound: "*",
            }
        }
    }

    return (
        <Stack
            linking={linking}
            fallback={<Text>404</Text>}
        />
    )
}
