import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Keyboard, TextInput, TouchableOpacity, View} from "react-native";
import TextWithFont from "../../component/TextWithFont";
import {Stack, useSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {MaterialIcons} from "@expo/vector-icons";

export default () => {

    const {email} = useSearchParams();
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const {register, setValue, handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            otp: '',
        }
    });

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

    const onSubmit = (data) => {
        console.log(data);
    }

    const replaceEmail = (email) => {
        // replace some part of email with asterisk
        const parts = email.split('@');
        const username = parts[0];
        const domain = parts[1];
        const usernameLength = username.length;
        const usernameAsterisk = '*'.repeat(usernameLength - 3);
        const usernameReplaced = username.replace(username.substring(3, usernameLength), usernameAsterisk);
        return `${usernameReplaced}@${domain}`;
    }

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: 20,
                paddingBottom: keyboardHeight,
                backgroundColor: '#efefef'
            }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
        >
            <Stack.Screen
                options={{
                    headerLargeTitle: true,
                    title: "Verify your email",
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
                <TextWithFont
                    text={`We have sent an OTP to \n ${replaceEmail(email)}`}
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 20,
                        lineHeight: 30
                    }}
                />
            </View>
            <View
                style={{
                    marginTop: 20,
                    width: '100%',
                }}
            >
                <TextWithFont
                    text={`Please enter the OTP to verify your email`}
                    style={{fontSize: 16}}
                />
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: 'black',
                                padding: 10,
                                marginTop: 20,
                                borderRadius: 5,
                                width: '100%',
                                backgroundColor: 'white'
                            }}
                            placeholder="Enter OTP"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="number-pad"
                        />
                    )}
                    name="otp" rules={{required: 'OTP is required'}}
                />
                {errors.otp &&
                    <TextWithFont text={errors.otp.message} style={{color: 'red', marginTop: 5, marginLeft: 5}}/>}
            </View>
            <TouchableOpacity
                style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#f8b91c',
                    borderRadius: 5,
                    marginTop: 20,
                    alignItems: 'center'
                }}
                onPress={handleSubmit(onSubmit)}
            >
                <TextWithFont text="Verify" style={{color: 'white', fontSize: 16}}/>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    );
}
