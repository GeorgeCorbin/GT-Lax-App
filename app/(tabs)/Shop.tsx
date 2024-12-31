import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import axios from 'axios';
import styles from '@/constants/styles/shop';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export interface ShopItem {
  id: string;
  title: string;
  Price: number;
  imageUrl: string;
  contentUrl: string;
  colors: string[];
  sizes: string[];
}

const ShopScreen = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/shops.json');
        setShopItems(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load shop items.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.white} />
        <Text style={styles.loadingText}>Loading shop items...</Text>
      </View>
    );
  }

  return (
    <AnimatedHeaderLayout headerText="Shop" backgroundColor={ styles.container.backgroundColor }>
      <View style={styles.cartContainer}>
        <Link href="/shop/Checkout" style={styles.cartButton}>
          {/* <Image source={require('@/assets/cart-icon.png')} style={styles.cartIcon} /> */}
          <Ionicons name="cart-outline" size={32} color={ Colors.cartIconColor } />
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Shop</Text>
          <Text style={styles.subHeaderText}>Support the team by shopping our apparel!</Text>
        </View>

        {/* Shop Items Section */}
        {shopItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>${item.Price}</Text>
              <Link href={`/shop/ItemListing?id=${item.id}`} style={styles.buyButton}>
                <Text style={styles.buyButtonText}>View Details</Text>
              </Link>
            </View>
          </View>
        ))}
      </ScrollView>
    </AnimatedHeaderLayout>
  );
};

export default ShopScreen;
