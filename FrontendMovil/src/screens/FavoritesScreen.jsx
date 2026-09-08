import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesScreen({ onViewProduct }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const favs = await api.getFavorites(user.id);
      const ids = (Array.isArray(favs) ? favs : []).map((f) => f._id || f);
      const products = await Promise.all(ids.map((id) => api.getProductById(id).catch(() => null)));
      setItems(products.filter(Boolean));
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id) => {
    try {
      await api.toggleFavorite(user.id, id);
      setItems((prev) => prev.filter((p) => (p._id || p) !== id));
    } catch {}
  };

  if (!user) return <View style={styles.center}><Text>Inicia sesión para ver favoritos</Text></View>;
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2596be" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <FlatList
        data={items}
        keyExtractor={(p) => p._id || p}
        ListEmptyComponent={<Text style={styles.empty}>Sin favoritos aún</Text>}
        renderItem={({ item }) => (
          <ProductCard product={item} isFav onToggleFav={toggle} onAdd={addToCart} onView={onViewProduct} />
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
});
