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
    Dimensions, Keyboard, ActivityIndicator
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../(menu)/HeaderTitleView";
import {Stack, useNavigation, useRouter, useLocalSearchParams} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import TextWithFont from "../../component/TextWithFont";
import {getCuisine, updateCuisineView} from "../../services/CuisineServices";
import {DAYS} from "../../utils/Utils";
import {registerFoodTruck} from "../../services/FoodTruckServices";
import {useAppState, useAppStateStore} from "../../store/app-store";

const placeholderImage = require("../../assets/set-logo-placeholder.png");
const {width, height} = Dimensions.get("window");

export default () => {

    const {setUser, setUserType, getSelectedGovernorate, setSelectedGovernorateOpt} = useAppStateStore()
    const navigation = useNavigation();
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(null);
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedGovernorate, setSelectedGovernorate] = useState(getSelectedGovernorate());
    const [foodTruckWorkingDays, setFoodTruckWorkingDays] = useState([]);
    const [selectedFoodTruckWorkingDays, setSelectedFoodTruckWorkingDays] = useState(null);
    const [foodTruckWorkingDaysModelShow, setFoodTruckWorkingDaysModelShow] = useState(false);
    const [showDaysModal, setShowDaysModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {

        if (getSelectedGovernorate() !== null) {
            setSelectedGovernorate(getSelectedGovernorate());
            setSelectedGovernorateOpt(null);
        }

    }, [getSelectedGovernorate()]);

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
                 ("error", error);
            });
    };

    const {register, setValue, handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            user: {
                email: "abdullaziz89@hotmail.com",
                password: "1234",
            },
            foodTruck: {
                nameEng: "Test Food Truck",
                nameArb: "فود تراك تجريبي",
                descriptionEng: "Test Food Truck Description",
                descriptionArb: "وصف فود تراك تجريبي",
            },
            address: {
                address: "Test Address",
                googleLocation: "",
                googleLat: 0,
                googleLng: 0
            },
            information: {
                phoneNumber: "12345678",
                instagramAccount: "test",
            }
        }
    });

    const onSubmit = async (data) => {

        // if image is not selected
        if (!selectedImage) {
            alert("Please select your food truck logo");
            return;
        }

        // if cuisine is not selected
        if (!selectedCuisine) {
            alert("Please select your food cuisine");
            return;
        }

        // if governorate is not selected
        if (!selectedGovernorate) {
            alert("Please select your governorate");
            return;
        }

        setIsLoading(true);
        data = {
            ...data,
            foodTruck: {
                ...data.foodTruck,
                cuisineId: selectedCuisine,
            },
            address: {
                ...data.address,
                governorateId: selectedGovernorate.id,
            },
            information: {
                ...data.information,
                FoodTruckWorkingDay: foodTruckWorkingDays.map((item) => {
                    return {
                        day: item.day,
                        workingFrom: item.from,
                        workingTo: String(item.to)
                    }
                })
            }
        }

        const formData = new FormData();
        formData.append("payload", JSON.stringify(data));

        // upload image with form data
        if (selectedImage) {
            formData.append("files", {
                uri: Platform.OS === 'ios' ?
                    selectedImage.replace('file://', '')
                    : selectedImage,
                type: "image/jpeg",
                name: "logo.jpg"
            });
        }

        await registerFoodTruck(formData)
            .then((response) => {
                setIsLoading(false);
                setUser(response);
                setUserType("foodTruck");
                router.push("otp");
            })
            .catch((error) => {
                const message = error.response.data.message;
                setIsLoading(false);
                alert(message);
            });
    };

    // pick image from gallery
    const pickImage = async () => {

        // image aspect ratio rounded logo

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
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
                    selectedCuisine === item.id ? {backgroundColor: "#226377"} : {backgroundColor: "#fff"},
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
                    placeholder={require("../../assets/carb8-logo-placeholder.png")}
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
                                borderColor: "#226377",
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
                                keyboardType={"number-pad"}
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
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                backgroundColor: "#226377",
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
                    borderColor: "#226377",
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

    const indicatorView = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator
                    size={"large"}
                    color={"#226377"}
                />
            </View>
        )
    }

    if (isLoading) {
        return indicatorView();
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
                        backgroundColor: "#226377"
                    }
                }}
            />
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#226377",
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
                                    width: 135,
                                    height: 135,
                                    borderRadius: 100,
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
                        borderColor: "#226377",
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                        navigation.navigate("governorates");
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
                            placeholder={"Enter Phone Number"}
                            keyboardType={"phone-pad"}
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
                            placeholder={"Enter Instagram Account"}
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
                        <MaterialIcons name={"add"} size={24} color={"#226377"}/>
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
                                    borderColor: "#226377",
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
                            keyboardType={"email-address"}
                        />
                    )}
                    name="user.email"
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid Email"
                        }
                    }}
                />
                {errors.user?.email && <Text style={{
                    color: "red",
                    marginTop: 5,
                    marginLeft: 5
                }}>{errors.user?.email.message}</Text>}
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
                            secureTextEntry={true}
                        />
                    )}
                    name="user.password"
                    rules={{required: "Password is required"}}
                />
                {errors.user?.password &&
                    <Text
                        style={{
                            color: "red",
                            marginTop: 5,
                            marginLeft: 5
                        }}
                    >
                        {errors.user?.password.message}
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
                        backgroundColor: "#226377",
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
                        backgroundColor: "#226377",
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                         ("onSubmit")
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
