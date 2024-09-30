import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddDish" component={AddDishScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home screen
const HomeScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/restaurant-logo.png')} style={styles.logoImage} />
        <Text style={styles.logo}>Welcome To Christoffel's Restaurant App</Text>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search Dish"
        placeholderTextColor="#fff"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {menuItems.length > 0 && (
        <Text style={styles.averagePrice}>
          Average Price: R
          {(
            menuItems.reduce((acc, item) => acc + parseFloat(item.price), 0) / menuItems.length
          ).toFixed(2)}
        </Text>
      )}

      <ScrollView>
        <Text style={styles.subHeader}>Dishes on Special</Text>
        {filteredMenuItems.length === 0 ? (
          <Text style={styles.noItemsText}>No dishes match your search. Add new dishes!</Text>
        ) : (
          filteredMenuItems.map((item, index) => (
            <View key={index} style={styles.dishItem}>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>{item.course}</Text>
              <Text>R{item.price}</Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddDish', { setMenuItems, menuItems })}
        >
          <Text style={styles.addButtonText}>Add New Dish</Text>
        </TouchableOpacity>

        {/* Display the total number of items */}
        <Text style={styles.totalItems}>Total Items: {menuItems.length}</Text>
      </ScrollView>
    </View>
  );
};

// Add Dish Screen
const AddDishScreen = ({ route, navigation }) => {
  const { setMenuItems, menuItems } = route.params;
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  // Validate inputs
  const addDish = () => {
    if (!dishName || !description || !course || !price || isNaN(price)) {
      Alert.alert('Error', 'Please fill in all fields correctly, and make sure price is a number.');
    } else {
      setMenuItems([...menuItems, { name: dishName, description, course, price }]);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Christoffel's Restaurant</Text>
      </View>
      <Text style={styles.subHeader}>Add a New Menu Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        placeholderTextColor="#fff"
        value={dishName}
        onChangeText={setDishName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#fff"
        value={description}
        onChangeText={setDescription}
      />
      <RNPickerSelect
        onValueChange={(value) => setCourse(value)}
        items={[
          { label: 'Starters', value: 'Starters' },
          { label: 'Mains', value: 'Mains' },
          { label: 'Desserts', value: 'Desserts' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Course', value: null }}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#fff"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addButton} onPress={addDish}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#73093c',
    padding: 20,
  },
  header: {
    backgroundColor: '#fca61b',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoImage: {
    width: 250,
    height: 180,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#ba1644',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  subHeader: {
    color: '#fca61b',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  noItemsText: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  dishItem: {
    backgroundColor: '#fca61b',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  totalItems: {
    color: '#fff',
    marginTop: 20,
  },
  averagePrice: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#fca61b',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#73093c',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ba1644',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ba1644',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
});

// Picker styles
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#ba1644',
    color: '#fff',
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#ba1644',
    color: '#fff',
    marginVertical: 10,
  },
};

