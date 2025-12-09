import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from './LoginScreen.styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '924152182485-jcsfkqc0aot6grmb5u2a4ipp2202lovf.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const checkLoginStatus = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        console.log('🧹 Đã xóa token cũ');

        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signInSilently();
          if (userInfo) {
            await GoogleSignin.signOut();
            console.log('🧹 Đã dọn session Google cũ');
          } else {
            console.log('✅ Không có session Google cũ');
          }
        } catch (err: any) {
          console.log('✅ Không có session Google cũ hoặc lỗi:', err.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi dọn dẹp:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens(); 
    const token = tokens.idToken;

    if (!token) {
      Alert.alert('Lỗi', 'Không lấy được token từ Google.');
      console.log('⚠️ tokens:', tokens);
      return;
    }

    await AsyncStorage.setItem('userToken', token);
    console.log('🔑 Token đã lưu:', token);

    navigation.replace('Home');
  } catch (error) {
    console.log('❌ Google Sign-In Error:', error);
    Alert.alert('Đăng nhập thất bại', 'Vui lòng thử lại.');
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Image source={require('../assets/img_waiting2.png')} style={styles.image} />

      <Text style={styles.title}>
        Immerse in a seamless online {'\n'} shopping experience.
      </Text>

      <Text style={styles.subtitle}>
        We promise that you’ll have the {'\n'} most fuss-free time with us ever.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
