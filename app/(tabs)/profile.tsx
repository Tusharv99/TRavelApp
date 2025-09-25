import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

const LoginScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // signup form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = () => {
    console.log("Sign In with", email, password);
  };

  const handleSignUp = () => {
    console.log("Sign Up with", {
      name,
      phone,
      aadhar,
      age,
      gender,
      password,
      confirmPassword,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>

          {/* Sign In Form */}
          {!isSignUp ? (
            <View className="space-y-4">
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-xl"
                onPress={handleSignIn}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsSignUp(true)}
                className="mt-4"
              >
                <Text className="text-center text-gray-600">
                  Don’t have an account?{" "}
                  <Text className="text-blue-600 font-semibold">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Sign Up Form
            <View className="space-y-4">
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Aadhaar Number"
                keyboardType="numeric"
                value={aadhar}
                onChangeText={setAadhar}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-xl"
                onPress={handleSignUp}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign Up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsSignUp(false)}
                className="mt-4"
              >
                <Text className="text-center text-gray-600">
                  Already have an account?{" "}
                  <Text className="text-blue-600 font-semibold">Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
