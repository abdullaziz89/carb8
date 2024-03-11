import {Stack, useLocalSearchParams, useSearchParams} from "expo-router";
import {Keyboard, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "./HeaderTitleView";
import {useEffect} from "react";
import {useAppStateStore} from "../../store/app-store";
import {Image} from "expo-image";
import TextWithFont from "../../component/TextWithFont";
import {MaterialIcons, Octicons} from "@expo/vector-icons";

export default () => {

    const {orderId} = useLocalSearchParams();
    const {getOrder} = useAppStateStore();

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    const formatDateAndTime = (date) => {
        // date = 2021-08-25T14:00:00.000Z, format for example: 25/08/2021 14:00
        const split = date.split("T");
        const dateSplit = split[0].split("-");
        const timeSplit = split[1].split(":");
        return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]} ${timeSplit[0]}:${timeSplit[1]}`;
    }

    const foodTruckView = () => {

        const item = getOrder(orderId);
        const logo = findLogoImage(item.foodTruck.images);
        const totalPrice = item.items.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);

        return (
            <View
                style={{
                    width: "100%",
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "#fff",
                }}
            >
                <Image
                    source={{uri: logo}}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#f8b91c"
                    }}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                <View
                    style={{
                        flex: 1,
                        marginLeft: 15,
                    }}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? item.foodTruck.nameArb : item.foodTruck.nameEng}
                        style={{
                            fontSize: 18,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <TextWithFont
                            text={item.status}
                            style={{
                                fontSize: 12,
                                color: orderStatusColor(item.status)
                            }}
                        />
                        <Octicons
                            name="dot-fill"
                            size={8}
                            color="black"
                            style={{
                                marginLeft: 5,
                            }}
                        />
                        <TextWithFont
                            text={totalPrice.toFixed(2) + " KWD"}
                            style={{
                                fontSize: 12,
                                marginLeft: 5,
                            }}
                        />
                        <Octicons
                            name="dot-fill"
                            size={8}
                            color="black"
                            style={{
                                marginLeft: 5,
                            }}
                        />
                        <TextWithFont
                            text={formatDateAndTime(item.createTime)}
                            style={{
                                fontSize: 12,
                                marginLeft: 5,
                            }}
                        />
                    </View>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color="#f8b91c" />
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                width: "100%",
            }}
            contentContainerStyle={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        >
            <Stack.Screen
                options={{
                    title: '',
                    headerTitle: () => <HeaderTitleView title={''} logo={null} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    },
                    headerShown: true
                }}
            />
        </KeyboardAwareScrollView>
    )
}