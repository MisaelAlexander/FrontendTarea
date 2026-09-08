import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function DetailRow({ label, value }) {
  return (
    <View style={styles.dRow}>
      <Text style={styles.dLabel}>{label}</Text>
      <Text style={styles.dValue}>{value || 'N/A'}</Text>
    </View>
  );
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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

  const productos = selected?.idCarrito?.Productos || [];
  const total = Number(selected?.idCarrito?.totalConDescuento || selected?.idCarrito?.total || 0);
  const descuento = Number(selected?.idCarrito?.Descuento || 0);

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
            <Text style={styles.total}>Total: ${Number(item.idCarrito?.totalConDescuento || item.idCarrito?.total || 0).toFixed(2)}</Text>
            <TouchableOpacity style={styles.moreBtn} onPress={() => setSelected(item)}>
              <Text style={styles.moreTxt}>Ver más</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pedido #{selected?.numeroPedido}</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <DetailRow label="Fecha" value={selected && new Date(selected.createdAt).toLocaleString()} />
              <DetailRow label="Tipo de pago" value={selected?.tipoPago} />
              {selected?.codigoAutorizacion && <DetailRow label="Autorización" value={selected.codigoAutorizacion} />}
              {selected?.estadoPago && <DetailRow label="Estado del pago" value={selected.estadoPago} />}
              {selected?.idCarrito?.IDCliente?.nombre && (
                <DetailRow
                  label="Comprador"
                  value={`${selected.idCarrito.IDCliente.nombre} ${selected.idCarrito.IDCliente.apellido || ''}`.trim()}
                />
              )}

              <Text style={styles.section}>Productos</Text>
              {productos.length === 0 && <Text style={styles.empty}>Sin productos</Text>}
              {productos.map((p, idx) => {
                const nombre = p.IDProducto?.nombre || 'Producto';
                const cantidad = p.amount || 1;
                const monto = Number(p.subtotal || 0);
                return (
                  <View key={idx} style={styles.pRow}>
                    <Text style={styles.pName} numberOfLines={1}>{nombre}</Text>
                    <Text style={styles.pQty}>x{cantidad}</Text>
                    <Text style={styles.pMonto}>${monto.toFixed(2)}</Text>
                  </View>
                );
              })}

              <View style={styles.totals}>
                <View style={styles.tRow}>
                  <Text style={styles.tLabel}>Descuento</Text>
                  <Text>${descuento.toFixed(2)}</Text>
                </View>
                <View style={styles.tRow}>
                  <Text style={styles.tLabel}>Total</Text>
                  <Text style={styles.tValue}>${total.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnTxt}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  total: { fontWeight: '800', marginTop: 6, color: '#2596be' },
  moreBtn: { marginTop: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#2596be', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  moreTxt: { color: '#2596be', fontWeight: '800' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  close: { fontSize: 20, color: '#666', padding: 4 },
  dRow: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 },
  dLabel: { fontWeight: '800', fontSize: 13 },
  dValue: { color: '#555', fontSize: 13 },
  section: { fontWeight: '800', fontSize: 15, marginVertical: 8 },
  pRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  pName: { flex: 1, fontSize: 13 },
  pQty: { width: 40, textAlign: 'center', fontSize: 13, color: '#555' },
  pMonto: { width: 80, textAlign: 'right', fontWeight: '700', fontSize: 13 },
  totals: { marginTop: 12, alignSelf: 'flex-end', width: '70%' },
  tRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  tLabel: { fontWeight: '800' },
  tValue: { fontWeight: '800', color: '#2596be' },
  closeBtn: { marginTop: 16, borderWidth: 1, borderColor: '#2596be', borderRadius: 8, padding: 12, alignItems: 'center' },
  closeBtnTxt: { color: '#2596be', fontWeight: '800' },
});
