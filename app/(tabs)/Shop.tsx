import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import styles from '@/constants/styles/shop';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useAppData } from '@/context/AppDataProvider';

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
  const { shopItems, loading } = useAppData();

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
