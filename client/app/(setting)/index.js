import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    ScrollView,
    Alert, DevSettings
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {SplashScreen, Stack, useNavigation} from "expo-router";
import {useTranslation} from "react-i18next";
import TextWithFont from "../../component/TextWithFont";
import ActionSheet from "react-native-actions-sheet";
import {useRef} from "react";
import {useAppStateStore} from "../../store/app-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Restart} from "fiction-expo-restart";

const {width, height} = Dimensions.get("window");

export default () => {

    const navigation = useNavigation()
    const {i18n} = useTranslation()
    const actionSheetRef = useRef(null);
    const {isLogin, setLogin, setUser, setVerified} = useAppStateStore();

    const items = [
        {
            key: "language",
            title: i18n.language === "ar" ? "اللغة" : "Language",
            onPress: () => {
                actionSheetRef.current?.show()
            },
            icon: () => {
                return (
                    <MaterialIcons name="language" size={24} color="black"/>
                )
            }
        },
        {
            key: "delete",
            title: i18n.language === "ar" ? "حذف الحساب" : "Delete Account",
            onPress: () => {
                Alert.alert(
                    "Delete Account",
                    "Are you sure you want to delete your account?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => {
                            },
                            style: "cancel"
                        },
                        {
                            text: "Delete",
                            onPress: () => {
                                // show another alert to confirm the delete with message "Are you sure you want to delete your account? This action cannot be undone.\n the account will be delete after 30 days. you can cancel the delete process within 30 days by login to your account."
                                Alert.alert(
                                    "Delete Account",
                                    "Are you sure you want to delete your account? This action cannot be undone.\n the account will be delete after 30 days. you can cancel the delete process within 30 days by login to your account.",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => {
                                            },
                                            style: "cancel"
                                        },
                                        {
                                            text: "Delete",
                                            onPress: () => {
                                                // delete account
                                                // navigate to login screen
                                                setLogin(false);
                                                setUser({});
                                                setVerified(false);

                                                SplashScreen.preventAutoHideAsync();
                                                navigation.navigate("(home)");
                                            },
                                            style: "destructive"
                                        }
                                    ]
                                )
                            },
                            style: "destructive"
                        }
                    ]
                )
            },
            icon: () => {
                return (
                    <AntDesign name="deleteuser" size={24} color="black"/>
                )
            },
            isDelete: true
        }
    ]

    const langItems = [
        {
            title: "English",
            onPress: () => {
                i18n.changeLanguage("en")
                    .then(async () => {
                        await AsyncStorage.setItem("settings.lang", i18n.language);
                        if (__DEV__) {
                            DevSettings.reload()
                            return
                        }
                        Restart();
                    });
            },
            icon: () => {
                return (
                    <MaterialIcons name="language" size={24} color="black"/>
                )
            }
        },
        {
            title: "اللغة العربية",
            onPress: () => {
                i18n.changeLanguage("ar")
                    .then(async () => {
                        await AsyncStorage.setItem("settings.lang", i18n.language);
                        if (__DEV__) {
                            DevSettings.reload()
                            return
                        }
                        Restart();
                    });
            },
            icon: () => {
                return (
                    <MaterialIcons name="language" size={24} color="black"/>
                )
            }
        }
    ]

    const langSheet = () => {

        return (
            <ActionSheet
                ref={actionSheetRef}
                containerStyle={{
                    backgroundColor: "white",
                    width: width,
                    height: height / 2,
                    padding: 10,
                }}
            >
                {
                    langItems.map((item, index) => {
                        return renderItem(item)
                    })
                }
            </ActionSheet>
        )
    }

    const renderItem = ({title, onPress, icon, isDelete, key}) => {
        return (
            <TouchableOpacity
                key={key}
                style={{
                    flexDirection: i18n.language === "ar" ? 'row-reverse' : 'row',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    height: 50
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        flexDirection: i18n.language === "ar" ? 'row-reverse' : 'row',
                        alignItems: 'center'
                    }}
                >
                    {icon()}
                    <TextWithFont
                        text={title}
                        style={[
                            {
                                fontSize: 20,
                            },
                            isDelete && {
                                color: 'red'
                            },
                            i18n.language === "ar" ? {marginRight: 10} : {marginLeft: 10}
                        ]}
                    />
                </View>
                {
                    i18n.language === "ar" ? (
                        <MaterialIcons name="arrow-back-ios" size={18} color="black"/>
                    ) : (
                        <MaterialIcons name="arrow-forward-ios" size={18} color="black"/>
                    )
                }
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView
            style={styles.container}
        >
            <Stack.Screen
                options={{
                    title: i18n.language === "ar" ? "الأعدادات" : "Settings",
                    headerLeft: () => {
                        // back icon button
                        return (
                            <TouchableOpacity
                                style={{
                                    marginRight: 15
                                }}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <MaterialIcons name="arrow-back" size={24} color="black"/>
                            </TouchableOpacity>
                        )
                    },
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            {langSheet()}
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#efefef',
                }}
            >
                {
                    items
                        .filter(item => {
                            // if not login, hide delete account
                            return !(!isLogin && item.isDelete);
                        })
                        .map((item, index) => {
                            return renderItem(item)
                        })
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    }
});