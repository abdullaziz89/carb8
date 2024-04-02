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
            orders: [],
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
                const cartItemIndex = state.cart.findIndex((cartItem) => cartItem.id === item.id);

                if (cartItemIndex !== -1) {
                    // Item exists in cart, increment quantity
                    const updatedCart = state.cart.map((cartItem, index) =>
                        index === cartItemIndex ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem
                    );
                    return {cart: updatedCart};
                } else {
                    // Item does not exist in cart, add new item
                    const updatedCart = [...state.cart, {...item, quantity: 1}];
                    return {cart: updatedCart};
                }
            }),
            removeCartItem: (itemId) => set((state) => {
                const cart = [...state.cart];
                const index = cart.findIndex((cartItem) => cartItem.id === itemId);

                if (index === -1) {
                    console.error(`Item with id ${itemId} not found in cart.`);
                    return;
                }

                if (cart[index].quantity === 1) {
                    return {cart: cart.filter((item, i) => i !== index)};
                } else {
                    const updatedCart = cart.map((item, i) =>
                        i === index ? {...item, quantity: item.quantity - 1} : item
                    );
                    return {cart: updatedCart};
                }
            }),
            quantityInCart: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            itemQuantityInCart: (itemId) => {
                const cart = get().cart;
                const itemIndex = cart.findIndex((cartItem) => cartItem.id === itemId);
                return itemIndex !== -1 ? cart[itemIndex].quantity : 0;
            },
            totalPriceInCart: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            clearCart: () => set({cart: []}),
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
            setOrders: (orders) => set({orders}),
            setItemInOrders: (item) => set((state) => {
                const orders = state.orders;
                orders.push(item);
                return {orders}
            }),
            getOrders: () => get().orders,
            getOrder: (orderId) => {
                const index = get().orders.findIndex((order) => {
                    return Number(order.id) === Number(orderId)
                });
                return index !== -1 ? get().orders[index] : null;
            },
            updateItemIdInOrders: (id, item) => set((state) => {
                const orders = state.orders;
                const index = orders.findIndex((order) => order.id === id);
                orders[index] = item;
                return {orders}
            }),
            updateItemInOrders: (item) => set((state) => {
                const orders = state.orders;
                const index = orders.findIndex((order) => order.id === item.id);
                orders[index] = item;
                return {orders}
            }),
            updateOrderStatus: (orderId, status) => set((state) => {
                const orders = state.orders;
                const index = orders.findIndex((order) => order.id === orderId);
                orders[index].status = status;
                return {orders}
            }),
            updateOrderTrackingId: (orderId, trackingId) => set((state) => {
                const orders = state.orders;
                const index = orders.findIndex((order) => order.id === orderId);
                orders[index].trackingId = trackingId;
                return {orders}
            }),
        }), {
            name: 'kwft-app-storage',
            storage: createJSONStorage(() => zustandStorage),
            version: 1,
        }
    )
);
