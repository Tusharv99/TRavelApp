import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const Details = () => {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Image
          className="w-full h-[550px]"
          resizeMode="stretch"
        />

        <View className="px-5 mt-5">
          <Text className="text-white font-bold text-xl">Details</Text>

          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">Zoo</Text>
            <Text className="text-light-200 text-sm">120km</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Text className="text-white font-bold text-sm">8/10</Text>
            <Text className="text-light-200 text-sm">(1,000 votes)</Text>
          </View>

          <View className="mt-5">
            <Text className="text-light-200 font-normal text-sm">Overview</Text>
            <Text className="text-light-100 font-bold text-sm mt-1">
             THis Zoo contain most of the animals from india and all over the world. It is located in the heart of the city and is a major tourist attraction.
            </Text>
          </View>
       

          <View className="mt-5">
            <Text className="text-light-200 font-normal text-sm">Anywhere you wants to go </Text>
            <Text className="text-light-100 font-bold text-sm mt-1">JUst trust us buddy</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex-row items-center justify-center"
        onPress={router.back}
      >
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
