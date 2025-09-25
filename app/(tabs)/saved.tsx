import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput,
  Alert,
  ScrollView,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    name: "Flight Ticket - NYC to LON",
    type: "flight",
    date: "2024-01-15",
    inputType: "manual",
    content: {
      airline: "British Airways",
      flight: "BA 178",
      from: "New York (JFK)",
      to: "London (LHR)",
      date: "January 15, 2024",
      passenger: "John Doe"
    }
  },
  {
    id: "2", 
    name: "Hotel Booking - Grand Plaza",
    type: "hotel",
    date: "2024-01-20",
    inputType: "manual",
    content: {
      hotel: "Grand Plaza Hotel",
      address: "123 Main Street, London, UK",
      checkIn: "January 20, 2024",
      checkOut: "January 25, 2024",
      guest: "John Doe"
    }
  }
];

const documentTypes = [
  { label: "Flight Ticket", value: "flight", icon: "airplane", fields: ["airline", "flight", "from", "to", "date", "passenger"] },
  { label: "Train Ticket", value: "train", icon: "train", fields: ["train", "from", "to", "date", "passenger"] },
  { label: "Hotel Booking", value: "hotel", icon: "business", fields: ["hotel", "address", "checkIn", "checkOut", "guest"] },
  { label: "Car Rental", value: "car", icon: "car", fields: ["company", "vehicle", "pickup", "period", "driver"] },
  { label: "Valid ID", value: "id", icon: "card", fields: ["type", "number", "name", "issueDate", "expiryDate"] },
  { label: "Other", value: "other", icon: "document", fields: ["description", "date", "reference"] }
];

const fieldLabels = {
  airline: "Airline",
  flight: "Flight Number",
  from: "From",
  to: "To",
  date: "Date",
  passenger: "Passenger",
  train: "Train",
  hotel: "Hotel Name",
  address: "Address",
  checkIn: "Check-in Date",
  checkOut: "Check-out Date",
  guest: "Guest Name",
  company: "Rental Company",
  vehicle: "Vehicle Type",
  pickup: "Pickup Location",
  period: "Rental Period",
  driver: "Driver Name",
  type: "ID Type",
  number: "ID Number",
  name: "Full Name",
  issueDate: "Issue Date",
  expiryDate: "Expiry Date",
  description: "Description",
  reference: "Reference Number"
};

const Save = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("flight");
  const [formData, setFormData] = useState({});
  const [inputMethod, setInputMethod] = useState("manual"); // "manual" or "upload"
  const [uploadedFile, setUploadedFile] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUploadedFile({
          uri: result.assets[0].uri,
          type: 'image',
          name: `image_${Date.now()}.jpg`
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.assets && result.assets.length > 0) {
        setUploadedFile({
          uri: result.assets[0].uri,
          type: 'document',
          name: result.assets[0].name,
          size: result.assets[0].size
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleAddDocument = () => {
    if (!newDocumentName.trim()) {
      Alert.alert("Error", "Please enter a document name");
      return;
    }

    if (inputMethod === "manual") {
      // Validate required fields for manual input
      const selectedType = documentTypes.find(doc => doc.value === selectedDocumentType);
      const hasData = selectedType.fields.some(field => formData[field]?.trim());
      
      if (!hasData) {
        Alert.alert("Error", "Please fill in at least one field");
        return;
      }
    } else if (inputMethod === "upload") {
      // Validate file upload
      if (!uploadedFile) {
        Alert.alert("Error", "Please upload a file");
        return;
      }
    }

    const newDocument = {
      id: Date.now().toString(),
      name: newDocumentName,
      type: selectedDocumentType,
      date: new Date().toISOString().split('T')[0],
      inputType: inputMethod,
      content: inputMethod === "manual" ? formData : null,
      file: inputMethod === "upload" ? uploadedFile : null
    };

    setDocuments([newDocument, ...documents]);
    setNewDocumentName("");
    setFormData({});
    setUploadedFile(null);
    setModalVisible(false);
    Alert.alert("Success", "Document added successfully!");
  };

  const handleDocumentPress = (document) => {
    setSelectedDocument(document);
    setPreviewModalVisible(true);
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

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderManualInputFields = () => {
    const selectedType = documentTypes.find(doc => doc.value === selectedDocumentType);
    
    return (
      <View>
        {selectedType.fields.map((field) => (
          <View key={field} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '500', color: '#374151', marginBottom: 4 }}>
              {fieldLabels[field] || field}
            </Text>
            <TextInput
              style={{ 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                borderRadius: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 12,
                color: '#1F2937'
              }}
              placeholder={`Enter ${fieldLabels[field] || field}`}
              value={formData[field] || ""}
              onChangeText={(text) => updateFormData(field, text)}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderUploadSection = () => {
    return (
      <View>
        <Text style={{ fontWeight: '500', color: '#374151', marginBottom: 12 }}>
          Upload Document
        </Text>
        
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              borderWidth: 2, 
              borderColor: uploadedFile?.type === 'image' ? '#3B82F6' : '#D1D5DB',
              borderStyle: 'dashed',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              backgroundColor: uploadedFile?.type === 'image' ? '#EFF6FF' : '#F9FAFB'
            }}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={32} color={uploadedFile?.type === 'image' ? '#3B82F6' : '#6B7280'} />
            <Text style={{ color: uploadedFile?.type === 'image' ? '#3B82F6' : '#6B7280', marginTop: 8, textAlign: 'center' }}>
              Upload Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              flex: 1, 
              borderWidth: 2, 
              borderColor: uploadedFile?.type === 'document' ? '#3B82F6' : '#D1D5DB',
              borderStyle: 'dashed',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              backgroundColor: uploadedFile?.type === 'document' ? '#EFF6FF' : '#F9FAFB'
            }}
            onPress={pickDocument}
          >
            <Ionicons name="document-attach-outline" size={32} color={uploadedFile?.type === 'document' ? '#3B82F6' : '#6B7280'} />
            <Text style={{ color: uploadedFile?.type === 'document' ? '#3B82F6' : '#6B7280', marginTop: 8, textAlign: 'center' }}>
              Upload File
            </Text>
          </TouchableOpacity>
        </View>

        {uploadedFile && (
          <View style={{ 
            backgroundColor: '#F0F9FF', 
            padding: 12, 
            borderRadius: 8, 
            borderLeftWidth: 4, 
            borderLeftColor: '#0EA5E9' 
          }}>
            <Text style={{ fontWeight: '500', color: '#0C4A6E' }}>
              {uploadedFile.name}
            </Text>
            <Text style={{ color: '#0369A1', fontSize: 12 }}>
              {uploadedFile.type === 'image' ? 'Image' : 'Document'} • {uploadedFile.size ? `Size: ${Math.round(uploadedFile.size / 1024)}KB` : 'Ready to upload'}
            </Text>
            <TouchableOpacity 
              onPress={() => setUploadedFile(null)}
              style={{ position: 'absolute', right: 12, top: 12 }}
            >
              <Ionicons name="close-circle" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDocumentPress(item)}>
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 12, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: `${getDocumentColor(item.type)}20`
              }}
            >
              <Ionicons 
                name={getDocumentIcon(item.type)} 
                size={20} 
                color={getDocumentColor(item.type)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>
                {item.date} • {item.inputType === 'manual' ? 'Manual Entry' : 'File Upload'}
              </Text>
            </View>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null;

    return (
      <View style={{ backgroundColor: 'white', borderRadius: 16, margin: 16, flex: 1 }}>
        {/* Preview Header */}
        <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>{selectedDocument.name}</Text>
            <TouchableOpacity 
              onPress={() => setPreviewModalVisible(false)}
              style={{ padding: 8 }}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View 
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 16, 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 8,
                backgroundColor: `${getDocumentColor(selectedDocument.type)}20`
              }}
            >
              <Ionicons 
                name={getDocumentIcon(selectedDocument.type)} 
                size={16} 
                color={getDocumentColor(selectedDocument.type)}
              />
            </View>
            <Text style={{ color: '#6B7280', textTransform: 'capitalize' }}>
              {selectedDocument.type} • {selectedDocument.date} • {selectedDocument.inputType === 'manual' ? 'Manual Entry' : 'File Upload'}
            </Text>
          </View>
        </View>

        {/* Preview Content */}
        <ScrollView style={{ padding: 24 }}>
          {selectedDocument.inputType === 'manual' ? (
            <View style={{ 
              backgroundColor: 'white', 
              borderWidth: 1, 
              borderColor: '#E5E7EB', 
              borderRadius: 12, 
              padding: 24 
            }}>
              {selectedDocument.content && Object.entries(selectedDocument.content).map(([key, value]) => (
                value && (
                  <View key={key} style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    paddingVertical: 12, 
                    borderBottomWidth: 1, 
                    borderBottomColor: '#F3F4F6',
                    alignItems: 'flex-start'
                  }}>
                    <Text style={{ color: '#6B7280', fontWeight: '500', flex: 1, textTransform: 'capitalize' }}>
                      {fieldLabels[key] || key}:
                    </Text>
                    <Text style={{ color: '#111827', textAlign: 'right', flex: 1, marginLeft: 16 }}>
                      {value}
                    </Text>
                  </View>
                )
              ))}
            </View>
          ) : (
            <View style={{ 
              backgroundColor: 'white', 
              borderWidth: 1, 
              borderColor: '#E5E7EB', 
              borderRadius: 12, 
              padding: 24,
              alignItems: 'center'
            }}>
              {selectedDocument.file?.type === 'image' ? (
                <Image 
                  source={{ uri: selectedDocument.file.uri }} 
                  style={{ width: '100%', height: 300, borderRadius: 8 }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <Ionicons name="document-outline" size={80} color="#3B82F6" />
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 16 }}>
                    {selectedDocument.file?.name || 'Uploaded Document'}
                  </Text>
                  <Text style={{ color: '#6B7280', marginTop: 8 }}>
                    {selectedDocument.file?.size ? `Size: ${Math.round(selectedDocument.file.size / 1024)}KB` : 'Document File'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
              <Ionicons name="share-outline" size={20} color="#4B5563" />
              <Text style={{ color: '#374151', marginTop: 4, fontWeight: '500' }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
              <Ionicons name="download-outline" size={20} color="#4B5563" />
              <Text style={{ color: '#374151', marginTop: 4, fontWeight: '500' }}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flex: 1, backgroundColor: '#FEF2F2', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
              onPress={() => {
                setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
                setPreviewModalVisible(false);
                Alert.alert("Success", "Document deleted successfully!");
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
              <Text style={{ color: '#DC2626', marginTop: 4, fontWeight: '500' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Travel Documents</Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#3B82F6', 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              alignItems: 'center', 
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, backgroundColor: '#F9FAFB' }}>
        {documents.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="document-text-outline" size={80} color="#D1D5DB" />
            <Text style={{ color: '#6B7280', fontSize: 18, marginTop: 16, textAlign: 'center' }}>
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
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingHorizontal: 16,
          paddingVertical: 32
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            width: '100%', 
            maxWidth: 400,
            maxHeight: '90%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            {/* Fixed Header */}
            <View style={{ 
              padding: 24, 
              borderBottomWidth: 1, 
              borderBottomColor: '#E5E7EB' 
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                Add New Document
              </Text>
              <Text style={{ color: '#6B7280' }}>
                Select document type and enter details
              </Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 24 }}>
                {/* Input Method Selection */}
                <Text style={{ fontWeight: '500', color: '#374151', marginBottom: 12 }}>
                  Input Method
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  marginBottom: 16, 
                  backgroundColor: '#F3F4F6', 
                  borderRadius: 8, 
                  padding: 4 
                }}>
                  <TouchableOpacity
                    style={{ 
                      flex: 1, 
                      paddingVertical: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                      backgroundColor: inputMethod === 'manual' ? '#3B82F6' : 'transparent'
                    }}
                    onPress={() => setInputMethod('manual')}
                  >
                    <Text style={{ 
                      color: inputMethod === 'manual' ? 'white' : '#374151', 
                      fontWeight: '500' 
                    }}>
                      Manual Input
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ 
                      flex: 1, 
                      paddingVertical: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                      backgroundColor: inputMethod === 'upload' ? '#3B82F6' : 'transparent'
                    }}
                    onPress={() => setInputMethod('upload')}
                  >
                    <Text style={{ 
                      color: inputMethod === 'upload' ? 'white' : '#374151', 
                      fontWeight: '500' 
                    }}>
                      Upload File
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Document Type Selection */}
                <Text style={{ fontWeight: '500', color: '#374151', marginBottom: 12 }}>
                  Document Type
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                  {documentTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        paddingHorizontal: 12, 
                        paddingVertical: 8, 
                        borderRadius: 20, 
                        marginRight: 8, 
                        marginBottom: 8,
                        borderWidth: 1,
                        backgroundColor: selectedDocumentType === type.value ? '#EFF6FF' : '#F9FAFB',
                        borderColor: selectedDocumentType === type.value ? '#3B82F6' : '#E5E7EB'
                      }}
                      onPress={() => setSelectedDocumentType(type.value)}
                    >
                      <Ionicons 
                        name={type.icon} 
                        size={16} 
                        color={selectedDocumentType === type.value ? "#3B82F6" : "#6B7280"} 
                      />
                      <Text 
                        style={{ 
                          marginLeft: 4, 
                          fontSize: 14,
                          color: selectedDocumentType === type.value ? "#3B82F6" : "#6B7280"
                        }}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Document Name Input */}
                <Text style={{ fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Document Name
                </Text>
                <TextInput
                  style={{ 
                    borderWidth: 1, 
                    borderColor: '#D1D5DB', 
                    borderRadius: 8, 
                    paddingHorizontal: 16, 
                    paddingVertical: 12,
                    color: '#1F2937',
                    marginBottom: 16
                  }}
                  placeholder="e.g., Flight Ticket to Paris"
                  value={newDocumentName}
                  onChangeText={setNewDocumentName}
                />

                {/* Dynamic Input Section */}
                {inputMethod === 'manual' ? renderManualInputFields() : renderUploadSection()}
              </View>
            </ScrollView>

            {/* Fixed Footer with Action Buttons */}
            <View style={{ 
              padding: 24, 
              borderTopWidth: 1, 
              borderTopColor: '#E5E7EB',
              flexDirection: 'row', 
              justifyContent: 'flex-end', 
              gap: 12 
            }}>
              <TouchableOpacity
                style={{ 
                  paddingHorizontal: 24, 
                  paddingVertical: 12, 
                  borderRadius: 8, 
                  borderWidth: 1, 
                  borderColor: '#D1D5DB'
                }}
                onPress={() => {
                  setModalVisible(false);
                  setFormData({});
                  setUploadedFile(null);
                  setNewDocumentName("");
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '500' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ 
                  paddingHorizontal: 24, 
                  paddingVertical: 12, 
                  borderRadius: 8, 
                  backgroundColor: '#3B82F6'
                }}
                onPress={handleAddDocument}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>Save Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={previewModalVisible}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          {renderDocumentPreview()}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Save;