// Storage a prueba de fallos para Expo Go.
// Si el módulo nativo de AsyncStorage no está disponible (versión distinta a la
// incluida en Expo Go), se usa memoria en RAM y la app sigue funcionando.
// La sesión solo deja de persistir entre reinicios en ese caso.
import AsyncStorage from '@react-native-async-storage/async-storage';

const memory = new Map();

export const storage = {
  async getItem(key) {
    try {
      const v = await AsyncStorage.getItem(key);
      if (v != null) return v;
    } catch {}
    return memory.has(key) ? memory.get(key) : null;
  },
  async setItem(key, value) {
    memory.set(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  async removeItem(key) {
    memory.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};
