import {View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, Dimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {Stack, useNavigation} from "expo-router";
import {useTranslation} from "react-i18next";
import TextWithFont from "../../component/TextWithFont";
import ActionSheet from "react-native-actions-sheet";
import {useRef} from "react";

const {width, height} = Dimensions.get("window");

export default () => {

    const navigation = useNavigation()
    const {i18n} = useTranslation()
    const actionSheetRef = useRef(null);

    const items = [
        {
            title: "Language",
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
            title: "Delete Account",
            onPress: () => {
                console.log("Delete Account")
            },
            icon: () => {
                return (
                    <AntDesign name="deleteuser" size={24} color="black" />
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
                actionSheetRef.current?.hide()
            },
            icon: () => {
                return (
                    <MaterialIcons name="language" size={24} color="black"/>
                )
            }
        },
        {
            title: "Arabic",
            onPress: () => {
                i18n.changeLanguage("ar")
                actionSheetRef.current?.hide()
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

    const renderItem = ({title, onPress, icon, isDelete}) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgrey',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff'
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    {icon()}
                    <TextWithFont
                        text={title}
                        style={[
                            {
                                fontSize: 20,
                                marginLeft: 10
                            },
                            isDelete && {
                                color: 'red'
                            }
                        ]}
                    />
                </View>
                {
                    i18n.language === "ar" ? (
                        <MaterialIcons name="arrow-back-ios" size={18} color="black" />
                    ) : (
                        <MaterialIcons name="arrow-forward-ios" size={18} color="black" />
                    )
                }
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#f8b91c"
                barStyle="dark-content"
            />
            <Stack.Screen
                options={{
                    headerLargeTitle: true,
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
                    backgroundColor: '#efefef',
                    flex: 1,
                }}
            >
                {
                    items.map((item, index) => {
                        return renderItem(item)
                    })
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red'
    }
});