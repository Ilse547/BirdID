import { Pressable, Text, TextInput, View } from "react-native";

export default function RegisterPage({ onRegister, onBack }) {
  return (
    <View>
      <Text>create account page</Text>
      <TextInput placeholder="your username" autoCapitalize="none" onChangeText={onRegister.setUsername} />

      <TextInput placeholder="your email" autoCapitalize="none" keyboardType="email-address" onChangeText={onRegister.setEmail} />

      <TextInput placeholder="password" secureTextEntry onChangeText={onRegister.setPassword} />

      <Pressable onPress={onRegister.submit}>
        <Text>register</Text>
      </Pressable>

      <Pressable onPress={onBack}>
        <Text>log into your account</Text>
      </Pressable>
    </View>
  );
}