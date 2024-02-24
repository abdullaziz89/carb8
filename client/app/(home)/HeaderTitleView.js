import {Text, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import {useTranslation} from "react-i18next";
import {useNavigation} from "expo-router";

export default (props) => {

    const {title, logo, localLogo} = props;
    const {t, i18n} = useTranslation();
    const navigation = useNavigation();

    const headerLogo = () => {
        return(
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
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
            }}
        >
            {
                logo && headerLogo()
            }
            <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 15}}>{title}</Text>
        </View>
    );
}
