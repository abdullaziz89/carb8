import {View, Text, ActivityIndicator, TouchableOpacity, Dimensions, TextInput, FlatList} from "react-native";
import {useAppStateStore} from "../../store/app-store";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SplashScreen, Stack, useLocalSearchParams, useNavigation, useRouter, useSearchParams} from "expo-router";
import {useCallback, useEffect, useRef, useState} from "react";
import {Image} from "expo-image";
import TextWithFont from "../../component/TextWithFont";
import {useTranslation} from "react-i18next";
import ActionSheet from "react-native-actions-sheet";
import {AntDesign, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import HeaderTitleView from "./HeaderTitleView";

SplashScreen.preventAutoHideAsync();

const {width, height} = Dimensions.get("window");

export default () => {

    const {getCart, itemQuantityInCart, addCartItem, removeCartItem, totalPriceInCart, setOrder} = useAppStateStore();
    const navigation = useNavigation();

    const {foodTruckParam} = useLocalSearchParams();
    const [foodTruck, setFoodTruck] = useState(JSON.parse(foodTruckParam));

    const [logo, setLogo] = useState(null);
    const {t, i18n} = useTranslation();
    const [orderNote, setOrderNote] = useState("");

    const [vouchers, setVouchers] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const actionSheetRef = useRef(null);
    const itemActionSheetRef = useRef(null);
    const voucherActionSheetRef = useRef(null);

    useEffect(() => {
        if (foodTruck) {
            setLogo(findLogoImage(foodTruck.images));
        }
    }, [foodTruck]);

    const onLayoutRootView = useCallback(async () => {
        if (foodTruck) {
            await SplashScreen.hideAsync();
        }
    }, [foodTruck]);

    const findLogoImage = (images) => {

        return images.find((image) => {
            const split = image.split("/");
            return split[split.length - 1].split(".")[0] === "logo";
        });
    };

    if (!foodTruck) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onLayout={onLayoutRootView}
            />
        )
    }

    const orderNoteSheet = () => {

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
                <TextWithFont
                    text={i18n.language === "ar" ? 'ملاحظات الطلب' : 'Order Note'}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <TextInput
                    style={{
                        width: "100%",
                        height: 200,
                        backgroundColor: "white",
                        textAlignVertical: "top",
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 10,
                        padding: 10,
                    }}
                    value={orderNote}
                    multiline={true}
                    numberOfLines={10}
                    placeholder={i18n.language === "ar" ? 'ملاحظات الطلب' : 'Order Note'}
                    onChange={(event) => {
                        const text = event.nativeEvent.text;
                        setOrderNote(text);
                    }}
                />
                <TouchableOpacity
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#f8b91c",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                    onPress={() => actionSheetRef.current?.hide()}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? 'تأكيد' : 'Confirm'}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    />
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const updateItemSheet = () => {

        if (!selectedItem) return;

        return (
            <ActionSheet
                ref={itemActionSheetRef}
                containerStyle={{
                    backgroundColor: "white",
                    width: width,
                    height: height / 2,
                    padding: 10,
                }}
                onClose={() => setSelectedItem(null)}
            >
                <TextWithFont
                    text={i18n.language === "ar" ? 'تعديل العنصر' : 'Update Item'}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 15,
                    }}
                >
                    <Image
                        source={{uri: selectedItem.image}}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: "white",
                            padding: 5,
                            alignSelf: "center",
                        }}
                        shape={"circle"}
                        contentFit={"cover"}
                        placeholder={require("../../assets/kwft-logo-placeholder.png")}
                    />
                    <TextWithFont
                        text={selectedItem.name}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: 15,
                        }}
                    />
                    <TextWithFont
                        text={selectedItem.price + " KWD"}
                        style={{
                            fontSize: 16,
                            fontWeight: "normal",
                            textAlign: "center",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginTop: 25,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => addCartItem(selectedItem)}
                    >
                        <MaterialCommunityIcons name="plus-circle" size={24}
                                                color="#f8b91c"/>
                    </TouchableOpacity>
                    <TextWithFont
                        text={itemQuantityInCart(selectedItem.id)}
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "black",
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => removeCartItem(selectedItem.id)}
                    >
                        <MaterialCommunityIcons name="minus-circle" size={24}
                                                color="#f8b91c"/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#f8b91c",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 25,
                    }}
                    onPress={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                            itemActionSheetRef.current?.hide();
                            setIsLoading(false);
                        }, 500);
                    }}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? 'تأكيد' : 'Confirm'}
                        style={{
                            fontSize: 20,
                            fontWeight: "#fff",
                        }}
                    />
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const voucherSheet = () => {
        return (
            <ActionSheet
                ref={voucherActionSheetRef}
                containerStyle={{
                    backgroundColor: "white",
                    width: width,
                    height: height / 3,
                    padding: 10,
                }}
            >
                <TextWithFont
                    text={i18n.language === "ar" ? 'كوبونات' : 'Vouchers'}
                    style={{
                        fontSize: 20,
                        margin: 10,
                    }}
                />
                <TextInput
                    style={{
                        width: "100%",
                        height: 40,
                        backgroundColor: "white",
                        textAlignVertical: "top",
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 20,
                    }}
                    placeholder={i18n.language === "ar" ? 'كوبونات' : 'Vouchers'}
                    onChange={(event) => {
                        const text = event.nativeEvent.text;
                        setSelectedVoucher({
                            code: text,
                            discount: 10
                        });
                    }}
                />
                <TouchableOpacity
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#f8b91c",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                    onPress={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                            setVouchers([...vouchers, selectedVoucher])
                            setIsLoading(false);
                            voucherActionSheetRef.current?.hide()
                        }, 500);
                    }}
                >
                    <TextWithFont
                        text={i18n.language === "ar" ? 'تأكيد' : 'Confirm'}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    />
                </TouchableOpacity>
            </ActionSheet>
        )
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
                        <HeaderTitleView title={'Overview'} logo={logo} isProfile={true}/>,
                    headerRight: () => (
                        isLoading && <ActivityIndicator size={26} color="white"/>
                    ),
                    headerStyle: {
                        backgroundColor: "#f8b91c"
                    }
                }}
            />
            {orderNoteSheet()}
            {updateItemSheet()}
            {voucherSheet()}
            {/* order from */}
            <View
                style={{
                    width: "100%",
                    marginTop: 10,
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
                        width: "100%",
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
            <TouchableOpacity
                style={{
                    marginTop: 30,
                    width: "100%",
                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    padding: 10,
                }}
                onPress={() => actionSheetRef.current?.show()}
            >
                <View
                    style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                        justifyContent: "flex-start",
                        marginStart: 5
                    }}
                >
                    <MaterialIcons name="notes" size={24} color="#f8b91c"/>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                            justifyContent: "center",
                            marginStart: 5
                        }}
                    >
                        <TextWithFont
                            text={i18n.language === "ar" ? 'ملاحظات الطلب' : 'Order Note'}
                            style={[
                                {
                                    fontSize: 16,
                                    color: "#000",
                                    marginStart: 10
                                },
                                i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                            ]}
                        />
                        {
                            orderNote.length > 0 &&
                            <TextWithFont
                                text={orderNote}
                                style={{
                                    fontSize: 16,
                                    color: "gray",
                                    marginStart: 10
                                }}
                            />
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                }}
            >
                <TextWithFont
                    text={i18n.language === "ar" ? 'Vouchers' : 'Vouchers'}
                    style={{
                        width: "100%",
                        fontSize: 20,
                        textAlign: "left",
                        margin: 10,
                    }}
                />
                <FlatList
                    data={vouchers}
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        padding: 10,
                        backgroundColor: "white",
                        marginTop: 5,
                    }}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    width: width,
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    backgroundColor: "white",
                                    padding: 10,
                                    marginTop: 5,
                                }}
                            >
                                <MaterialCommunityIcons name="ticket-percent" size={20} color="#000"/>
                                <View
                                    style={{
                                        width: width * 0.6,
                                        flexDirection: "row",
                                        alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
                                        justifyContent: "space-between",
                                        marginStart: 15
                                    }}
                                >
                                    <TextWithFont
                                        text={item.code}
                                        style={[
                                            {
                                                fontSize: 18,
                                                fontWeight: "bold",
                                            },
                                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                        ]}
                                    />
                                    <TextWithFont
                                        text={item.discount + "%"}
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
                                {/* delete button */}
                                <TouchableOpacity
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        marginStart: 10
                                    }}
                                    onPress={() => {
                                        setIsLoading(true);
                                        setTimeout(() => {
                                            setVouchers(vouchers.filter((voucher) => voucher.code !== item.code));
                                            setIsLoading(false);
                                        }, 500);
                                    }}
                                >
                                    <AntDesign name="delete" size={24} color="#dc3545"/>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    ListFooterComponent={() => {
                        return (
                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    backgroundColor: "#fff",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                }}
                                onPress={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        voucherActionSheetRef.current?.show();
                                    }, 500);
                                }}
                            >
                                <TextWithFont
                                    text={i18n.language === "ar" ? 'أضف كوبون' : 'Add Voucher'}
                                    style={{
                                        width: "100%",
                                        fontSize: 16,
                                        color: "#f8b91c",
                                        textAlign: "left",
                                    }}
                                />
                            </TouchableOpacity>
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
                    text={i18n.language === "ar" ? 'Item(s)' : 'Item(s)'}
                    style={{
                        width: "100%",
                        fontSize: 20,
                        textAlign: "left",
                        margin: 10,
                    }}
                />
                <FlatList
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "white",
                    }}
                    contentContainerStyle={{
                        width: "100%",
                    }}
                    data={getCart()}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    backgroundColor: "white",
                                    padding: 10,
                                    marginTop: 5,
                                }}
                                onPress={() => {
                                    setIsLoading(true)
                                    setSelectedItem(item)
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        itemActionSheetRef.current?.show();
                                    }, 1000)
                                }}
                            >
                                <Image
                                    source={{uri: item.image}}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
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
                                    }}
                                >
                                    <TextWithFont
                                        text={item.name}
                                        style={[
                                            {
                                                fontSize: 18,
                                                fontWeight: "bold",
                                            },
                                            i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                        ]}
                                    />
                                    {
                                        vouchers.length > 0 ? (
                                            <View>
                                                <TextWithFont
                                                    text={`${item.price * item.quantity - (item.price * item.quantity * vouchers[0].discount / 100)} KWD`}
                                                    style={[
                                                        {
                                                            fontSize: 14,
                                                            fontWeight: "normal"
                                                        },
                                                        i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                        i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                    ]}
                                                />
                                                <TextWithFont
                                                    text={item.price + " KWD"}
                                                    style={[
                                                        {
                                                            fontSize: 12,
                                                            fontWeight: "normal",
                                                            color: "gray",
                                                            textDecorationLine: "line-through"
                                                        },
                                                        i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                        i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                    ]}
                                                />
                                            </View>
                                        ) : (
                                            <TextWithFont
                                                text={item.price + " KWD"}
                                                style={[
                                                    {
                                                        fontSize: 14,
                                                        fontWeight: "normal"
                                                    },
                                                    i18n.language === "ar" ? {textAlign: "right"} : {textAlign: "left"},
                                                    i18n.language === "ar" ? {marginEnd: 10} : {marginStart: 10}
                                                ]}
                                            />
                                        )
                                    }
                                </View>
                                <TextWithFont
                                    text={`x${item.quantity}`}
                                    style={{
                                        fontSize: 14,
                                        marginStart: 10,
                                        color: "gray"
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    height: 2,
                                    backgroundColor: "#efefef",
                                }}
                            />
                        );
                    }}
                    ListFooterComponent={() => {
                        return (
                            <View
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    backgroundColor: "white",
                                    marginTop: 10,
                                    flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <TextWithFont
                                    text={i18n.language === "ar" ? 'المجموع' : 'Subtotal'}
                                    style={{
                                        fontSize: 18,
                                        margin: 10,
                                    }}
                                />
                                {
                                    vouchers.length > 0 ? (
                                        <View>
                                            <TextWithFont
                                                text={`${totalPriceInCart() - (totalPriceInCart() * vouchers[0].discount / 100)} KWD`}
                                                style={{
                                                    fontSize: 18,
                                                    textAlign: "center",
                                                }}
                                            />
                                            <TextWithFont
                                                text={totalPriceInCart() + " KWD"}
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    color: "gray",
                                                    textDecorationLine: "line-through"
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <TextWithFont
                                            text={`${totalPriceInCart()} KWD`}
                                            style={{
                                                fontSize: 18,
                                                textAlign: "center",
                                            }}
                                        />
                                    )
                                }
                            </View>
                        )
                    }}
                />
            </View>
            <TouchableOpacity
                style={{
                    width: "100%",
                    padding: 10,
                    backgroundColor: "#f8b91c",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                }}
                onPress={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        setOrder({
                            foodTruck: foodTruck,
                            orderNote: orderNote,
                            items: getCart(),
                            vouchers: vouchers,
                            subTotal: totalPriceInCart(),
                            total: vouchers.length > 0 ? totalPriceInCart() - (totalPriceInCart() * vouchers[0].discount / 100) : totalPriceInCart(),
                            createTime: new Date(),
                        });
                        navigation.navigate("checkout");
                    }, 500);
                }}
            >
                {
                    isLoading ?
                        <ActivityIndicator size={26} color="white"/>
                        :
                        <TextWithFont
                            text={i18n.language === "ar" ? 'تأكيد الطلب' : 'Confirm Order'}
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "white"
                            }}
                        />
                }
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}