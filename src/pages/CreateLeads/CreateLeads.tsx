import {
  BackHandler,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  Text as RNText,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";   
// ============ STATIC DATA ============
const STATIC_CLIENT_NAMES = [
  "Client A",
  "Client B",
  "Client C",
  "Client D",
];

const STATIC_VEHICLE_TYPES = ["Retail", "Repo"];

const STATIC_VEHICLE_CATEGORIES = ["2W", "3W", "4W", "FE", "CV", "CE"];

const STATIC_CLIENT_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
];

const STATIC_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
];

const STATIC_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
];

const STATIC_AREAS = [
  "Area 1",
  "Area 2",
  "Area 3",
  "Area 4",
];

const STATIC_YARDS = ["Yard A", "Yard B", "Yard C"];

// ============ COMPONENTS ============

interface CustomInputProps {
  isNumeric?: boolean;
  maxLength?: number;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}

const CustomInput = ({
  isNumeric,
  maxLength,
  placeholder,
  value,
  onChangeText,
}: CustomInputProps) => {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={isNumeric ? "numeric" : "default"}
      maxLength={maxLength}
    />
  );
};

interface SelectorProps {
  keyText: string;
  valueText: string;
  onPress: () => void;
  disabled?: boolean;
}

const Selector = ({ keyText, valueText, onPress, disabled }: SelectorProps) => {
  return (
    <TouchableOpacity
      style={[styles.selectorContainer, disabled && styles.disabledSelector]}
      onPress={onPress}
      disabled={disabled}
    >
      <RNText style={styles.selectorLabel}>{keyText}</RNText>
      <RNText style={styles.selectorValue}>
        {valueText || "Select..."}
      </RNText>
    </TouchableOpacity>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  style?: any;
}

const Layout = ({ children, style }: LayoutProps) => {
  return (
    <SafeAreaView style={[styles.layoutContainer, style]}>
      <ScrollView
        contentContainerStyle={styles.layoutContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const CreateLeads = () => {
  // const navigation = useNavigation<any>();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState<{
    key: string;
    value: string[];
  }>({ key: "", value: [] });

  const [data, setData] = useState({
    clientName: "",
    vehicleType: "",
    vehicleCategory: "",
    clientCity: "",
    registrationNumber: "",
    propspectNumber: "",
    customerName: "",
    customerMobile: "",
    customerState: "",
    customerCity: "",
    customerArea: "",
    customerPin: "",
    customerAddress: "",
    yardName: "",
    chassisNo: "",
  });

  const handleSetData = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  const handlePresentModalPress = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModalPress = useCallback(() => {
    setShowModal(false);
    setFilterData("");
  }, []);

  const HandleSubmit = async () => {
    const isRetail = data.vehicleType === "Retail";
    const isRepo = data.vehicleType.toLowerCase() === "repo";

    if (isRetail) {
      if (
        !data.clientName ||
        !data.vehicleType ||
        !data.vehicleCategory ||
        !data.clientCity ||
        !data.registrationNumber ||
        !data.propspectNumber ||
        !data.customerName ||
        !data.customerMobile ||
        !data.customerPin
      ) {
        ToastAndroid.show(
          "Please fill all the mandatory details",
          ToastAndroid.LONG
        );
        return;
      }
      if (!data.customerState || !data.customerCity || !data.customerArea) {
        ToastAndroid.show(
          "Please fill all the mandatory details",
          ToastAndroid.LONG
        );
        return;
      }
    } else if (isRepo) {
      if (!data.yardName || !data.chassisNo) {
        ToastAndroid.show(
          "Please fill all the mandatory details",
          ToastAndroid.LONG
        );
        return;
      }
    }

    // Success message
    ToastAndroid.show("Lead created successfully!", ToastAndroid.LONG);
    navigation.goBack();
    console.log("Created Lead:", data);
    
    // Uncomment to navigate back
    // navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      if (showModal) {
        handleCloseModalPress();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [showModal, handleCloseModalPress]);

  return (
    <>
      <Layout style={styles.layoutStyle}>
        {/* Client Name */}
        <Selector
          keyText="Client Name"
          valueText={data.clientName}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "clientName",
              value: STATIC_CLIENT_NAMES,
            });
          }}
        />

        <View style={styles.divider} />

        {/* Vehicle Type */}
        <Selector
          keyText="Vehicle Type"
          valueText={data.vehicleType}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "vehicleType",
              value: STATIC_VEHICLE_TYPES,
            });
          }}
        />

        <View style={styles.divider} />

        {/* Vehicle Category */}
        <Selector
          keyText="Vehicle Category"
          valueText={data.vehicleCategory}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "vehicleCategory",
              value: STATIC_VEHICLE_CATEGORIES,
            });
          }}
        />

        <View style={styles.divider} />

        {/* Client City */}
        <Selector
          keyText="Client City"
          valueText={data.clientCity}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "clientCity",
              value: STATIC_CLIENT_CITIES,
            });
          }}
        />

        <View style={styles.divider} />

        {/* Registration Number */}
        <CustomInput
          placeholder="Registration Number"
          value={data.registrationNumber}
          maxLength={11}
          onChangeText={(value) => {
            if (value.length > 11) return;
            handleSetData("registrationNumber", value.toUpperCase());
          }}
        />

        {/* Chassis Number (Repo Only) */}
        {data.vehicleType.toLowerCase() === "repo" && (
          <>
            <View style={styles.spacer} />
            <CustomInput
              placeholder="Chassis Number"
              value={data.chassisNo}
              onChangeText={(value) =>
                handleSetData("chassisNo", value.toUpperCase())
              }
            />
          </>
        )}

        <View style={styles.spacer} />

        {/* Prospect Number */}
        <CustomInput
          placeholder="Prospect Number"
          value={data.propspectNumber}
          onChangeText={(value) =>
            handleSetData("propspectNumber", value.toUpperCase())
          }
        />

        <View style={styles.spacer} />

        {/* Customer Name */}
        <CustomInput
          placeholder="Customer Name"
          value={data.customerName}
          onChangeText={(value) => {
            const filteredText = value.replace(/[^a-zA-Z\s]/g, "");
            handleSetData("customerName", filteredText.toUpperCase());
          }}
        />

        <View style={styles.spacer} />

        {/* Customer Mobile */}
        <CustomInput
          isNumeric
          maxLength={10}
          placeholder="Customer Mobile Number"
          value={data.customerMobile}
          onChangeText={(value) => {
            if (value.length > 10) return;
            handleSetData("customerMobile", value);
          }}
        />

        <View style={styles.spacer} />

        {/* Customer State */}
        <Selector
          keyText="Customer State"
          valueText={data.customerState}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "customerState",
              value: STATIC_STATES,
            });
          }}
        />

        <View style={styles.divider} />

        {/* Yard Name / Customer City */}
        <Selector
          keyText={
            data.vehicleType === "Repo" ? "Yard Name" : "Customer City"
          }
          valueText={
            data.vehicleType === "Repo" ? data.yardName : data.customerCity
          }
          onPress={() => {
            if (!data.customerState) {
              ToastAndroid.show(
                "Please Select Customer State",
                ToastAndroid.LONG
              );
              return;
            }

            handlePresentModalPress();
            if (data.vehicleType === "Repo") {
              setBottomSheetData({
                key: "yardName",
                value: STATIC_YARDS,
              });
            } else {
              setBottomSheetData({
                key: "customerCity",
                value: STATIC_CITIES,
              });
            }
          }}
        />

        {/* Customer Area & Pin (Retail Only) */}
        {data.vehicleType !== "Repo" && (
          <>
            <View style={styles.divider} />

            <Selector
              keyText="Customer Area"
              valueText={data.customerArea}
              onPress={() => {
                if (!data.customerCity) {
                  ToastAndroid.show(
                    "Please Select Customer City",
                    ToastAndroid.LONG
                  );
                  return;
                }

                handlePresentModalPress();
                setBottomSheetData({
                  key: "customerArea",
                  value: STATIC_AREAS,
                });
              }}
            />

            <View style={styles.divider} />

            <CustomInput
              isNumeric
              maxLength={6}
              placeholder="Customer Pincode"
              value={data.customerPin}
              onChangeText={(value) => handleSetData("customerPin", value)}
            />

            <View style={styles.spacer} />

            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Customer Address"
              placeholderTextColor="#999"
              value={data.customerAddress}
              onChangeText={(value) =>
                handleSetData("customerAddress", value)
              }
              multiline
              numberOfLines={4}
            />
          </>
        )}

        <View style={styles.spacer} />
        <View style={styles.spacer} />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={HandleSubmit}
          activeOpacity={0.7}
        >
          <RNText style={styles.submitButtonText}>Submit</RNText>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </Layout>

      {/* Selection Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModalPress}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={filterData}
              onChangeText={setFilterData}
            />

            {/* List */}
            <FlatList
              data={bottomSheetData.value.filter((item) =>
                item.toLowerCase().includes(filterData.toLowerCase())
              )}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    if (!bottomSheetData.key) {
                      ToastAndroid.show(
                        "Something went wrong while saving data",
                        ToastAndroid.SHORT
                      );
                      return;
                    }
                    handleSetData(bottomSheetData.key, item);
                    handleCloseModalPress();
                  }}
                >
                  <RNText style={styles.listItemText}>
                    {item.replace("(Client)", "").trim()}
                  </RNText>
                </TouchableOpacity>
              )}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModalPress}
            >
              <RNText style={styles.closeButtonText}>Close</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CreateLeads;

const styles = StyleSheet.create({
  // Layout Styles
  layoutStyle: {
    backgroundColor: "white",
    position: "relative",
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  layoutContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  // Selector Styles
  selectorContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disabledSelector: {
    opacity: 0.6,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.AppTheme.primary,
  },
  selectorValue: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },

  // Text Input Styles
  textInput: {
    height: 50,
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#000",
    marginVertical: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingVertical: 12,
  },

  // Divider Styles
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },

  // Spacer Styles
  spacer: {
    height: 8,
  },
  bottomPadding: {
    height: 80,
  },

  // Button Styles
  submitButton: {
    backgroundColor: COLORS.AppTheme.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // Search Input
  searchInput: {
    height: 50,
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#000",
    marginBottom: 20,
  },

  // List Item Styles
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.AppTheme.primary,
    textTransform: "capitalize",
    textAlign: "center",
  },

  // Close Button
  closeButton: {
    backgroundColor: COLORS.AppTheme.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
