import {Stack, useRouter, useSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getEvent} from "../../../services/EventsServices";
import {
    Dimensions,
    SafeAreaView,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Linking,
    Platform,
    TouchableOpacity, RefreshControl
} from "react-native";
import {CreateResponsiveStyle} from "rn-responsive-styles";
import {getHeaderImage} from "../../../services/HeadersImagesServices";
import CustomCarousel from "../CustomCarousel";
import {format, parseISO} from "date-fns";
import {Entypo} from "@expo/vector-icons";
import {forkJoin} from "rxjs";

const {width} = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default () => {

    const params = useSearchParams();

    const [showIndicator, setShowIndicator] = useState(false);
    const [event, setEvent] = useState(null);
    const [headerImage, setHeaderImage] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const router = useRouter();

    const styles = useStyles();

    useEffect(() => {

        if (!params) {
            router.push("/");
        }

    }, []);

    useEffect(() => {

        fetchData(false);

    }, [params.event]);

    const fetchData = (fromIsRefreshing) => {

        if (fromIsRefreshing) {
            setIsRefreshing(true);
        } else {
            setShowIndicator(true);
        }


        if (params.event) {

            forkJoin([getEvent(params.event), getHeaderImage(params.i)])
                .subscribe(([eventResponse, headerImageResponse]) => {
                    setEvent(eventResponse);
                    setHeaderImage(headerImageResponse);
                    setIsRefreshing(false);
                    setShowIndicator(false);
                });
        }
    }

    const indicator = showIndicator ? <ActivityIndicator size="large" color="#0000ff"/> : null;

    const viewTitle = (event) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}
            >
                {
                    event !== null && (
                        <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 15}}>{event.nameEng}</Text>)
                }
            </View>
        );
    };

    const formatDate = (date) => {
        return format(parseISO(date), "dd MMMM yyyy");
    }

    const openGps = (location) => {

        if (isWeb) {
            window.open(location, "_blank");
            return;
        }

        const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
        const url = scheme + `${location}`;
        Linking.openURL(url);
    };

    return (
        <SafeAreaView
            style={styles.container}
        >

            <Stack.Screen
                options={{
                    headerLargeTitle: true,
                    title: event && event.nameEng
                }}
            />

            {indicator}

            {
                event !== null && (
                    <ScrollView
                        style={{
                            flex: 1,
                            backgroundColor: "white",
                            width: width
                        }}
                        contentContainerStyle={{
                            alignItems: "center",
                            padding: 15
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchData(true)}
                            />
                        }
                    >
                        {
                            headerImage !== null && <CustomCarousel images={[headerImage.imageUrl]}/>
                        }
                        <View>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginBottom: 15,
                                    marginTop: 15,
                                    textAlign: "left"
                                }}
                            >
                                {event?.descriptionEng}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                marginTop: 30
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                From
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                To
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                marginTop: 30
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    textAlign: 'center'
                                }}
                            >
                                {formatDate(event?.startDate)}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    textAlign: 'center'
                                }}
                            >
                                {formatDate(event?.endDate)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row-reverse",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                padding: 15,
                                marginTop: 40,
                                backgroundColor: "#5bc0de",
                                borderRadius: 10,
                            }}
                            onPress={() => openGps(event.location)}
                        >
                            <Entypo name="location" size={18} color="white"/>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: "white",
                                    marginRight: 10
                                }}
                            >
                                Location
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                )
            }
        </SafeAreaView>
    );
}

const useStyles = CreateResponsiveStyle(
    {
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: width,
            backgroundColor: "white"
        }
    }
);
