import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ product, onBack, onGoCart }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  if (!product) return null;
  const img = product.imagenesProductos?.[0]?.imagen;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}><Text style={styles.backTxt}>← Volver</Text></TouchableOpacity>
      {img && <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />}
      <View style={styles.body}>
        <Text style={styles.name}>{product.nombre}</Text>
        <Text style={styles.cat}>{product.categoria} · {product.sucursal}</Text>
        <Text style={styles.price}>${Number(product.precio).toFixed(2)}</Text>
        {product.descuento > 0 && <Text style={styles.disc}>Descuento: {product.descuento}%</Text>}
        <Text style={styles.stock}>Stock: {product.stock}</Text>
        <Text style={styles.desc}>{product.descripcion}</Text>
        {product.colores?.length > 0 && <Text style={styles.cat}>Colores: {product.colores.join(', ')}</Text>}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => { if (user?.id) { addToCart(product); onGoCart?.(); } }}
        >
          <Text style={styles.btnTxt}>{user ? 'Agregar al carrito' : 'Inicia sesión para comprar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { padding: 14 },
  backTxt: { color: '#2596be', fontWeight: '700' },
  image: { width: '100%', height: 260 },
  body: { padding: 16 },
  name: { fontSize: 22, fontWeight: '800' },
  cat: { color: '#666', marginVertical: 4 },
  price: { fontSize: 20, fontWeight: '800', color: '#2596be', marginTop: 8 },
  disc: { color: '#16a34a', fontWeight: '700' },
  stock: { marginTop: 4, color: '#444' },
  desc: { marginTop: 12, lineHeight: 20, color: '#333' },
  btn: { backgroundColor: '#2596be', borderRadius: 12, padding: 14, marginTop: 20, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
});
