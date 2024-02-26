import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {zustandStorage} from "./mmkv";

export const useAppStateStore = create(
    persist(
        (set, get) => ({
            login: false,
            verified: false,
            welcomePreviews: false,
            token: null,
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
                return {login: login}
            }),
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
