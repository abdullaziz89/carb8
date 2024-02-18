import { Text, View } from "react-native";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

export default (props) => {

  const { title, logo, localLogo } = props;
  const { t, i18n } = useTranslation();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      {
                logo && <Image
          source={localLogo ? logo : { uri: logo }}
          style={{ width: 35, height: 35, borderRadius: 17.5 }}
          placeholder={require("../assets/allsports-placeholder.png")}
                />
            }
            <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 15}}>{title}</Text>
        </View>
    );
}
