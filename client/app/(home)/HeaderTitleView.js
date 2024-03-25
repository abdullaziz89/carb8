import {Text, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";
import {useNavigation} from "expo-router";
import TextWithFont from "../../component/TextWithFont";
import {DrawerActions as DrawerAction} from "@react-navigation/routers/src";

export default (props) => {

    const {title, logo, localLogo, isProfile} = props;
    const {t, i18n} = useTranslation();
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
            }}
        >
            <TextWithFont
                text={title}
                style={{
                    fontSize: 20, marginLeft: !isProfile && logo ? 10 : 0,
                }}
            />
        </View>
    );
}

export const HeaderLogo = (navigation, logo, localLogo) => {

    return (
        <TouchableOpacity
            onPress={() => {
                DrawerAction.toggleDrawer();
            }}
        >
            <Image
                source={localLogo ? logo : {uri: logo}}
                style={{width: 35, height: 35, borderRadius: 17.5}}
                placeholder={require("../../assets/kwft-logo-placeholder.png")}
            />
        </TouchableOpacity>
    )
}