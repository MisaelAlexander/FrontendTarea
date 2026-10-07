import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Tabs() {
  const { user, loading, logout } = useAuth();
  const { totalItems, loadCart, clearCart } = useCart();
  const [tab, setTab] = useState('home');
  const [authView, setAuthView] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (user?.id) loadCart(user.id);
  }, [user]);

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => {});
  }, [loading]);

  const doLogout = async () => {
    await logout();
    clearCart();
    setSelectedProduct(null);
    setAuthView('login');
    setTab('home');
  };

  if (loading) {
    return (
      <View style={styles.splash}>
        <Image
          source={require('./assets/imagen_2026-10-06_194648562-removebg-preview.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <Text style={styles.splashTitle}>Techne Meraki</Text>
        <ActivityIndicator size="large" color="#2596be" style={{ marginTop: 16 }} />
      </View>
    );
  }

  // Si hay producto seleccionado, mostrar detalle encima
  if (selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <ProductDetailScreen
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onGoCart={() => { setSelectedProduct(null); setTab('cart'); }}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  // Auth primero: si no hay sesión, el login es lo primero que aparece
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        {authView === 'login' ? (
          <LoginScreen
            onGoRegister={() => setAuthView('register')}
            onGoRecovery={() => setAuthView('recovery')}
            onLogged={() => setTab('home')}
          />
        ) : authView === 'register' ? (
          <RegisterScreen onGoLogin={() => setAuthView('login')} onRegistered={() => setAuthView('login')} />
        ) : (
          <RecoveryScreen onGoLogin={() => setAuthView('login')} />
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Techne Meraki</Text>
        <TouchableOpacity onPress={doLogout}><Text style={styles.headerLink}>Salir</Text></TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen onViewProduct={setSelectedProduct} />}
        {tab === 'cart' && <CartScreen />}
        {tab === 'orders' && <OrdersScreen />}
        {tab === 'favs' && <FavoritesScreen onViewProduct={setSelectedProduct} />}
        {tab === 'profile' && <ProfileScreen />}
      </View>

      <BottomBar tab={tab} setTab={setTab} totalItems={totalItems} user={user} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function BottomBar({ tab, setTab }) {
  const { totalItems } = useCart();
  const items = [
    { id: 'home', label: 'Inicio' },
    { id: 'favs', label: 'Favs' },
    { id: 'cart', label: totalItems > 0 ? `Carrito (${totalItems})` : 'Carrito' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'profile', label: 'Perfil' },
  ];
  return (
    <View style={styles.bar}>
      {items.map((i) => (
        <TouchableOpacity key={i.id} style={[styles.barBtn, tab === i.id && styles.barActive]} onPress={() => setTab(i.id)}>
          <Text style={[styles.barTxt, tab === i.id && styles.barTxtActive]}>{i.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Tabs />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  splashLogo: { width: 180, height: 180 },
  splashTitle: { fontWeight: '900', fontSize: 24, color: '#2596be', marginTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontWeight: '900', fontSize: 18, color: '#2596be' },
  headerLink: { color: '#2596be', fontWeight: '700' },
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb', paddingBottom: 10, paddingTop: 6 },
  barBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  barActive: { backgroundColor: '#e0f2fe' },
  barTxt: { color: '#666', fontWeight: '600', fontSize: 12 },
  barTxtActive: { color: '#2596be', fontWeight: '800' },
});
