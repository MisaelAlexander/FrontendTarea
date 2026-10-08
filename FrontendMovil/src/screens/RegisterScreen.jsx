import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/client';
import { validateRegister, validateRegisterCode } from '../utils/validators';

export default function RegisterScreen({ onGoLogin, onRegistered }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', password: '', correo: '' });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const err = validateRegister(form);
    if (err) return Alert.alert('Revisa tus datos', err);
    setLoading(true);
    try {
      const { nombre, apellido, usuario, password, correo } = form;
      await api.register(nombre.trim(), apellido.trim(), usuario.trim(), password, correo.trim());
      Alert.alert('Código enviado', 'Revisa tu correo e ingresa el código de 6 dígitos');
      setStep(2);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const err = validateRegisterCode(code);
    if (err) return Alert.alert('Revisa tus datos', err);
    setLoading(true);
    try {
      await api.verifyRegisterCode(code.trim());
      Alert.alert('Cuenta verificada', 'Ya puedes iniciar sesión');
      onRegistered?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Verificar cuenta</Text>
        <Text style={styles.hint}>Ingresa el código de 6 dígitos enviado a tu correo</Text>
        <TextInput
          style={styles.input} placeholder="Código de 6 dígitos" keyboardType="numeric"
          maxLength={6} value={code} onChangeText={setCode}
        />
        <TouchableOpacity style={styles.btn} onPress={verify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Verificar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoLogin}><Text style={styles.link}>Volver al login</Text></TouchableOpacity>
      </View>
    );
  }

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
  logo: { fontSize: 24, fontWeight: '900', color: '#2596be', textAlign: 'center', marginBottom: 8 },
  hint: { textAlign: 'center', color: '#666', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  link: { color: '#2596be', textAlign: 'center', marginTop: 14, fontWeight: '700' },
});
