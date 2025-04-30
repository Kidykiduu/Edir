import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { Stack } from 'expo-router';

export default function App() {
  let [fontsLoaded] = useFonts({
    'NotoSansEthiopic-Regular': require('../assets/fonts/NotoSansEthiopic-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Stack />;
}