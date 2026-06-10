import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Liga Feminina' }} />
        <Stack.Screen name="join" options={{ title: 'Entrar no Torneio' }} />
        <Stack.Screen name="organize" options={{ title: 'Novo Torneio' }} />
        <Stack.Screen name="tournament" options={{ title: 'Torneio em Andamento' }} />
        <Stack.Screen name="ranking" options={{ title: 'Ranking da Liga' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
