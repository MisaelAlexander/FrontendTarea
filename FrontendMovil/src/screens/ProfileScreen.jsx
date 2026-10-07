import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { validateProfile } from '../utils/validators';

export default function ProfileScreen() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', correo: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    api.getClient(user.id)
      .then((c) => setForm({
        nombre: c.nombre || '', apellido: c.apellido || '', usuario: c.usuario || '',
        correo: c.correo || '', password: '',
      }))
      .catch((e) => Alert.alert('Error', e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const err = validateProfile(form);
    if (err) return Alert.alert('Revisa tus datos', err);
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(), apellido: form.apellido.trim(),
        usuario: form.usuario.trim(), correo: form.correo.trim(),
      };
      if (form.password) payload.contraseña = form.password;
      const { cliente } = await api.updateClient(user.id, payload);
      await refreshUser({ nombre: cliente.nombre, usuario: cliente.usuario });
      setForm((f) => ({ ...f, password: '' }));
      Alert.alert('Perfil actualizado', 'Tus datos fueron guardados');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <View style={styles.center}><Text>Inicia sesión para ver tu perfil</Text></View>;
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2596be" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Mi perfil</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={(v) => set('nombre', v)} />
      <TextInput style={styles.input} placeholder="Apellido" value={form.apellido} onChangeText={(v) => set('apellido', v)} />
      <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={form.usuario} onChangeText={(v) => set('usuario', v)} />
      <TextInput style={styles.input} placeholder="Correo" autoCapitalize="none" keyboardType="email-address" value={form.correo} onChangeText={(v) => set('correo', v)} />
      <TextInput style={styles.input} placeholder="Nueva contraseña (opcional)" secureTextEntry value={form.password} onChangeText={(v) => set('password', v)} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Guardar cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  btnTxt: { color: '#fff', fontWeight: '800' },
});
