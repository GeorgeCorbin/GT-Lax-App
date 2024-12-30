import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSearchParams } from 'expo-router/build/hooks';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors';
import { styles } from '@/constants/styles/itemListings';
import cartStore from './cartStore';
import { ShopItem } from '../(tabs)/Shop';

const { getCartItems, addItemToCart, setCartItems } = cartStore;

const ItemListing = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [itemDetails, setItemDetails] = useState<ShopItem | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/shops.json');
        const item = response.data.find((item: ShopItem) => item.id.toString() === id);
        setItemDetails(item);

        if (item?.contentUrl) {
          const markdownResponse = await axios.get(item.contentUrl);
          setMarkdownContent(markdownResponse.data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load item details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (!itemDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: itemDetails.imageUrl }} style={styles.itemImage} />
      <Text style={styles.itemTitle}>{itemDetails.title}</Text>
      <Text style={styles.itemPrice}>${itemDetails.Price}</Text>

      {/* Color Selection */}
      {itemDetails.colors && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Color</Text>
          <View style={styles.optionsContainer}>
            {itemDetails.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedColor === color && styles.selectedOptionButton,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text
                  style={
                    selectedColor === color
                      ? styles.selectedOptionText
                      : styles.optionText
                  }
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Size Selection */}
      {itemDetails.sizes && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.optionsContainer}>
            {itemDetails.sizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedSize === size && styles.selectedOptionButton,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={
                    selectedSize === size
                      ? styles.selectedOptionText
                      : styles.optionText
                  }
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Add to Cart Button */}
      <TouchableOpacity
        style={[styles.addButton, !(selectedColor && selectedSize) && styles.disabledButton]}
        disabled={!(selectedColor && selectedSize)}
        onPress={() => {
          addItemToCart({
            id: itemDetails.id,
            title: itemDetails.title,
            price: itemDetails.Price.toString(),
            imageUrl: itemDetails.imageUrl,
            color: selectedColor,
            size: selectedSize,
            quantity: 1,
          });
          Alert.alert('Added to Cart', `Item added to cart!`);
        }}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <Markdown
          style={{
            bold: {
              fontSize: 28,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 10,
            },
            body: {
              fontSize: 18,
              lineHeight: 24,
              color: Colors.diploma,
              padding: 12,
            },
            heading1: {
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 10,
            },
            heading2: {
              fontSize: 20,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 8,
            },
            heading3: {
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.techDarkGold,
              marginBottom: 8,
            },
            paragraph: {
              marginBottom: 12,
            },
            link: {
              color: '#007bff',
              textDecorationLine: 'underline', // This will still work but without strict typing.
            },
            listItem: {
              fontSize: 16,
              marginBottom: 6,
            },
          }}
        >
        {markdownContent}
      </Markdown>
    </ScrollView>
  );
};

export default ItemListing;
