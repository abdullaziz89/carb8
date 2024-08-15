import {AntDesign, Feather} from "@expo/vector-icons";

export const icons = {
    home: (props) => <AntDesign name="home" size={26} {...props} />,
    auth: (props) => <Feather name="user" size={26} {...props} />,
    menu: (props) => <Feather name="menu" size={26} {...props} />,
    setting: (props) => <AntDesign name="pluscircleo" size={26} {...props} />,
}