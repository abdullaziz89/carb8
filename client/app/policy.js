import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import WebView from "react-native-webview";
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from "@expo/vector-icons";
import TextWithFont from "../component/TextWithFont";
import {useNavigation} from "expo-router";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default () => {

    const navigation = useNavigation()
    const {i18n} = useTranslation()
    const [isLoading, setLoading] = useState(false);

    const source = { uri: 'https://kwfts.com/policy.pdf', cache: true };

    return (
        <SafeAreaView
            style={styles.container}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    alignItems: 'center'
                }}
                onPress={() => {
                    navigation.goBack()
                }}
            >
                <MaterialIcons name="arrow-back-ios" size={24} color="black"/>
                <TextWithFont
                    text={i18n.language === "ar" ? "السياسة والخصوصية" : "Policy and Privacy"}
                    style={{
                        fontSize: 20,
                        marginLeft: 10
                    }}
                />
            </TouchableOpacity>
            <WebView
                style={{
                    flex: 1,
                    width: '100%',
                }}
                source={{uri: 'https://docs.google.com/gview?embedded=true&url=https://kwfts.com/policy.pdf'}}
                onLoadStart={() => {
                    setLoading(true)
                }}
                onLoadEnd={() => {
                    setLoading(false)
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})