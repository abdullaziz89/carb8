import {View, Text, Platform, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HeaderTitleView from "../(home)/HeaderTitleView";
import {Stack, useNavigation, useRouter} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {login} from "../../services/UserService";
import {useAppStateStore} from "../../store/app-store";

export default () => {

    const navigation = useNavigation();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const {getUser, setLogin, setUser, setUsername, setVerified, setToken} = useAppStateStore();

    const {register, setValue, handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            username: "abdullaziz89@hotmail.com",
            password: "1234"
        },
    });

    const inputs = [
        {
            name: 'username',
            label: 'Username',
            required: true,
            secureTextEntry: false
        },
        {
            name: 'password',
            label: 'Password',
            required: true,
            secureTextEntry: true
        }
    ];

    const onSubmit = (data) => {
        setIsLoading(true);
        // check data not empty
        if (data.username && data.password) {
            login(data)
                .then(async (response) => {
                    setIsLoading(false);
                    //  ('login.js response', response);
                    const token = response.data.token;
                    const user = response.data.user;
                    setToken(token);
                    setUser(user);
                    setVerified(true);
                    setLogin(true);
                    router.replace('(user)/profile');
                })
                .catch((error) => {
                    setIsLoading(false);

                    let response = error.response.data;

                    // if response has entity
                    if (response.username) {
                        if (!response.enable) {
                            setUsername(response.username);
                            navigation.navigate('otp');
                            return;
                        }
                    } else {
                        alert(response.message);
                    }
                });
        }
    }

    const inputItem = ({name, label, required, secureTextEntry}, index) => {
        return (
            <View
                key={index}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20
                }}
            >
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={label}
                            secureTextEntry={secureTextEntry}
                            keyboardType={name === 'username' ? 'email-address' : 'default'}
                        />
                    )}
                    name={name}
                    rules={{
                        required: required ? `${label} is required` : false
                    }}
                />
            </View>
        )
    }

    const indicatorView = () => {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator size="large" color="#f8b91c"/>
            </View>
        )
    }

    if (isLoading) {
        return indicatorView();
    }

    return (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                backgroundColor: "#efefe0f"
            }}
            contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center"
            }}
            scrollEnabled={true}
        >
            <Stack.Screen
                options={{
                    headerLargeTitle: true,
                    title: "Login",
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
            <View>
                <Image
                    source={require("../../assets/login-food-truck.png")}
                    style={{
                        width: 300,
                        height: 300,
                        marginBottom: 10
                    }}
                />
                <View
                    style={{
                        width: "100%",
                        alignItems: "flex-start",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontFamily: 'BalsamiqSans_400Regular',
                        }}
                    >
                        Login to your {"\n"}
                        <Text style={{fontWeight: "bold",}}>Food Truck</Text>
                    </Text>
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {
                    inputs.map((input, index) => inputItem(input, index))
                }
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 20,
                            textAlign: 'center',
                            lineHeight: 40,
                            fontFamily: 'BalsamiqSans_400Regular',
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/register");
                    }}
                >
                    <Text
                        style={{
                            marginTop: 20,
                            fontSize: 14,
                            textAlign: 'center',
                            lineHeight: 25,
                            fontFamily: 'BalsamiqSans_400Regular',
                        }}
                    >
                        You don't have <Text style={{fontWeight: 'bold'}}>food truck</Text> account?{"\n"}
                        <Text
                            style={{
                                color: '#f8b91c',
                            }}
                        >
                            Register it here
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    label: {
        color: '#000',
        margin: 15,
        marginLeft: 20,
        textAlign: 'left',
        width: '80%',
        fontFamily: 'BalsamiqSans_400Regular',
    },
    button: {
        marginTop: 40,
        color: 'white',
        height: 40,
        backgroundColor: '#f8b91c',
        borderRadius: 4,
        width: '80%',
        fontFamily: 'BalsamiqSans_400Regular',
    },
    input: {
        backgroundColor: 'white',
        width: '80%',
        height: 40,
        padding: 10,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        fontFamily: 'BalsamiqSans_400Regular',
    },
})
