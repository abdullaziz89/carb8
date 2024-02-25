import { Text } from "react-native";

export default ({text, style}) => {
    return (
        <Text
            style={[style, {
                fontFamily: 'BalsamiqSans_400Regular'
            }]}
        >
            {text}
        </Text>
    );
}
