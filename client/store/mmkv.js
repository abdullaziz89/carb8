// create MMKV store
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
    id: 'carb8-app-storage',
    encryptionKey: '148ec7064bcfd43'
})

export const zustandStorage = {
    setItem: (name, value) => {
        console.log('setItem', name, value)
        return storage.set(name, value);
    },
    getItem: (name) => {
        const value = storage.getString(name)
        return value ?? null
    },
    removeItem: (name) => {
        return storage.delete(name)
    },
}
