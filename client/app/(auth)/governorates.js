// Governorate list view
import {FlatList, Modal, TouchableOpacity, View, Text} from "react-native";
import {useEffect, useState} from "react";
import {getGovernorate} from "../../services/GovernorateService";
import {useNavigation, useRouter, useSearchParams} from "expo-router";
import TextWithFont from "../../component/TextWithFont";
import {useAppStateStore} from "../../store/app-store";

export default function Governorates() {

    const {setSelectedGovernorateOpt} = useAppStateStore()
    const navigation = useNavigation();
    const router = useRouter();
    const [governorates, setGovernorates] = useState([]);
    const params = useSearchParams();

    useEffect(() => {
        getGovernorate()
            .then(data => {
                setGovernorates(data);
            })
            .catch(e => {
                console.log(e);
            })
    }, []);

    return (
        <FlatList
            style={{
                flex: 1,
                width: "100%",
                backgroundColor: "#fff"
            }}
            data={governorates}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: "#f1f1f1"
                        }}
                        onPress={() => {
                            setSelectedGovernorateOpt(item);
                            navigation.goBack();
                        }}
                    >
                        <TextWithFont
                            text={item.nameEng}
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        />
                    </TouchableOpacity>
                )
            }}
            separator={true}
        />
    )
}
