import { Pressable, Text, TextInput, View } from "react-native";
import styles from "../styles";

export default function LoginPage({ onLogin, onRegister, message }) {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>login page</Text>

      <TextInput style={styles.inputBox} placeholder="email" autoCapitalize="none" keyboardType="email-address" onChangeText={onLogin.setEmail}/>
      <TextInput style={styles.inputBox} placeholder="passwrd" secureTextEntry onChangeText={onLogin.setPassword} />

      {message !== "" && (
        <Text style={{ color: "#d62828", marginTop: 10 }}>
          {message}
        </Text>
      )}

      <Pressable style={styles.authButton} onPress={onLogin.submit}>
        <Text style={styles.authButtonText}>log in</Text>
      </Pressable>

      <Pressable onPress={onRegister}>
        <Text style={{ color: "#0062ff", fontSize: 18}}>create your account</Text>
      </Pressable>
    </View>
  );
}