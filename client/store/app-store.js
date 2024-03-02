import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {zustandStorage} from "./mmkv";

export const useAppStateStore = create(
    persist(
        (set, get) => ({
            isLogin: false,
            verified: false,
            welcomePreviews: false,
            token: null,
            cart: [],
            user: {
                user: {
                    id: null,
                    email: null,
                },
                foodTruck: {
                    id: null,
                    nameEng: null,
                    nameArb: null,
                    descriptionEng: null,
                    descriptionArb: null,
                    enable: false,
                    createdDate: Date,
                    modifyDate: Date,
                    cuisineId: null
                },
                address: {
                    id: null,
                    address: null,
                    googleLocation: null,
                    googleLat: null,
                    googleLng: null,
                    enable: false,
                    createdDate: Date,
                    modifyDate: Date,
                    governorateId: null,
                    foodTruckId: null,
                    governorate: {
                        id: null,
                        nameEng: null,
                        nameArb: null,
                        enable: false,
                        createdDate: Date,
                        modifyDate: Date
                    }
                },
                information: {
                    phoneNumber: null,
                    instagramAccount: null,
                    foodTruckId: null,
                    foodTruckWorkingDays: [],
                },
            },
            userType: null,
            options: {
                selectedGovernorate: null,
            },
            setLogin: (login) => set((state) => {
                return {isLogin: login}
            }),
            setCart: (cart) => set({cart}),
            getCart: () => get().cart,
            addCartItem: (item) => set((state) => {
                const cart = state.cart;

                // check if the item is already in the cart and update the quantity
                const index = cart.findIndex((cartItem) => cartItem.id === item.id);
                if (index !== -1) {
                    cart[index].quantity += 1;
                    return {cart}
                } else {
                    cart.push({
                        ...item,
                        quantity: 1
                    });
                    return {cart}
                }
            }),
            removeCartItem: (itemId) => set((state) => {

                // check if the time is already in the cart and update the quantity, if the quantity is 1 remove the item else decrease the quantity
                const cart = state.cart;
                const index = cart.findIndex((cartItem) => cartItem.id === itemId);
                if (index !== -1) {
                    if (cart[index].quantity === 1) {
                        cart.splice(index, 1);
                    } else {
                        cart[index].quantity -= 1;
                    }
                }
                return {cart}
            }),
            quantityInCart: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            itemQuantityInCart: (itemId) => {
                const itemIndex = get().cart.findIndex((cartItem) => cartItem.id === itemId);
                return itemIndex !== -1 ? get().cart[itemIndex].quantity : 0;
            },
            totalPriceInCart: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            setToken: (token) => set({token}),
            getToken: () => get().token,
            isVerified: () => get().verified,
            setVerified: (verified) => set({verified}),
            setWelcomePreviews: (welcomePreviews) => set({welcomePreviews}),
            setUser: (user) => set({user}),
            setUsername: (username) => set({user: {...get().user, email: username}}),
            updateUserInfo: (user) => set({user: {...get().user, ...user}}),
            getUser: () => get().user,
            setUserType: (userType) => set({userType}),
            deleteUserAddress: (addressId) => set((state) => {
                const addresses = state.user.addresses.filter((address) => address.id !== addressId);
                return {user: {...state.user, addresses}}
            }),
            setRefreshTokens: (refreshTokens) => set({refreshTokens}),
            getSelectedGovernorate: () => get().options.selectedGovernorate,
            setSelectedGovernorateOpt: (selectedGovernorate) => set({options: {selectedGovernorate}}),
        }), {
            name: 'kwft-app-storage',
            storage: createJSONStorage(() => zustandStorage),
            version: 1,
        }
    )
);
