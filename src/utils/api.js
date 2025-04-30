import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiCall = async (url, options = {}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
};