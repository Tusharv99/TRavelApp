import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Modal, 
  TextInput,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    name: "Flight Ticket - NYC to LON",
    type: "flight",
    preview: "📄",
    date: "2024-01-15"
  },
  {
    id: "2", 
    name: "Hotel Booking - Grand Plaza",
    type: "hotel",
    preview: "📄",
    date: "2024-01-20"
  },
  {
    id: "3",
    name: "Train Ticket - Eurostar",
    type: "train", 
    preview: "📄",
    date: "2024-01-25"
  },
  {
    id: "4",
    name: "Driver's License",
    type: "id",
    preview: "📄", 
    date: "2024-02-01"
  }
];

const documentTypes = [
  { label: "Flight Ticket", value: "flight", icon: "airplane" },
  { label: "Train Ticket", value: "train", icon: "train" },
  { label: "Hotel Booking", value: "hotel", icon: "business" },
  { label: "Car Rental", value: "car", icon: "car" },
  { label: "Valid ID", value: "id", icon: "card" },
  { label: "Other", value: "other", icon: "document" }
];

const Save = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("flight");

  const handleAddDocument = () => {
    if (!newDocumentName.trim()) {
      Alert.alert("Error", "Please enter a document name");
      return;
    }

    const newDocument = {
      id: Date.now().toString(),
      name: newDocumentName,
      type: selectedDocumentType,
      preview: "📄",
      date: new Date().toISOString().split('T')[0]
    };

    setDocuments([newDocument, ...documents]);
    setNewDocumentName("");
    setModalVisible(false);
    Alert.alert("Success", "Document added successfully!");
  };

  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(doc => doc.value === type);
    return docType ? docType.icon : "document";
  };

  const getDocumentColor = (type) => {
    const colors = {
      flight: "#FF6B6B",
      train: "#4ECDC4", 
      hotel: "#45B7D1",
      car: "#96CEB4",
      id: "#FECA57",
      other: "#778CA3"
    };
    return colors[type] || "#778CA3";
  };

  const renderDocumentItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getDocumentColor(item.type)}20` }}
          >
            <Ionicons 
              name={getDocumentIcon(item.type)} 
              size={20} 
              color={getDocumentColor(item.type)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-gray-500 text-sm">{item.date}</Text>
          </View>
        </View>
        
        <TouchableOpacity className="ml-3 p-2">
          <Text className="text-2xl">{item.preview}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 bg-white">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Travel Documents</Text>
          <TouchableOpacity 
            className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-md"
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6 bg-gray-50">
        {documents.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="document-text-outline" size={80} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              No documents saved yet.{'\n'}Tap the + button to add your first travel document.
            </Text>
          </View>
        ) : (
          <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Add Document Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-gray-900 mb-2">Add New Document</Text>
            <Text className="text-gray-600 mb-6">Select document type and enter a name</Text>
            
            {/* Document Type Selection */}
            <Text className="font-medium text-gray-700 mb-3">Document Type</Text>
            <View className="flex-row flex-wrap mb-6">
              {documentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  className={`flex-row items-center px-3 py-2 rounded-full mr-2 mb-2 border ${
                    selectedDocumentType === type.value 
                      ? "bg-blue-50 border-blue-500" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => setSelectedDocumentType(type.value)}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={16} 
                    color={selectedDocumentType === type.value ? "#3B82F6" : "#6B7280"} 
                  />
                  <Text 
                    className={`ml-1 text-sm ${
                      selectedDocumentType === type.value ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Document Name Input */}
            <Text className="font-medium text-gray-700 mb-2">Document Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
              placeholder="e.g., Flight Ticket to Paris"
              value={newDocumentName}
              onChangeText={setNewDocumentName}z
            />

            {/* Action Buttons */}
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="px-6 py-3 rounded-lg border border-gray-300"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-6 py-3 rounded-lg bg-blue-500"
                onPress={handleAddDocument}
              >
                <Text className="text-white font-medium">Save Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Save;