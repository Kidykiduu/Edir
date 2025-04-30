import { Redirect } from "expo-router";
import { useSession } from "../../ctx";

export default function AuthLayout() {
  const { session } = useSession();
  if (!session) {
    return <Redirect href="/sign-in" />;
  }
  return ( <Stack>
    <Stack.Screen name="(head-of-edir)" options={{ headerShown: false }} />
  </Stack>
);
}