import { useEffect, useState } from "react";
import {Pressable, ScrollView, Text, TextInput, View } from "react-native";
import styles from "../styles";
import { API_URL } from "../config";

export default function FollowerPage({ token, onSessionExpired, onViewProfile}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFollowing();
  }, [token]);
  const loadFollowing = async () => {
    try {
      const response = await fetch(`${API_URL}/users/following`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 403) {
        onSessionExpired();
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setFollowing(data.users || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const searchUsers = async () => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    try {
      setMessage("");
      const response = await fetch(
        `${API_URL}/users/search?q=${encodeURIComponent(query.trim())}`,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      if (response.status === 403) {
        onSessionExpired();
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUsers(data.users || []);
    } catch (error) {
      setMessage(error.message);
    }
  };
  const toggleFollow = async (user) => {
    const isFollowing = user.is_following;
    try {
      const response = await fetch(
        `${API_URL}/users/${user.id}/follow`,
        {
          method: isFollowing ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 403) {
        onSessionExpired();
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {...currentUser, is_following: !isFollowing}
            : currentUser
        )
      );
      await loadFollowing();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <ScrollView style={styles.peopleScreen} contentContainerStyle={styles.peopleContent}>
      <Text style={[styles.title, {fontSize: 30}]}>People</Text>
      <TextInput style={styles.inputBox} placeholder="Search username" placeholderTextColor="#777" value={query} onChangeText={setQuery} onSubmitEditing={searchUsers}/>

      <Pressable style={styles.Primarybutton} onPress={searchUsers} >
        <Text style={styles.PrimarybuttonText}>search</Text>
      </Pressable>

      {message !== "" && (<Text style={styles.messageError}>{message}</Text>)}
      {users.map((user) => (
        <View key={user.id} style={styles.userRow}>
          <Pressable style={[styles.Secondarybutton, {width: 200,marginBottom:5}]}onPress={() => onViewProfile(user.id, user.username)}>
            <Text style={styles.SecondarybuttonText}>{user.username}</Text>
          </Pressable>
          <Pressable style={styles.Primarybutton} onPress={() => toggleFollow(user)}>
            <Text style={styles.PrimarybuttonText}>
              {user.is_following ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
      ))}
      <View style={styles.divider}/>
      
      <Text style={styles.title2}>Following:</Text>
      {following.length === 0 ? (
        <Text>You are not following anyone yet.</Text>
      ) : (
        following.map((user) => (
          <Pressable style={[styles.Secondarybutton, {marginBottom:5}]}key={user.id} onPress={() => onViewProfile(user.id, user.username)}>
            <Text style={styles.SecondarybuttonText}>
              {user.username}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}