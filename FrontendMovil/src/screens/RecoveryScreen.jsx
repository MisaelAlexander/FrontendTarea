import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/client';
import { validateRecoveryEmail, validateRecoveryCode, validateNewPassword } from '../utils/validators';

// Flujo en 3 pasos contra /api/recuperar-cliente (token via cuerpo, sin cookies).
export default function RecoveryScreen({ onGoLogin }) {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState('');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = () =>
    run(async () => {
      const err = validateRecoveryEmail(correo);
      if (err) return Alert.alert('Revisa tus datos', err);
      await api.requestRecoveryCode(correo.trim());
      Alert.alert('Código enviado', 'Revisa tu correo e ingresa el código');
      setStep(2);
    });

  const verifyCode = () =>
    run(async () => {
      const err = validateRecoveryCode(code);
      if (err) return Alert.alert('Revisa tus datos', err);
      await api.verifyRecoveryCode(code.trim());
      setStep(3);
    });

  const savePassword = () =>
    run(async () => {
      const err = validateNewPassword(pw, confirm);
      if (err) return Alert.alert('Revisa tus datos', err);
      await api.setNewPassword(pw, confirm);
      Alert.alert('Listo', 'Contraseña actualizada. Inicia sesión');
      onGoLogin?.();
    });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Recuperar contraseña</Text>
      <Text style={styles.step}>Paso {step} de 3</Text>

      {step === 1 && (
        <>
          <TextInput style={styles.input} placeholder="Correo registrado" autoCapitalize="none"
            keyboardType="email-address" value={correo} onChangeText={setCorreo} />
          <TouchableOpacity style={styles.btn} onPress={sendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Enviar código</Text>}
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput style={styles.input} placeholder="Código de 6 caracteres" autoCapitalize="none"
            maxLength={6} value={code} onChangeText={setCode} />
          <TouchableOpacity style={styles.btn} onPress={verifyCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Verificar código</Text>}
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput style={styles.input} placeholder="Nueva contraseña" secureTextEntry value={pw} onChangeText={setPw} />
          <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={confirm} onChangeText={setConfirm} />
          <TouchableOpacity style={styles.btn} onPress={savePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Guardar contraseña</Text>}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={onGoLogin}><Text style={styles.link}>Volver al login</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 22, fontWeight: '900', color: '#2596be', textAlign: 'center' },
  step: { textAlign: 'center', color: '#666', marginBottom: 16, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  link: { color: '#2596be', textAlign: 'center', marginTop: 14, fontWeight: '700' },
});
