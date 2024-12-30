import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import cartStore from './cartStore';
import { styles } from '@/constants/styles/checkout';

const { getCartItems, addItemToCart, setCartItems } = cartStore;

const Checkout = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const { confirmPayment } = useConfirmPayment();
  const [cartItems, setLocalCartItems] = useState(getCartItems());

  useEffect(() => {
    setLocalCartItems(getCartItems());
  }, [getCartItems]);

  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const removeItemFromCart = (uniqueId: any) => {
    const updatedCart = cartItems.filter((item) => item.uniqueId !== uniqueId);
    setCartItems(updatedCart);
    setLocalCartItems(updatedCart);
  };

  const updateItemQuantity = (uniqueId: any, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    setLocalCartItems(updatedCart);
  };

  const handlePlaceOrder = async () => {
    if (!name || !email || !address || !city || !state || !zip) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('https://<your-cloud-function-url>/createPaymentIntent', {
        amount: calculateTotalCost() * 100, // Convert dollars to cents
        currency: 'usd',
      });

      const { clientSecret } = response.data;

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name,
            email,
            address: {
              line1: address,
              city,
              state,
              postalCode: zip,
              country: 'US',
            },
          },
        },
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment successful', `PaymentIntent ID: ${paymentIntent.id}`);
        setName('');
        setEmail('');
        setAddress('');
        setCity('');
        setState('');
        setZip('');
        setCartItems([]);
        setLocalCartItems([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while processing your payment.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <FlatList
        data={[{ type: 'cartItems' }, { type: 'form' }]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'cartItems') {
            return (
              <View style={styles.cartContainer}>
                <Text style={styles.cartTitle}>Your Cart</Text>
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((cartItem) => (
                      <View key={cartItem.uniqueId} style={styles.cartItem}>
                        <Image source={{ uri: cartItem.imageUrl }} style={styles.cartItemImage} />
                        <View style={styles.cartItemDetails}>
                          <Text style={styles.cartItemTitle}>{cartItem.title}</Text>
                          <Text style={styles.cartItemPrice}>${cartItem.price}</Text>
                          <Text style={styles.cartItemDetailsText}>
                            Color: {cartItem.color || 'N/A'}, Size: {cartItem.size || 'N/A'}
                          </Text>
                          <View style={styles.quantityInputContainer}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() =>
                                updateItemQuantity(cartItem.uniqueId, Math.max(cartItem.quantity - 1, 1))
                              }
                            >
                              <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() =>
                                updateItemQuantity(cartItem.uniqueId, cartItem.quantity + 1)
                              }
                            >
                              <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeItemFromCart(cartItem.uniqueId)}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <Text style={styles.totalCost}>Total Cost: ${calculateTotalCost()}</Text>
                  </>
                ) : (
                  <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                )}
              </View>
            );
          } else if (item.type === 'form') {
            return (
              <View style={styles.formContainer}>
                <Text style={styles.title}>Checkout</Text>

                {/* User Info Section */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your address"
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter your city"
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.rowGroup}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                      style={styles.input}
                      value={state}
                      onChangeText={setState}
                      placeholder="State"
                      returnKeyType="done"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Zip Code</Text>
                    <TextInput
                      style={styles.input}
                      value={zip}
                      onChangeText={setZip}
                      placeholder="Zip Code"
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                  </View>
                </View>

                {/* Card Payment Section */}
                <View style={styles.cardSection}>
                  <Text style={styles.label}>Card Details</Text>
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{ number: '4242 4242 4242 4242' }}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                  />
                </View>

                {/* Place Order Button */}
                <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
                  <Text style={styles.orderButtonText}>Place Order</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
        contentContainerStyle={styles.container}
      />
    </KeyboardAvoidingView>
  );
};

export default Checkout;