import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartScreen() {
  const { cartItems, updateQuantity, removeItem, total, totalItems, checkout } = useCart();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const pay = async (tipoPago) => {
    if (!user) return Alert.alert('Sesión', 'Inicia sesión para pagar');
    if (cartItems.length === 0) return;
    setPaying(true);
    try {
      await checkout(tipoPago);
      Alert.alert('Pedido creado', 'Tu pedido fue registrado');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setPaying(false);
    }
  };

  if (!user) return <View style={styles.center}><Text>Inicia sesión para ver tu carrito</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito ({totalItems})</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Tu carrito está vacío</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.img} /> : <View style={styles.img} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
              <Text>${item.price.toFixed(2)} c/u</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qBtn} onPress={() => updateQuantity(item.id, -1)}><Text>-</Text></TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qBtn} onPress={() => updateQuantity(item.id, 1)}><Text>+</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.id)}><Text style={styles.del}>Quitar</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.pay} disabled={paying || cartItems.length === 0} onPress={() => pay('card')}>
          <Text style={styles.payTxt}>{paying ? 'Procesando...' : 'Pagar con tarjeta'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pay, styles.payAlt]} disabled={paying || cartItems.length === 0} onPress={() => pay('cash')}>
          <Text style={styles.payTxt}>{paying ? 'Procesando...' : 'Pagar en efectivo'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
  row: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, gap: 10 },
  img: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  name: { fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  qBtn: { backgroundColor: '#e5e7eb', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qty: { fontWeight: '700' },
  del: { color: '#e11d48', marginLeft: 8 },
  footer: { paddingVertical: 10 },
  total: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  pay: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 8 },
  payAlt: { backgroundColor: '#16a34a' },
  payTxt: { color: '#fff', fontWeight: '800' },
});
