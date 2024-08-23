import {Image} from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import {Dimensions, Platform, TouchableOpacity} from "react-native";
import {CreateResponsiveStyle, DEVICE_SIZES} from "rn-responsive-styles";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {updateHeaderImageView} from "../../services/HeadersImagesServices";
import AllSportsPlaceholderImage from "../../assets/carb8-logo-placeholder.png";

const {width, height} = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default (props) => {

    const {images, clickable} = props;
    const [filteredImages, setFilteredImages] = useState([]);

    const styles = useStyles();

    const router = useRouter();

    useEffect(() => {
        if (images.length > 0) {
            const filteredImages = images
                .filter((item) => {
                    const split = String(item).split("/");
                    return split[split.length - 1].split(".")[0] !== "logo";
                })

            setFilteredImages(filteredImages);
        } else {
            setFilteredImages([AllSportsPlaceholderImage]);
        }
    }, [images]);

    const renderItem = ({item}) => {
        if (clickable) {
            if (item.link === '/') {
                return (
                    <Image
                        source={{uri: item.imageUrl}}
                        style={styles.carouselImage}
                        contentFit={"fill"}
                        contentPosition={"center"}
                        placeholder={require("../../assets/carb8-logo-placeholder.png")}
                    />
                );
            } else {
                return (
                    <TouchableOpacity
                        onPress={() => {

                            updateHeaderImageView(item.id)
                            if (item.linkType === "INTERNAL") {
                                if (item.type === "ACADEMY") {
                                    router.push(`/${item.link}`)
                                } else if (item.type === "EVENT") {
                                    router.push(`/event/${item.link}?i=${item.id}`)
                                }
                            } else if (item.linkType === "EXTERNAL") {

                            }
                        }}
                    >
                        <Image
                            source={{uri: item.imageUrl}}
                            style={styles.carouselImage}
                            contentFit={"cover"}
                            contentPosition={"center"}
                            placeholder={require("../../assets/carb8-logo-placeholder.png")}
                        />
                    </TouchableOpacity>
                );
            }
        } else {
            console.log("==== > item.imageUrl", item)
            return (
                <Image
                    source={{uri: item.ImageUrll}}
                    style={styles.carouselImage}
                    contentFit={"fill"}
                    contentPosition={"center"}
                    placeholder={require("../../assets/carb8-logo-placeholder.png")}
                />
            );
        }
    }

    return (
        <Carousel
            vertical={false}
            width={DEVICE_SIZES.EXTRA_LARGE_DEVICE ? width * 0.75 : DEVICE_SIZES.LARGE_DEVICE ? width * 0.9 : width}
            style={styles.carousel}
            loop={images.length > 1}
            pagingEnabled={true}
            snapEnabled={true}
            autoPlay={images.length > 1}
            autoPlayInterval={10000}
            mode="parallax"
            modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50
            }}
            data={filteredImages}
            renderItem={renderItem}
        />
    )
}

const useStyles = CreateResponsiveStyle(
    {
        carousel: {
            width: width,
            height: 250,
            backgroundColor: "#226377",
        },
        carouselImage: {
            width: width + 10,
            height: 250,
            borderRadius: 15,
            // drop shadow
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    },
    {
        [DEVICE_SIZES.EXTRA_LARGE_DEVICE]: {
            carousel: {
                width: width * 0.75,
                height: width * 0.75 * 0.5
            },
            carouselImage: {
                width: width * 0.75,
                height: width * 0.75 * 0.5
            }
        },
        [DEVICE_SIZES.LARGE_DEVICE]: {
            carousel: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            },
            carouselImage: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            }
        },
        [DEVICE_SIZES.MEDIUM_DEVICE]: {
            carousel: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            },
            carouselImage: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            }
        },
        [DEVICE_SIZES.SMALL_DEVICE]: {
            carousel: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            },
            carouselImage: {
                width: width * 0.9,
                height: width * 0.95 * 0.5
            }
        }
    }
);
