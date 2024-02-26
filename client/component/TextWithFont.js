import { Text } from "react-native";
import {useEffect} from "react";
import {BalsamiqSans_700Bold} from "@expo-google-fonts/balsamiq-sans";

export default ({text, style}) => {

    return (
        <Text
            style={[style, {
                fontFamily: style.fontWeight === 'bold' ? 'BalsamiqSans_700Bold' : 'BalsamiqSans_400Regular'
            }]}
        >
            {text}
        </Text>
    );
}
