import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/client';

export default function ProductDetailScreen({ product, onBack, onGoCart }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!product?._id) return;
    setLoadingComments(true);
    api.getCommentsByProduct(product._id)
      .then(setComments)
      .catch((e) => console.log(e.message))
      .finally(() => setLoadingComments(false));
  }, [product]);

  const submitComment = async () => {
    if (!user?.id) return;
    if (text.trim().length < 3) return Alert.alert('Comentario muy corto', 'Escribe al menos 3 caracteres');
    setSending(true);
    try {
      await api.createComment('Comentario', text.trim(), rating, user.id, product._id);
      setText('');
      setRating(5);
      const updated = await api.getCommentsByProduct(product._id);
      setComments(updated);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSending(false);
    }
  };

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

        <Text style={styles.section}>Reseñas</Text>
        {loadingComments ? (
          <ActivityIndicator color="#2596be" />
        ) : comments.length === 0 ? (
          <Text style={styles.muted}>Aún no hay reseñas.</Text>
        ) : (
          comments.map((c) => (
            <View key={c._id} style={styles.comment}>
              <Text style={styles.cName}>
                {c.IDCliente?.nombre ? `${c.IDCliente.nombre} ${c.IDCliente.apellido || ''}`.trim() : 'Usuario'}
              </Text>
              <Text style={styles.stars}>{'★'.repeat(c.Resenia || 0)}{'☆'.repeat(5 - (c.Resenia || 0))}</Text>
              <Text style={styles.cBody}>{c.CuerpoComentario}</Text>
            </View>
          ))
        )}

        {user?.id ? (
          <View style={styles.form}>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                  <Text style={[styles.star, n <= rating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              multiline
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={styles.btn} onPress={submitComment} disabled={sending}>
              <Text style={styles.btnTxt}>{sending ? 'Enviando...' : 'Enviar reseña'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.muted}>Inicia sesión para dejar un comentario.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { padding: 14 },
  backTxt: { color: '#2596be', fontWeight: '700' },
  image: { width: '100%', height: 260 },
  body: { padding: 16, paddingBottom: 40 },
  name: { fontSize: 22, fontWeight: '800' },
  cat: { color: '#666', marginVertical: 4 },
  price: { fontSize: 20, fontWeight: '800', color: '#2596be', marginTop: 8 },
  disc: { color: '#16a34a', fontWeight: '700' },
  stock: { marginTop: 4, color: '#444' },
  desc: { marginTop: 12, lineHeight: 20, color: '#333' },
  btn: { backgroundColor: '#2596be', borderRadius: 12, padding: 14, marginTop: 20, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  section: { fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 8 },
  muted: { color: '#666', marginBottom: 8 },
  comment: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, marginBottom: 8 },
  cName: { fontWeight: '700', fontSize: 13 },
  stars: { color: '#f59e0b', fontSize: 13, marginVertical: 2 },
  cBody: { fontSize: 13, color: '#444' },
  form: { marginTop: 8 },
  starRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  star: { fontSize: 28, color: '#d1d5db' },
  starActive: { color: '#f59e0b' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, minHeight: 70, textAlignVertical: 'top', marginBottom: 4 },
});
