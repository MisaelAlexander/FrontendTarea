import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function CartScreen() {
  const { cartItems, cartId, updateQuantity, removeItem, total, totalItems, checkout } = useCart();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');

  const payCash = async () => {
    if (cartItems.length === 0) return;
    setPaying(true);
    try {
      await checkout('cash');
      Alert.alert('Pedido creado', 'Tu pedido fue registrado');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setPaying(false);
    }
  };

  const payCard = async () => {
    if (cartItems.length === 0) return;
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 15) return Alert.alert('Tarjeta inválida', 'Revisa el número de tarjeta');
    const m = expDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!m) return Alert.alert('Fecha inválida', 'Usa formato MM/AA');
    if (!/^\d{3,4}$/.test(cvc.trim())) return Alert.alert('CVC inválido', 'Revisa el código de seguridad');

    setPaying(true);
    try {
      const client = await api.getClient(user.id);
      const emailCliente = client.correo || '';
      const nombreCliente = `${client.nombre || ''} ${client.apellido || ''}`.trim() || user.nombre;
      if (!emailCliente) throw new Error('No se encontró el correo del cliente');

      const cobro = await api.wompiCobro({
        monto: Number(total),
        emailCliente,
        nombreCliente,
        tarjeta: {
          numeroTarjeta: digits,
          cvv: cvc.trim(),
          mesVencimiento: Number(m[1]),
          anioVencimiento: Number(m[2]),
        },
        formaPago: 0,
        idExterno: cartId,
      });

      if (!cobro.esAprobada) {
        throw new Error(cobro.mensaje || 'Pago rechazado por el banco');
      }

      await checkout('card', {
        idTransaccionWompi: cobro.idTransaccion,
        codigoAutorizacion: cobro.codigoAutorizacion,
        estadoPago: 'aprobada',
      });
      setCardNumber('');
      setExpDate('');
      setCvc('');
      Alert.alert('Pago aprobado', `Autorización ${cobro.codigoAutorizacion || 'N/A'}`);
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
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'card' && styles.methodActive]}
            onPress={() => setMethod('card')}
          >
            <Text style={[styles.methodTxt, method === 'card' && styles.methodTxtActive]}>Tarjeta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'cash' && styles.methodActive]}
            onPress={() => setMethod('cash')}
          >
            <Text style={[styles.methodTxt, method === 'cash' && styles.methodTxtActive]}>Efectivo</Text>
          </TouchableOpacity>
        </View>

        {method === 'card' ? (
          <View style={styles.cardBox}>
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="MM/AA"
                maxLength={5}
                value={expDate}
                onChangeText={setExpDate}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVC"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={cvc}
                onChangeText={setCvc}
              />
            </View>
            <TouchableOpacity style={styles.pay} disabled={paying || cartItems.length === 0} onPress={payCard}>
              <Text style={styles.payTxt}>{paying ? 'Procesando...' : `Pagar $${total.toFixed(2)} con Wompi`}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.pay, styles.payAlt]} disabled={paying || cartItems.length === 0} onPress={payCash}>
            <Text style={styles.payTxt}>{paying ? 'Procesando...' : 'Confirmar pedido en efectivo'}</Text>
          </TouchableOpacity>
        )}
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
  methodRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  methodBtn: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, alignItems: 'center', backgroundColor: '#fff' },
  methodActive: { borderColor: '#2596be', backgroundColor: '#e0f2fe' },
  methodTxt: { color: '#666', fontWeight: '700' },
  methodTxtActive: { color: '#2596be', fontWeight: '800' },
  cardBox: { backgroundColor: '#fff', borderRadius: 10, padding: 10 },
  cardRow: { flexDirection: 'row', gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: '#fff' },
  pay: { backgroundColor: '#2596be', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 8 },
  payAlt: { backgroundColor: '#16a34a' },
  payTxt: { color: '#fff', fontWeight: '800' },
});
