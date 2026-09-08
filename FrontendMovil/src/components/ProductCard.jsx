import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export function priceWithDiscount(price, descuento) {
  if (!descuento) return price;
  return price - price * (descuento / 100);
}

export default function ProductCard({ product, isFav, onToggleFav, onAdd, onView }) {
  const img = product.imagenesProductos?.[0]?.imagen;
  const finalPrice = priceWithDiscount(Number(product.precio) || 0, Number(product.descuento) || 0);
  return (
    <TouchableOpacity style={styles.card} onPress={() => onView?.(product)} activeOpacity={0.8}>
      {img ? (
        <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.noImage]}><Text>Sin imagen</Text></View>
      )}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{product.nombre}</Text>
        <Text style={styles.cat} numberOfLines={1}>{product.categoria} · Stock: {product.stock}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
          {product.descuento > 0 && <Text style={styles.old}>${Number(product.precio).toFixed(2)}</Text>}
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.addBtn} onPress={() => onAdd?.(product)}>
            <Text style={styles.addTxt}>Agregar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favBtn} onPress={() => onToggleFav?.(product._id)}>
            <Text style={styles.favTxt}>{isFav ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 160, backgroundColor: '#eee' },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 12 },
  name: { fontWeight: '700', fontSize: 16 },
  cat: { color: '#666', fontSize: 12, marginVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  price: { fontWeight: '700', color: '#2596be', fontSize: 16 },
  old: { textDecorationLine: 'line-through', color: '#999', fontSize: 12 },
  addBtn: { backgroundColor: '#2596be', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addTxt: { color: '#fff', fontWeight: '700' },
  favBtn: { padding: 8 },
  favTxt: { fontSize: 22, color: '#e11d48' },
});
