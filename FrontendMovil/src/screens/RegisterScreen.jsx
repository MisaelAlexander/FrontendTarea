import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/client';

export default function RegisterScreen({ onGoLogin, onRegistered }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', password: '', correo: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const { nombre, apellido, usuario, password, correo } = form;
    if (!nombre || !apellido || !usuario || !password || !correo) return Alert.alert('Faltan datos', 'Completa todos los campos');
    setLoading(true);
    try {
      await api.register(nombre, apellido, usuario, password, correo);
      Alert.alert('Cuenta creada', 'Ya puedes iniciar sesión');
      onRegistered?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Crear cuenta</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={(v) => set('nombre', v)} />
      <TextInput style={styles.input} placeholder="Apellido" value={form.apellido} onChangeText={(v) => set('apellido', v)} />
      <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={form.usuario} onChangeText={(v) => set('usuario', v)} />
      <TextInput style={styles.input} placeholder="Correo" autoCapitalize="none" keyboardType="email-address" value={form.correo} onChangeText={(v) => set('correo', v)} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={(v) => set('password', v)} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Registrarse</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoLogin}><Text style={styles.link}>Volver al login</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 24, fontWeight: '900', color: '#2596be', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  link: { color: '#2596be', textAlign: 'center', marginTop: 14, fontWeight: '700' },
});
