import { Pressable, Text, TextInput, View } from "react-native";
import styles from "../styles";

export default function RegisterPage({ onRegister, onBack, message }) {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>create account page</Text>
      <TextInput style={styles.inputBox} placeholder="your username" autoCapitalize="none" onChangeText={onRegister.setUsername} />

      <TextInput style={styles.inputBox} placeholder="your email" autoCapitalize="none" keyboardType="email-address" onChangeText={onRegister.setEmail} />

      <TextInput style={styles.inputBox} placeholder="password" secureTextEntry onChangeText={onRegister.setPassword} />
      {message !== "" && (
        <Text style={{ color: "#d62828", marginTop: 10 }}>
          {message}
        </Text>
      )}
      <Pressable style={styles.Primarybutton} onPress={onRegister.submit}>
        <Text style={styles.PrimarybuttonText}>register</Text>
      </Pressable>

      <Pressable onPress={onBack}>
        <Text style={{ color: "#0062ff", fontSize: 18}}  >log into your account</Text>
      </Pressable>
    </View>
  );
}