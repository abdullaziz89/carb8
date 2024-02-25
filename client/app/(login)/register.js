import {View, Text, Platform, TouchableOpacity, TextInput, StyleSheet, FlatList, ScrollView} from "react-native";
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
import {forkJoin} from "rxjs";
import {getHeadersImages} from "../../services/HeadersImagesServices";

const placeholderImage = require("../../assets/set-logo-placeholder.png");

export default () => {

    const navigation = useNavigation();
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(null);
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const params = useSearchParams();

    useEffect(() => {
        fetchData();
        console.log("selectedGovernorate", params.selectedGovernorate);
    }, []);

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
            foodTruck: {
                nameEng: "",
                nameArb: "",
                descriptionEng: "",
                descriptionArb: "",
                cuisineId: "",
            },
            address: {
                governorateId: "",
                address: "",
                googleLocation: "",
                googleLat: 0,
                googleLng: 0
            },
            information: {
                FoodTruckWorkingDays: "",
                phoneNumber: "",
                instagramAccount: "",
            }
        }
    });

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
                                    rules={{required: "Food Truck Name is required"}}
                                />
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
                                    name="foodTruck.nameEng"
                                    rules={{required: "Food Truck Name is required"}}
                                />
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
                    rules={{required: "Description is required"}}
                />
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
                    rules={{required: "Description is required"}}
                />
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
                    text={"Select your food Cuisine"}
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
                <View
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 10,
                        borderColor: "black",
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: "100%",
                        }}
                        onPress={() => {
                            navigation.navigate("governorates");
                        }}
                    >
                        <TextWithFont
                            text={"Select Governorate"}
                            style={{
                                fontSize: 16,
                            }}
                        />
                    </TouchableOpacity>
                </View>
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
