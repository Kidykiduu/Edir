import { Stack } from 'expo-router';

export default function FamilyFormLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}