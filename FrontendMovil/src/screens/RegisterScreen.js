import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/client';

export default function RegisterScreen({ onGoLogin, onRegistered }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', password: '', correo: '' });
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit1 = async () => {
    const { nombre, apellido, usuario, password, correo } = form;
    if (!nombre || !apellido || !usuario || !password || !correo) return Alert.alert('Faltan datos', 'Completa todos los campos');
    setLoading(true);
    try {
      await api.register(nombre, apellido, usuario, password, correo);
      setStep(2);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const submit2 = async () => {
    if (!code) return;
    setLoading(true);
    try {
      await api.verifyRegisterCode(code);
      Alert.alert('Listo', 'Cuenta verificada, inicia sesión');
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
      {step === 1 ? (
        <>
          <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={(v) => set('nombre', v)} />
          <TextInput style={styles.input} placeholder="Apellido" value={form.apellido} onChangeText={(v) => set('apellido', v)} />
          <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={form.usuario} onChangeText={(v) => set('usuario', v)} />
          <TextInput style={styles.input} placeholder="Correo" autoCapitalize="none" keyboardType="email-address" value={form.correo} onChangeText={(v) => set('correo', v)} />
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={(v) => set('password', v)} />
          <TouchableOpacity style={styles.btn} onPress={submit1} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Registrarse</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.sub}>Revisa tu correo y escribe el código de verificación</Text>
          <TextInput style={styles.input} placeholder="Código" value={code} onChangeText={setCode} />
          <TouchableOpacity style={styles.btn} onPress={submit2} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Verificar</Text>}
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={onGoLogin}><Text style={styles.link}>Volver al login</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 24, fontWeight: '900', color: '#2596be', textAlign: 'center', marginBottom: 16 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  link: { color: '#2596be', textAlign: 'center', marginTop: 14, fontWeight: '700' },
});
