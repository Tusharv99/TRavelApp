import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const EMERGENCY_ITEM_WIDTH = (width - 48) / 4.5;

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Getting location...');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);

  // Currency converter states
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [converterLoading, setConverterLoading] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Replace with your actual API key from OpenWeatherMap
  const API_KEY = '97d0d55c38db52a231b63276ebd82137';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  
  // ExchangeRate API Key
  const EXCHANGE_API_KEY = '3c81c3af67ff7641a9e1fb4c';
  const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

  // Emergency numbers data
  const emergencyNumbers = [
    { id: 1, name: 'Police', number: '100', icon: 'shield-alt', directCall: 'tel:100' },
    { id: 2, name: 'Ambulance', number: '102', icon: 'ambulance', directCall: 'tel:102' },
    { id: 3, name: 'Fire', number: '101', icon: 'fire-alt', directCall: 'tel:101' },
    { id: 4, name: 'Embassy', number: '0361-2737554', icon: 'certificate', directCall: 'tel:0361-2737554' },
  ];

  // Popular currencies for conversion
  const currencies = [
    { code: 'USD',symbol: '$' },
    { code: 'EUR',symbol: '€' },
    { code: 'GBP',symbol: '£' },
    { code: 'INR',symbol: '₹' },
    { code: 'JPY',symbol: '¥' },
    { code: 'AUD',symbol: 'A$' },
    { code: 'CAD',symbol: 'C$' },
    { code: 'SGD',symbol: 'S$' },
  ];

  // Weather condition icons mapping
  const weatherIcons = {
    '01d': 'sunny',
    '01n': 'moon',
    '02d': 'partly-sunny',
    '02n': 'cloudy-night',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'water',
    '50n': 'water',
  };

  // Fetch exchange rates from ExchangeRate-API
  const fetchExchangeRates = async () => {
    try {
      setConverterLoading(true);
      const response = await fetch(EXCHANGE_API_URL);
      const data = await response.json();
      
      if (data.result === 'success') {
        setExchangeRate(data.conversion_rates);
      } else {
        Alert.alert('Error', 'Failed to fetch exchange rates. Please try again later.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch exchange rates. Please check your internet connection.');
    } finally {
      setConverterLoading(false);
    }
  };

  // Convert currency using ExchangeRate-API data
  const convertCurrency = () => {
    if (!amount || isNaN(amount) || !exchangeRate) return;
    
    const amountNum = parseFloat(amount);
    
    // Get conversion rates
    const fromRate = exchangeRate[fromCurrency];
    const toRate = exchangeRate[toCurrency];
    
    // Convert through USD base
    const amountInUSD = amountNum / fromRate;
    const convertedValue = amountInUSD * toRate;
    
    setConvertedAmount(convertedValue.toFixed(2));
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  // Select currency from dropdown
  const selectCurrency = (currencyCode, isFrom) => {
    if (isFrom) {
      setFromCurrency(currencyCode);
      setShowFromDropdown(false);
    } else {
      setToCurrency(currencyCode);
      setShowToDropdown(false);
    }
  };

  // Get currency name by code
  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  // Get currency symbol by code
  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '';
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        setError('Location permission denied. Please enable location services.');
        setLocationName('Location access denied');
        setLoading(false);
      }
    } catch (err) {
      setError('Error requesting location permission');
      setLocationName('Error getting location');
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setIsUsingCurrentLocation(true);
      setLocationName('Getting location...');
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });
      
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get city name
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (geocode.length > 0) {
        const city = geocode[0].city || 'Unknown location';
        const country = geocode[0].country || '';
        setLocationName(`${city}, ${country}`);
      }
      
      fetchWeatherData(latitude, longitude);
    } catch (err) {
      setError('Error getting location. Please try again.');
      setLocationName('Location unavailable');
      setLoading(false);
    }
  };

  // Fetch weather data by coordinates - FIXED THE SYNTAX ERROR HERE
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(data);
        setLocationName(`${data.name}, ${data.sys.country}`);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data by city name
  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setIsUsingCurrentLocation(false);
      setLocationName(`Searching for ${city}...`);
      
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(data);
        setLocationName(`${data.name}, ${data.sys.country}`);
        setSearchQuery('');
      } else {
        setError('City not found');
        setLocationName('Location not found');
        Alert.alert('Error', 'City not found. Please try again.');
      }
    } catch (err) {
      setError('Error fetching weather data');
      setLocationName('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Get weather icon based on condition code
  const getWeatherIcon = () => {
    if (!weatherData) return 'cloud';
    
    const iconCode = weatherData.weather[0].icon;
    return weatherIcons[iconCode] || 'cloud';
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery.trim());
    }
  };

  // Handle emergency call
  const handleEmergencyCall = (number) => {
    Linking.openURL(number).catch(err => {
      Alert.alert('Error', 'Could not make the call. Please try again.');
    });
  };

  // Show current location weather
  const showCurrentLocationWeather = () => {
    if (locationPermission) {
      getCurrentLocation();
    } else {
      requestLocationPermission();
    }
  };

  // Initialize location and weather data
  useEffect(() => {
    requestLocationPermission();
    fetchExchangeRates();
  }, []);

  // Convert currency when amount or currencies change
  useEffect(() => {
    if (amount && exchangeRate) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRate]);

  // Currency Dropdown Modal
  const CurrencyDropdown = ({ visible, onClose, onSelect, isFrom }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-4 w-80 max-h-96">
          <Text className="text-lg font-bold mb-4 text-center">
            Select {isFrom ? 'From' : 'To'} Currency
          </Text>
          <FlatList
            data={currencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-3 border-b border-gray-100 ${
                  (isFrom ? fromCurrency : toCurrency) === item.code ? 'bg-blue-50' : ''
                }`}
                onPress={() => onSelect(item.code, isFrom)}
              >
                <Text className="text-gray-800">
                  {item.code} - {item.name} ({item.symbol})
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-blue-500 rounded-lg p-3"
            >
            <Text className="text-white text-center font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-100">
      
      {/* Weather Header Section */}
      <View className="bg-blue-500 mx-5 mt-10 pt-10 pb-6 px-5 rounded-3xl">
        {/* Location and Search Section */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{locationName}</Text>
            <Text className="text-gray-200">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          
          <TouchableOpacity onPress={showCurrentLocationWeather} className="ml-3">
            <Ionicons name="navigate" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar and Current Location Button */}
        <View className="flex-row items-center mb-6">
          <View className="bg-white/20 rounded-full px-3 flex-row items-center flex-1 mr-3">
            <Ionicons name="search" size={17} color="white" />
            <TextInput
              placeholder="Search city..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              className="flex-1 ml-2 text-white"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="white" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {!isUsingCurrentLocation && (
            <TouchableOpacity 
              onPress={showCurrentLocationWeather}
              className="bg-white/30 rounded-full p-3"
            >
              <Ionicons name="locate" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Weather Info Card */}
        {loading ? (
          <View className="items-center justify-center py-4">
            <ActivityIndicator color="white" size="large" />
            <Text className="text-white mt-2">Getting weather data...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-4">
            <Text className="text-white text-center mb-2">{error}</Text>
            <TouchableOpacity 
              onPress={showCurrentLocationWeather}
              className="bg-white/20 rounded-full px-4 py-2"
            >
              <Text className="text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : weatherData ? (
          <View className="bg-white/10 rounded-2xl p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Ionicons 
                  name={getWeatherIcon()} 
                  size={20} 
                  color="white" 
                />
                <View className="ml-3">
                  <Text className="text-white text-lg font-bold">
                    {Math.round(weatherData.main.temp)}°C
                  </Text>
                  <Text className="text-white capitalize">
                    {weatherData.weather[0].description}
                  </Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-white text-xs">
                  Feels like: {Math.round(weatherData.main.feels_like)}°C
                </Text>
                <Text className="text-white text-xs">
                  Wind: {weatherData.wind.speed} m/s
                </Text>
                <Text className="text-white text-xs">
                  Humidity: {weatherData.main.humidity}%
                </Text>
              </View>
            </View>
            
            {/* Additional weather details inside the card */}
            <View className="flex-row justify-between mt-4 pt-3 border-t border-white/20">
              <View className="items-center">
                <Ionicons name="thermometer" size={14} color="white" />
                <Text className="text-white text-xs mt-1">Min</Text>
                <Text className="text-white text-sm font-bold">{Math.round(weatherData.main.temp_min)}°C</Text>
              </View>
              <View className="items-center">
                <Ionicons name="thermometer" size={14} color="white" />
                <Text className="text-white text-xs mt-1">Max</Text>
                <Text className="text-white text-sm font-bold">{Math.round(weatherData.main.temp_max)}°C</Text>
              </View>
              <View className="items-center">
                <Ionicons name="speedometer" size={14} color="white" />
                <Text className="text-white text-xs mt-1">Pressure</Text>
                <Text className="text-white text-sm font-bold">{weatherData.main.pressure} hPa</Text>
              </View>
              <View className="items-center">
                <Ionicons name="eye" size={14} color="white" />
                <Text className="text-white text-xs mt-1">Visibility</Text>
                <Text className="text-white text-sm font-bold">{(weatherData.visibility / 1000).toFixed(1)} km</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* Emergency Calls Section with Fixed Height */}
      <View className="p-5" style={{ height: 160 }}>
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Emergency Calls <MaterialIcons name="call" size={16} color="#3b82f6" />
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-6"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {emergencyNumbers.map((emergency) => (
            <TouchableOpacity 
              key={emergency.id}
              className="bg-white rounded-xl p-4 mr-4 items-center shadow-sm"
              style={{ width: EMERGENCY_ITEM_WIDTH }}
              onPress={() => handleEmergencyCall(emergency.directCall)}
            >
             <FontAwesome5 
             name={emergency.icon} 
             size={15} 
             color="#3b82f6"
             solid={true}  
            />
              <Text className="text-sm font-semibold text-gray-800 mt-2 text-center">
                {emergency.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Currency Converter Section */}
      <View className="flex-1 p-5 bg-white mx-5 rounded-3xl mb-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Convert Currency <FontAwesome5 name="exchange-alt" size={16} color="#3b82f6" />
        </Text>
        
        <View className="bg-blue-50 rounded-2xl p-4 mb-4">
          {/* Amount Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Amount</Text>
            <TextInput
              className="bg-white rounded-lg p-3 border border-gray-200"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Currency Selection */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-700 mb-2 font-medium">From</Text>
              <TouchableOpacity 
                className="bg-white rounded-lg p-3 border border-gray-200 flex-row justify-between items-center"
                onPress={() => setShowFromDropdown(true)}
              >
                <Text className="text-gray-800">
                  {fromCurrency} - {getCurrencyName(fromCurrency)}
                </Text>
                <FontAwesome5 name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={swapCurrencies}
              className="justify-center items-center mt-6 rounded-full p-2"
            >
              <FontAwesome5 name="exchange-alt" size={16} color="black" />
            </TouchableOpacity>
            
            <View className="flex-1 ml-2">
              <Text className="text-gray-700 mb-2 font-medium">To</Text>
              <TouchableOpacity 
                className="bg-white rounded-lg p-3 border border-gray-200 flex-row justify-between items-center"
                onPress={() => setShowToDropdown(true)}
              >
                <Text className="text-gray-800">
                  {toCurrency} - {getCurrencyName(toCurrency)}
                </Text>
                <FontAwesome5 name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Converted Result */}
          {convertedAmount && (
            <View className="bg-blue-100 rounded-lg p-4 mt-2">
              <Text className="text-blue-800 text-center text-lg font-bold">
                {getCurrencySymbol(fromCurrency)}{amount} = {getCurrencySymbol(toCurrency)}{convertedAmount}
              </Text>
              <Text className="text-blue-600 text-center text-sm mt-1">
              </Text>
            </View>
          )}

          {converterLoading && (
            <View className="items-center mt-2">
              <ActivityIndicator color="#3b82f6" size="small" />
              <Text className="text-gray-600 text-sm mt-1">Loading exchange rates...</Text>
            </View>
          )}

          {!exchangeRate && !converterLoading && (
            <TouchableOpacity 
              onPress={fetchExchangeRates}
              className="bg-blue-500 rounded-lg p-3 mt-2"
            >
              <Text className="text-white text-center font-bold">Load Exchange Rates</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Currency Dropdown Modals */}
      <CurrencyDropdown
        visible={showFromDropdown}
        onClose={() => setShowFromDropdown(false)}
        onSelect={selectCurrency}
        isFrom={true}
      />
      
      <CurrencyDropdown
        visible={showToDropdown}
        onClose={() => setShowToDropdown(false)}
        onSelect={selectCurrency}
        isFrom={false}
      />
    </View>
  );
};

export default HomeScreen;