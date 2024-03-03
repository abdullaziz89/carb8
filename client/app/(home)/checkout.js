import {useAppStateStore} from "../../store/app-store";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Stack} from "expo-router";
import HeaderTitleView from "./HeaderTitleView";
import {ActivityIndicator, FlatList, TextInput, TouchableOpacity, View} from "react-native";
import TextWithFont from "../../component/TextWithFont";
import {Image} from "expo-image";
import {useEffect, useState} from "react";
import {AntDesign} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

export default () => {

    const {getOrder} = useAppStateStore();
    const foodTruck = getOrder().foodTruck;
    const {t, i18n} = useTranslation();
    const [logo, setLogo] = useState();
    const [customerPhone, setCustomerPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    useEffect(() => {
        setPaymentMethod([
            {
                id: 1,
                key: "knet",
                title: 'K-net',
                icon: () => {
                    return <Image
                        source={require("../../assets/knet-logo.png")}
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: "white",
                            padding: 5,
                        }}
                        contentFit={"contain"}
                    />
                },
            },
            {
                id: 2,
                key: "creditCard",
                title: 'Credit Card',
                icon: () => <AntDesign name="creditcard" size={24} color="black"/>,
            }
        ]);
        setLogo(findLogoImage(foodTruck.images));
    }, []);

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{
                backgroundColor: '#efefef',
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 10,
                paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
        >
            <Stack.Screen
                options={{
                    title: foodTruck && foodTruck.nameEng,
                    headerTitle: () => foodTruck !== null &&
                        <HeaderTitleView title={'Checkout'} logo={logo} isProfile={true}/>,
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Order From"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: "white",
                        padding: 10,
                        marginTop: 5,
                    }}
                >
                    <Image
                        source={{uri: logo}}
                        style={{
                            width: 85,
                            height: 85,
                            borderRadius: 42.5,
                            backgroundColor: "white",
                            padding: 5,
                        }}
                        shape={"circle"}
                        contentFit={"cover"}
                        placeholder={require("../../assets/kwft-logo-placeholder.png")}
                    />
                    <View
                        style={{
                            width: "50%",
                            flexDirection: "column",
                            alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                            justifyContent: "center",
                            marginStart: 5
                        }}
                    >
                        <TextWithFont
                            text={i18n.language === "ar" ? foodTruck.nameArb : foodTruck.nameEng}
                            style={[
                                {
                                    fontSize: 20,
                                    fontWeight: "bold",
                                },
                                i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                            ]}
                        />
                        <TextWithFont
                            text={i18n.language === "ar" ? foodTruck.descriptionArb : foodTruck.descriptionEng}
                            style={[
                                {
                                    fontSize: 16,
                                    fontWeight: "normal"
                                },
                                i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                            ]}
                        />
                    </View>
                </View>
            </View>
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Contact Information"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: "center",
                        backgroundColor: "white",
                        padding: 10,
                        marginTop: 5,
                    }}
                >
                    <TextWithFont
                        text={i18n.t("Phone Number")}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <TextInput
                        style={{
                            width: "100%",
                            height: 40,
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 5,
                            marginTop: 10,
                        }}
                        onChangeText={setCustomerPhone}
                        value={customerPhone}
                        keyboardType={"phone-pad"}
                    />
                </View>
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Order Summary"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <FlatList
                    data={[
                        {title: "Subtotal", value: getOrder().subTotal},
                        {title: "Total", value: getOrder().total},
                    ]}
                    style={{
                        width: "100%",
                    }}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "white",
                                    padding: 10,
                                }}
                            >
                                <TextWithFont
                                    text={item.title}
                                    style={{
                                        fontSize: 16,
                                        margin: 10,
                                    }}
                                />
                                <TextWithFont
                                    text={`${item.value} KWD`}
                                    style={{
                                        fontSize: 16,
                                        margin: 10,
                                    }}
                                />
                            </View>
                        )
                    }}
                />
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={"Payments"}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <FlatList
                    data={paymentMethod}
                    style={{
                        width: "100%",
                    }}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                                style={[
                                    {
                                        width: "100%",
                                        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        backgroundColor: "white",
                                        padding: 10,
                                    },
                                    selectedPaymentMethod && selectedPaymentMethod.id === item.id ? {backgroundColor: "#f8b91c"} : {}
                                ]}
                                onPress={() => {
                                    setSelectedPaymentMethod(item);
                                }}
                            >
                                {item.icon()}
                                <TextWithFont
                                    text={item.title}
                                    style={[
                                        {
                                            fontSize: 16,
                                            margin: 10,
                                            marginStart: 10,
                                        },
                                        selectedPaymentMethod && selectedPaymentMethod.id === item.id ? {color: "white"} : {color: "black"}
                                    ]}
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}