import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ onViewProduct }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
      if (user?.id) {
        try {
          const f = await api.getFavorites(user.id);
          setFavs(f.map((x) => x._id || x));
        } catch {}
      } else setFavs([]);
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const toggleFav = async (id) => {
    if (!user?.id) return;
    const prev = [...favs];
    setFavs(prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    try {
      await api.toggleFavorite(user.id, id);
    } catch {
      setFavs(prev);
    }
  };

  const filtered = query
    ? products.filter((p) => (p.nombre || '').toLowerCase().includes(query.toLowerCase()))
    : products;

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2596be" /><Text>Cargando productos...</Text></View>;

  return (
    <View style={styles.container}>
      {!user && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Bienvenido a Techne Meraki</Text>
          <Text style={styles.bannerSub}>Inicia sesión para guardar favoritos y pedir</Text>
        </View>
      )}
      <TextInput
        style={styles.search}
        placeholder="Buscar productos..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFav={favs.includes(item._id)}
            onToggleFav={toggleFav}
            onAdd={(p) => { if (user?.id) addToCart(p); }}
            onView={onViewProduct}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No se encontraron productos</Text>}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  banner: { backgroundColor: '#2596be', padding: 14 },
  bannerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bannerSub: { color: '#e0f2fe', fontSize: 12 },
  search: { backgroundColor: '#fff', margin: 12, borderRadius: 10, padding: 12, elevation: 1 },
  empty: { textAlign: 'center', marginTop: 30, color: '#666' },
});
