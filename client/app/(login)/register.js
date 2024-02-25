import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    ScrollView,
    Modal,
    Dimensions, Keyboard
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../(home)/HeaderTitleView";
import {Stack, useNavigation, useRouter, useSearchParams} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import TextWithFont from "../../component/TextWithFont";
import {getCuisine, updateCuisineView} from "../../services/CuisineServices";
import {DAYS} from "../../utils/Utils";

const placeholderImage = require("../../assets/set-logo-placeholder.png");
const {width, height} = Dimensions.get("window");

export default () => {

    // FoodTruckWorkingDays

    const navigation = useNavigation();
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(null);
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedGovernorate, setSelectedGovernorate] = useState(null);
    const [foodTruckWorkingDays, setFoodTruckWorkingDays] = useState([]);
    const [selectedFoodTruckWorkingDays, setSelectedFoodTruckWorkingDays] = useState(null);
    const [foodTruckWorkingDaysModelShow, setFoodTruckWorkingDaysModelShow] = useState(false);
    const [showDaysModal, setShowDaysModal] = useState(false);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        function onKeyboardDidShow(e) { // Remove type here if not using TypeScript
            setKeyboardHeight(e.endCoordinates.height);
        }

        function onKeyboardDidHide() {
            setKeyboardHeight(0);
        }

        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const addOneDay = (day, forIndex = null) => {
        if (forIndex === null) {
            setFoodTruckWorkingDays([...foodTruckWorkingDays, day]);
        } else {
            let temp = foodTruckWorkingDays;
            temp[forIndex] = day;
            setFoodTruckWorkingDays(temp);
        }
    }

    const setSelectedGovernorateCallback = (gov) => {
        setSelectedGovernorate(gov);
    }

    const fetchData = () => {
        getCuisine()
            .then((cuisines) => {
                setCuisines(cuisines);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const {register, setValue, handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            userAuth: {
                email: "",
                password: "",
            },
            foodTruck: {
                nameEng: "",
                nameArb: "",
                descriptionEng: "",
                descriptionArb: "",
                cuisineId: "",
            },
            address: {
                address: "",
                googleLocation: "",
                googleLat: 0,
                googleLng: 0
            },
            information: {
                phoneNumber: "",
                instagramAccount: "",
            }
        }
    });

    const onSubmit = (data) => {
        console.log("data")
        console.log(data);
    };

    // pick image from gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    }

    const cuisineRenderItem = ({item, index}) => {

        const isFirst = index === 0;

        return (
            <TouchableOpacity
                style={[
                    styles.cuisineRenderItem,
                    selectedCuisine === item.id ? {backgroundColor: "#f8b91c"} : {backgroundColor: "#fff"},
                    {marginStart: isFirst ? 10 : 0}
                ]}
                onPress={() => {
                    setSelectedCuisine(item.id);
                }}
            >
                <Image
                    source={{uri: item.image}}
                    style={[
                        {
                            width: 64,
                            height: 64,
                        },
                        selectedCuisine === item.id ? {borderRadius: 22, backgroundColor: "white"} : {}
                    ]}
                    contentFit={"cover"}
                    placeholder={require("../../assets/kwft-logo-placeholder.png")}
                />
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 10
                    }}
                >
                    {item.nameEng}
                </Text>
            </TouchableOpacity>
        );
    };

    const foodTruckWorkingDaysModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={foodTruckWorkingDaysModelShow}
                onRequestClose={() => {
                    setFoodTruckWorkingDaysModelShow(false);
                }}
            >
                <View
                    style={{
                        width: width,
                        height: height,
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        margin: 0
                    }}
                >
                    <View
                        style={{
                            height: (height * 0.45) + keyboardHeight + 20,
                            backgroundColor: "#fff",
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 1,
                                height: 1
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3,
                            elevation: 20
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                alignItems: "flex-end",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: 30,
                                    height: 30,
                                    alignItems: "flex-end",
                                }}
                            >
                                <MaterialIcons
                                    name={"close"}
                                    size={24}
                                    color={"red"}
                                    onPress={() => {
                                        setFoodTruckWorkingDaysModelShow(false);
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                backgroundColor: "white",
                                padding: 10,
                                borderRadius: 10,
                                borderColor: "#f8b91c",
                                borderWidth: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10
                            }}
                            onPress={() => {
                                setShowDaysModal(true);
                            }}
                        >
                            {
                                selectedFoodTruckWorkingDays ? (
                                    <TextWithFont
                                        text={selectedFoodTruckWorkingDays.day}
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                ) : (
                                    <TextWithFont
                                        text={"Select Day"}
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                )
                            }
                        </TouchableOpacity>
                        <View
                            style={{
                                marginTop: 10,
                                width: "100%",
                            }}
                        >
                            <TextWithFont
                                text={"From"}
                                style={{
                                    fontSize: 16,
                                }}
                            />
                            <TextInput
                                style={{
                                    width: "100%",
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 10,
                                    marginTop: 10,
                                    backgroundColor: "white"
                                }}
                                placeholder={"From"}
                                onChange={(e) => {
                                    const text = e.nativeEvent.text;

                                    let temp = foodTruckWorkingDays;
                                    const objIndex = foodTruckWorkingDays.findIndex((item) => item.day === selectedFoodTruckWorkingDays.day);
                                    temp[objIndex].from = text;
                                    setFoodTruckWorkingDays(temp);
                                }}
                            />
                            <TextWithFont
                                text={"To"}
                                style={{
                                    fontSize: 16,
                                    marginTop: 10
                                }}
                            />
                            <TextInput
                                style={{
                                    width: "100%",
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 10,
                                    marginTop: 10,
                                    backgroundColor: "white"
                                }}
                                placeholder={"To"}
                                onChange={(e) => {
                                    const text = Number(e.nativeEvent.text) + 12;

                                    let temp = foodTruckWorkingDays;
                                    const objIndex = foodTruckWorkingDays.findIndex((item) => item.day === selectedFoodTruckWorkingDays.day);
                                    temp[objIndex].to = text;
                                    setFoodTruckWorkingDays(temp);
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                backgroundColor: "#f8b91c",
                                padding: 10,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 20
                            }}
                            onPress={() => {

                                if (!foodTruckWorkingDays) {
                                    return;
                                }

                                const objIndex = foodTruckWorkingDays.findIndex((item) => item.day === selectedFoodTruckWorkingDays.day);

                                // check if from and to are empty
                                if (foodTruckWorkingDays[objIndex].from === "" ||
                                    foodTruckWorkingDays[objIndex].to === "") {
                                    return;
                                }

                                setFoodTruckWorkingDaysModelShow(false);
                            }}
                        >
                            <TextWithFont
                                text={"Add"}
                                style={{
                                    fontSize: 16,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    const daysModal = () => {

        const days = DAYS.filter((day) => {
            return foodTruckWorkingDays.findIndex((item) => item.day === day.name) === -1;
        });

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDaysModal}
                onRequestClose={() => {
                    setShowDaysModal(false);
                }}
            >
                <View
                    style={{
                        width: width,
                        height: height,
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        margin: 0
                    }}
                >
                    <View
                        style={{
                            height: (height * 0.60) + 20,
                            backgroundColor: "#fff",
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 1,
                                height: 1
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3,
                            elevation: 20
                        }}
                    >
                        {
                            days.map((day, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            padding: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#f1f1f1"
                                        }}
                                        onPress={() => {
                                            const obj = {
                                                index: index,
                                                day: day.name,
                                                from: "",
                                                to: ""
                                            }
                                            addOneDay(obj);
                                            setSelectedFoodTruckWorkingDays(obj)
                                            setShowDaysModal(false);
                                        }}
                                    >
                                        <TextWithFont
                                            text={day.name}
                                            style={{
                                                fontSize: 18,
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            </Modal>
        )
    }

    const foodTruckWorkingDaysRenderItem = ({item, index}) => {
        return (
            <View
                style={{
                    width: 100,
                    height: 100,
                    padding: 10,
                    marginEnd: 20,
                    borderRadius: 10,
                    borderColor: "#f8b91c",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <TextWithFont
                    text={item.day}
                    style={{
                        fontSize: 16,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    <TextWithFont
                        text={item.from}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <Text>-</Text>
                    <TextWithFont
                        text={item.to}
                        style={{
                            fontSize: 16,
                        }}
                    />
                </View>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{
                width: "100%",
            }}
            contentContainerStyle={{
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}

        >
            <Stack.Screen
                options={{
                    headerLargeTitle: true,
                    title: "Register",
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
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8b91c",
                    paddingTop: Platform.OS === "ios" ? 50 : 25,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        padding: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            marginBottom: 20,
                            fontFamily: 'BalsamiqSans_400Regular',
                        }}
                    >
                        Register your {"\n"}
                        <Text style={{fontWeight: "bold",}}>Food Truck</Text>
                    </Text>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <TouchableOpacity
                            onPress={pickImage}
                        >
                            <Image
                                source={selectedImage ? {uri: selectedImage} : placeholderImage}
                                style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: 65,
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                padding: 10,
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                }}
                            >
                                <TextWithFont
                                    text={"Food Truck name in english"}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                                <Controller
                                    control={control}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            style={{
                                                borderColor: "black",
                                                borderRadius: 10,
                                                padding: 10,
                                                marginTop: 10,
                                                backgroundColor: "white"
                                            }}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            placeholder={"Enter Food Truck Name in English"}
                                        />
                                    )}
                                    name="foodTruck.nameEng"
                                    rules={{required: "Food Truck name in english is required"}}
                                />
                                {errors.foodTruck?.nameEng && <Text style={{
                                    color: "red",
                                    marginTop: 5,
                                    marginLeft: 5
                                }}>{errors.foodTruck?.nameEng.message}</Text>}
                            </View>
                            <View
                                style={{
                                    marginTop: 15
                                }}
                            >
                                <TextWithFont
                                    text={"Food Truck name in arabic"}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                                <Controller
                                    control={control}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            style={{
                                                borderColor: "black",
                                                borderRadius: 10,
                                                padding: 10,
                                                marginTop: 10,
                                                backgroundColor: "white"
                                            }}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            placeholder={"Enter Food Truck name in arabic"}
                                        />
                                    )}
                                    name="foodTruck.nameArb"
                                    rules={{required: "Food Truck name in arabic is required"}}
                                />
                                {errors.foodTruck?.nameArb && <Text style={{
                                    color: "red",
                                    marginTop: 5,
                                    marginLeft: 5
                                }}>{errors.foodTruck?.nameArb.message}</Text>}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {/*descriptions view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 15,
                }}
            >
                <TextWithFont
                    text={"Description in English"}
                    style={{
                        fontSize: 16,
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white"
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter Description in English"}
                        />
                    )}
                    name="foodTruck.descriptionEng"
                    rules={{required: "Description in english is required"}}
                />
                {errors.foodTruck?.descriptionEng && <Text style={{
                    color: "red",
                    marginTop: 5,
                    marginLeft: 5
                }}>{errors.foodTruck?.descriptionEng.message}</Text>}
                <TextWithFont
                    text={"Description in Arabic"}
                    style={{
                        fontSize: 16,
                        marginTop: 20
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white"
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter Description in Arabic"}
                        />
                    )}
                    name="foodTruck.descriptionArb"
                    rules={{required: "Description is arabic is required"}}
                />
                {errors.foodTruck?.descriptionArb && <Text style={{
                    color: "red",
                    marginTop: 5,
                    marginLeft: 5
                }}>{errors.foodTruck?.descriptionArb.message}</Text>}
            </View>
            {/*select cuisine view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                }}
            >
                <TextWithFont
                    text={"Select your food cuisine"}
                    style={{
                        fontSize: 16,
                    }}
                />
                <FlatList
                    style={{
                        marginTop: 10,
                    }}
                    contentContainerStyle={{
                        padding: 10,
                    }}
                    data={cuisines}
                    renderItem={cuisineRenderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {/*address view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 10,
                        borderColor: "#f8b91c",
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                        navigation.navigate("governorates", {
                            setSelectedGovernorate: (gov) => setSelectedGovernorateCallback(gov)
                        });
                    }}
                >
                    {
                        selectedGovernorate ? (
                            <TextWithFont
                                text={selectedGovernorate.nameEng}
                                style={{
                                    fontSize: 16,
                                }}
                            />
                        ) : (
                            <TextWithFont
                                text={"Select Governorate"}
                                style={{
                                    fontSize: 16,
                                }}
                            />
                        )
                    }
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                >
                    <TextWithFont
                        text={"Address"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={{
                                    borderColor: "black",
                                    borderRadius: 10,
                                    padding: 10,
                                    marginTop: 10,
                                    backgroundColor: "white",
                                    alignItems: "flex-start",
                                }}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={"Enter Address"}
                                multiline={true}
                                numberOfLines={4}
                            />
                        )}
                        name="address.address"
                        rules={{required: "Address is required"}}
                    />
                    {errors.address?.address && <Text
                        style={{color: "red", marginTop: 5, marginLeft: 5}}>{errors.address?.address.message}</Text>}
                </View>
                <View
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                >
                    <TextWithFont
                        text={"Google Location (Link)"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={{
                                    borderColor: "black",
                                    borderRadius: 10,
                                    padding: 10,
                                    marginTop: 10,
                                    backgroundColor: "white",
                                    alignItems: "flex-start",
                                }}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={"Enter google location link"}
                            />
                        )}
                        name="address.googleLocation"
                    />
                </View>
                <View
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                >
                    <TextWithFont
                        text={"Google Latitude & Longitude"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{
                                        width: "48%",
                                        borderColor: "black",
                                        borderRadius: 10,
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: "white",
                                        alignItems: "flex-start",
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={"Enter google latitude"}
                                />
                            )}
                            name="address.googleLat"
                        />
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{
                                        width: "48%",
                                        borderColor: "black",
                                        borderRadius: 10,
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: "white",
                                        alignItems: "flex-start",
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={"Enter google longitude"}
                                />
                            )}
                            name="address.googleLng"
                        />
                    </View>
                </View>
            </View>
            {/*information view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                }}
            >
                <TextWithFont
                    text={"Phone Number"}
                    style={{
                        fontSize: 16,
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white",
                                alignItems: "flex-start",
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter google latitude"}
                        />
                    )}
                    name="information.phoneNumber"
                    rules={{
                        required: "Phone Number is required",
                        pattern: {
                            value: /^[0-9]{8}$/,
                            message: "Invalid Phone Number"
                        }
                    }}
                />
                {
                    errors.information?.phoneNumber &&
                    <Text style={{
                        color: "red",
                        marginTop: 5,
                        marginLeft: 5
                    }}>
                        {errors.information?.phoneNumber.message}
                    </Text>
                }
                {/*phone number patterns error*/}
                <TextWithFont
                    text={"Instagram Account"}
                    style={{
                        fontSize: 16,
                        marginTop: 20
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white",
                                alignItems: "flex-start",
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter google latitude"}
                        />
                    )}
                    name="information.instagramAccount"
                    rules={{required: "Instagram Account is required"}}
                />
                {errors.information?.instagramAccount && <Text style={{
                    color: "red",
                    marginTop: 5,
                    marginLeft: 5
                }}>{errors.information?.instagramAccount.message}</Text>}
                <View
                    style={{
                        marginTop: 20,
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <TextWithFont
                        text={"Working Days"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setFoodTruckWorkingDaysModelShow(true);
                        }}
                    >
                        <MaterialIcons name={"add"} size={24} color={"#f8b91c"}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{
                        marginTop: 10,
                    }}
                    contentContainerStyle={{
                        padding: 10,
                    }}
                    data={foodTruckWorkingDays}
                    renderItem={foodTruckWorkingDaysRenderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => {
                        return (
                            <TouchableOpacity
                                style={{
                                    width: 100,
                                    height: 100,
                                    padding: 10,
                                    marginEnd: 20,
                                    borderRadius: 10,
                                    borderColor: "#f8b91c",
                                    borderWidth: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress={() => {
                                    setFoodTruckWorkingDaysModelShow(true);
                                }}
                            >
                                <TextWithFont
                                    text={"Add Day"}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
                {
                    foodTruckWorkingDaysModal()
                }
                {
                    daysModal()
                }
            </View>
            {/*user auth view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                }}
            >
                <TextWithFont
                    text={"Email"}
                    style={{
                        fontSize: 16,
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white",
                                alignItems: "flex-start",
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter Email"}
                        />
                    )}
                    name="userAuth.email"
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid Email"
                        }
                    }}
                />
                {errors.userAuth?.email && <Text style={{
                    color: "red",
                    marginTop: 5,
                    marginLeft: 5
                }}>{errors.userAuth?.email.message}</Text>}
                {/*email patterns error*/}
                <TextWithFont
                    text={"Password"}
                    style={{
                        fontSize: 16,
                        marginTop: 20
                    }}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={{
                                borderColor: "black",
                                borderRadius: 10,
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: "white",
                                alignItems: "flex-start",
                            }}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={"Enter Password"}
                        />
                    )}
                    name="userAuth.password"
                    rules={{required: "Password is required"}}
                />
                {errors.userAuth?.password &&
                    <Text
                        style={{
                            color: "red",
                            marginTop: 5,
                            marginLeft: 5
                        }}
                    >
                    {errors.userAuth?.password.message}
                </Text>
                }
            </View>
            {/*submit view*/}
            <View
                style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <TouchableOpacity
                    style={{
                        width: "48%",
                        backgroundColor: "#f8b91c",
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <TextWithFont
                        text={"Cancel"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: "48%",
                        backgroundColor: "#f8b91c",
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                        console.log("onSubmit")
                        handleSubmit(onSubmit)();
                    }}
                >
                    <TextWithFont
                        text={"Submit"}
                        style={{
                            fontSize: 16,
                        }}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    cuisineRenderItem: {
        flexDirection: "column",
        alignItems: "center",
        width: 100,
        height: 140,
        paddingTop: 15,
        marginEnd: 20,
        borderRadius: 35,
    }
});
