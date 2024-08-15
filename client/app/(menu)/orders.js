import {View, FlatList, TouchableOpacity} from "react-native";
import {Stack, useNavigation, useRouter} from "expo-router";
import {useAppStateStore} from "../../store/app-store";
import HeaderTitleView from "./HeaderTitleView";
import TextWithFont from "../../component/TextWithFont";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {MaterialIcons, Octicons} from "@expo/vector-icons";

export default () => {

    const {getOrders} = useAppStateStore();
    const {t, i18n} = useTranslation();
    const router = useRouter();
    const navigation = useNavigation();

    const orderStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "#226377";
            case "ACCEPTED":
                return "#28a745";
            case "REJECTED":
                return "#dc3545";
            default:
                return "#000";
        }
    }

    const orderStatusLocalized = (status) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return t("order.status.pending");
            case "ACCEPTED":
                return t("order.status.accepted");
            case "REJECTED":
                return t("order.status.rejected");
            default:
                return status;
        }
    }

    const sortOrderByDate = (arr) => {
        return arr.sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
        });
    }

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    const formatDateAndTime = (date) => {
        // date = 2021-08-25T14:00:00.000Z, format for example: 25/08/2021 14:00
        if (date) {
            const d = new Date(date);
            const day = d.getDate();
            const month = d.getMonth() + 1;
            const year = d.getFullYear();
            const hours = d.getHours();
            const minutes = d.getMinutes();
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
    }

    const orderRenderItem = ({item}) => {

        const logo = findLogoImage(item.foodTruck.images);
        const totalPrice = item.items.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);

        return (
            <TouchableOpacity
                style={{
                    width: "100%",
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "#fff",
                }}
                onPress={() => {
                    navigation.navigate("order", {orderId: item.id});
                }}
            >
                <Image
                    source={{uri: logo}}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#226377"
                    }}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                <View
                    style={[
                        {
                            flex: 1,
                        },
                        i18n.language === "ar" ? {marginRight: 15} : {marginLeft: 15}
                    ]}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? item.foodTruck.nameArb : item.foodTruck.nameEng}
                        style={{
                            fontSize: 18,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <TextWithFont
                            text={orderStatusLocalized(item.status)}
                            style={{
                                fontSize: 12,
                                color: orderStatusColor(item.status)
                            }}
                        />
                        <Octicons
                            name="dot-fill"
                            size={8}
                            color="black"
                            style={i18n.language === "ar" ? {marginRight: 5} : {marginLeft: 5}}
                        />
                        <TextWithFont
                            text={totalPrice.toFixed(2) + " KWD"}
                            style={[
                                {
                                    fontSize: 12
                                },
                                i18n.language === "ar" ? {marginRight: 5} : {marginLeft: 5}
                            ]}
                        />
                        <Octicons
                            name="dot-fill"
                            size={8}
                            color="black"
                            style={[
                                i18n.language === "ar" ? {marginRight: 5} : {marginLeft: 5}
                            ]}
                        />
                        <TextWithFont
                            text={formatDateAndTime(item.createTime)}
                            style={[
                                {
                                    fontSize: 12
                                },
                                i18n.language === "ar" ? {marginRight: 5} : {marginLeft: 5}
                            ]}
                        />
                    </View>
                </View>
                {i18n.language === "ar" ?
                    (<MaterialIcons name="arrow-back-ios" size={20} color="#226377"/>) :
                    (<MaterialIcons name="arrow-forward-ios" size={20} color="#226377"/>)}
            </TouchableOpacity>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                width: "100%",
            }}
        >
            <Stack.Screen
                options={{
                    title: 'My Orders',
                    headerTitle: () => <HeaderTitleView title={t('order.myOrder.title')} logo={null} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#226377"
                    },
                    headerShown: true,
                    headerBackTitleVisible: false,
                    headerTintColor: "#fff",
                }}
            />
            <FlatList
                style={{
                    flex: 1,
                    width: "100%",
                }}
                contentContainerStyle={{
                    alignItems: "flex-start",
                    padding: 15,
                    backgroundColor: "#fff"
                }}
                keyExtractor={item => item.id}
                data={sortOrderByDate(getOrders())}
                renderItem={orderRenderItem}
                ItemSeparatorComponent={() => <View style={{height: 15}}/>}
            />
        </View>
    )
}