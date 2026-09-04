import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const data = await api.getOrdersByClient(user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (!user) return <View style={styles.center}><Text>Inicia sesión para ver tus pedidos</Text></View>;
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2596be" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis pedidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => o._id}
        ListEmptyComponent={<Text style={styles.empty}>Aún no tienes pedidos</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.num}>Pedido #{item.numeroPedido} · {item.tipoPago}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            {(item.idCarrito?.Productos || []).map((p, idx) => (
              <Text key={idx} style={styles.prod}>
                · {p.IDProducto?.nombre || 'Producto'} x{p.amount} — ${Number(p.subtotal || 0).toFixed(2)}
              </Text>
            ))}
            <Text style={styles.total}>Total: ${Number(item.idCarrito?.totalConDescuento || item.idCarrito?.total || 0).toFixed(2)}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 90 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  num: { fontWeight: '800' },
  date: { color: '#666', fontSize: 12, marginBottom: 6 },
  prod: { fontSize: 13, color: '#333' },
  total: { fontWeight: '800', marginTop: 6, color: '#2596be' },
});
