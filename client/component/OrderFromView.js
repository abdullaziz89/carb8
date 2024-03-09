import {useAppStateStore} from "../store/app-store";
import TextWithFont from "./TextWithFont";
import {View} from "react-native";
import {Image} from "expo-image";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default () => {

    const {getOrders} = useAppStateStore();

    const getListPostedOrder = () => {
        // compare orders from getOrders by createTime and get the newest one and the order status pending
        return getOrders().filter((order) => {
            return order.status === "pending";
        }).sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
        })[0];
    }

    const foodTruck = getListPostedOrder().foodTruck;

    const {t, i18n} = useTranslation();

    const [logo, setLogo] = useState();

    useEffect(() => {
        setLogo(findLogoImage(foodTruck.images));
    }, []);

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    }

    return(
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
                    placeholder={require("../assets/kwft-logo-placeholder.png")}
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
    )
}
