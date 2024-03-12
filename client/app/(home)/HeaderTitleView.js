import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";
import {useNavigation} from "expo-router";
import TextWithFont from "../../component/TextWithFont";

const {width} = Dimensions.get("window");

export default (props) => {

    const {title, logo, localLogo, isProfile} = props;
    const {t, i18n} = useTranslation();
    const navigation = useNavigation();

    const headerLogo = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.toggleDrawer();
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

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    width: width * 0.85,
                },
                i18n.language === "ar" ? {flexDirection: "row-reverse"} : {flexDirection: "row"},
                i18n.language === "ar" ? {alignItems: "flex-end"} : {alignItems: "flex-start"},
            ]}
        >
            {
                !isProfile && logo && headerLogo()
            }
            <TextWithFont
                text={title}
                style={[
                    {
                        fontSize: 20,
                    },
                    i18n.language === "ar" ? {marginRight: !isProfile && logo ? 10 : 0} : {marginLeft: !isProfile && logo ? 10 : 0}
                ]}
            />
        </View>
    );
}
