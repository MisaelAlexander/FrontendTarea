import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function LoginScreen({ onGoRegister, onLogged }) {
  const { login } = useAuth();
  const { loadCart } = useCart();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!usuario || !password) return Alert.alert('Faltan datos', 'Escribe usuario y contraseña');
    setLoading(true);
    try {
      const data = await login(usuario.trim(), password);
      await loadCart(data.clienteId);
      onLogged?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Techne Meraki</Text>
      <Text style={styles.sub}>Inicia sesión</Text>
      <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={usuario} onChangeText={setUsuario} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Entrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoRegister}><Text style={styles.link}>¿Sin cuenta? Regístrate</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: '900', color: '#2596be', textAlign: 'center' },
  sub: { textAlign: 'center', color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  link: { color: '#2596be', textAlign: 'center', marginTop: 14, fontWeight: '700' },
});
