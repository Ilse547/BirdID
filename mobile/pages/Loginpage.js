import { Pressable, Text, TextInput, View } from "react-native";

export default function LoginPage({ onLogin, onRegister }) {
  return (
    <View>
      <Text>login page</Text>

      <TextInput placeholder="email" autoCapitalize="none" keyboardType="email-address" onChangeText={onLogin.setEmail}/>
      <TextInput placeholder="passwrd" secureTextEntry onChangeText={onLogin.setPassword} />

      <Pressable onPress={onLogin.submit}>
        <Text>log in</Text>
      </Pressable>

      <Pressable onPress={onRegister}>
        <Text>create your account</Text>
      </Pressable>
    </View>
  );
}