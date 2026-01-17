import {
  StyleSheet,
  ToastAndroid,
  View,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../../constants/Colors";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// @ts-ignore
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// ============ STATIC DATA ============
const STATIC_COLORS = [
  { id: 1, name: "White" },
  { id: 2, name: "Black" },
  { id: 3, name: "Silver" },
  { id: 4, name: "Red" },
  { id: 5, name: "Blue" },
];

const STATIC_MAKES = ["Maruti Suzuki", "Hyundai", "Tata", "Honda"];
const STATIC_MODELS = ["WagonR", "Swift", "Baleno", "Ertiga"];
const STATIC_VARIANTS = ["VXI", "VDI", "LXI", "ZXI"];
const STATIC_FUEL_TYPES = [
  { id: 1, name: "Petrol" },
  { id: 2, name: "Diesel" },
  { id: 3, name: "CNG" },
  { id: 4, name: "Electric" },
];
const STATIC_VEHICLE_TYPES = [
  { id: 1, name: "Private", category: "Personal" },
  { id: 2, name: "Commercial", category: "Business" },
  { id: 3, name: "Taxi", category: "Transport" },
];

interface CarData {
  registrationId: string;
  vehicleType: string;
  yearOfManufacture: string;
  make: string;
  model: string;
  variant: string;
  vehicleFuelType: string;
  location: string;
  color: string;
  odometerReading: string;
  ownerName: string;
  HPAStatus: string;
  HPABank: string;
  summary: string;
  chassisNumber: string;
  engineNumber: string;
  customerName: string;
  ownerSerial: string;
  repoDate: any;
  remarks: string;
}

type CarDataKeys =
  | "registrationId"
  | "vehicleType"
  | "yearOfManufacture"
  | "make"
  | "model"
  | "variant"
  | "vehicleFuelType"
  | "location"
  | "color"
  | "odometerReading"
  | "ownerName"
  | "HPAStatus"
  | "HPABank"
  | "chassisNumber"
  | "engineNumber"
  | "customerName"
  | "ownerSerial"
  | "repoDate"
  | "remarks"
  | "summary";

interface setDataType {
  key: CarDataKeys;
  value: string;
}

// ============ INLINE COMPONENTS ============

const HorizontalBreak = () => <View style={styles.horizontalBreak} />;

interface SelectorProps {
  keyText: string;
  valueText: string;
  disabled?: boolean;
  onPress: () => void;
}

const Selector = ({ keyText, valueText, disabled, onPress }: SelectorProps) => {
  return (
    <TouchableOpacity
      style={[styles.selectorContainer, disabled && styles.selectorDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.selectorLabel}>{keyText}</Text>
      <Text style={styles.selectorValue}>{valueText || "Select..."}</Text>
    </TouchableOpacity>
  );
};

const InputComponent = ({
  placeholder,
  parameter,
  onChangeText,
  value,
  disabled = false,
}: {
  parameter: string;
  placeholder: string;
  value: string;
  onChangeText: (data: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        autoCapitalize="characters"
        secureTextEntry={false}
      />
    </View>
  );
};

/**
 *
 * registration id
 * year of manufacturing
 * fuel type
 * mode
 * variant
 * owner name
 * chassis number
 * engine number
 * owner serial
 * ownership type
 * vehicle summary
 * Color
 * location
 * request id
 * HPA Status
 * HPA Bank
 * @returns
 */
interface ColorType {
  id: number;
  name: string;
}

const VehicleDetails = ({ route }: { route: any }) => {
  const { carId } = route.params || { carId: "KWC12345" };
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [filterData, setFilterData] = useState<string>("");
  const [carData, setCarData] = useState<CarData>({
    registrationId: carId,
    vehicleType: "",
    yearOfManufacture: "",
    make: "",
    model: "",
    variant: "",
    vehicleFuelType: "",
    location: "",
    color: "",
    odometerReading: "",
    ownerName: "Neeraj Dave",
    HPAStatus: "",
    HPABank: "",
    summary: "",
    chassisNumber: "",
    customerName: "",
    engineNumber: "",
    ownerSerial: "",
    repoDate: "",
    remarks: "",
  });
  const [bottomSheetData, setBottomSheetData] = useState<{
    key: CarDataKeys;
    value: string[];
  }>();
  const [bottomSheetModalState, setBottomSheetModalState] = useState(-1);

  // variables
  const snapPoints = useMemo(() => ["50%", "100%"], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const setParam = (param: CarDataKeys, data: string) => {
    setCarData({
      ...carData,
      [param]: data.toUpperCase(),
    });
  };

  const FetchVahan = async () => {
    // Static implementation - no API call
    ToastAndroid.show("Using static data", ToastAndroid.SHORT);
    setCarData({
      ...carData,
      yearOfManufacture: "06/2020",
      chassisNumber: "MA3ERLF3S00123456",
      engineNumber: "K12M1234567",
      customerName: "RAJESH KUMAR",
      ownerSerial: "1",
      color: "White",
    });
  };

  const handleSetData = (key: setDataType["key"], value: any) => {
    setCarData({ ...carData, [key]: value });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetModalState == 1) {
        handleCloseModalPress();
      } else {
        return false;
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [bottomSheetModalState]);

  const HandleSubmit = async () => {
    try {
      // if (
      //   !carData.color ||
      //   !carData.vehicleType ||
      //   !carData.vehicleFuelType ||
      //   !carData.customerName ||
      //   !carData.yearOfManufacture ||
      //   !carData.make ||
      //   !carData.model ||
      //   !carData.variant ||
      //   !carData.chassisNumber ||
      //   !carData.engineNumber ||
      //   !carData.ownerSerial
      // ) {
      //   ToastAndroid.show("Please fill all the fields", ToastAndroid.LONG);
      //   return;
      // }

      ToastAndroid.show("Data saved successfully!", ToastAndroid.LONG);
      // Navigate back
      navigation.navigate('My Tasks');
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error saving data", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome6 name="arrow-left" size={20} color={"white"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Vehicle Details</Text>
          </View>
          <TouchableOpacity style={styles.fetchVahanBtn} onPress={FetchVahan}>
            <Text style={styles.fetchVahanText}>Fetch vahan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <InputComponent
            placeholder="Registration Number"
            disabled
            onChangeText={(text) =>
              setParam("registrationId", text)
            }
            value={carData["registrationId"]}
          />

          <Selector
            keyText="Year of Manufacturing"
            valueText={carData.yearOfManufacture}
            disabled={false}
            onPress={() => {
              DateTimePickerAndroid.open({
                value: new Date(),
                onChange: (e, date) => {
                  if (e.type !== "dismissed") {
                    const formattedDate = date?.toLocaleDateString("en-IN", {
                      month: "2-digit",
                      year: "numeric",
                    }) || "";
                    setParam("yearOfManufacture", formattedDate);
                  }
                },
                mode: "date",
                timeZoneName: "Asia/Kolkata",
                display: "spinner",
              });
            }}
          />
          <HorizontalBreak />
          <Selector
            keyText="Make"
            valueText={carData.make}
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "make",
                value: STATIC_MAKES,
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Model"
            valueText={carData.model}
            onPress={() => {
              if (!carData.make) {
                ToastAndroid.show("Please select Make", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "model",
                value: STATIC_MODELS,
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Variant"
            valueText={carData.variant}
            onPress={() => {
              if (!carData.model) {
                ToastAndroid.show("Please select Model", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "variant",
                value: STATIC_VARIANTS,
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Vehicle Type"
            valueText={carData.vehicleType}
            onPress={() => {
              if (!carData.variant) {
                ToastAndroid.show("Please select Varient", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "vehicleType",
                value: STATIC_VEHICLE_TYPES.map((item) => item.name),
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Fuel Type"
            valueText={carData.vehicleFuelType}
            onPress={() => {
              if (!carData.vehicleType) {
                ToastAndroid.show(
                  "Please select Vehicle Type",
                  ToastAndroid.LONG
                );
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "vehicleFuelType",
                value: STATIC_FUEL_TYPES.map((item) => item.name),
              });
            }}
          />

          <HorizontalBreak />
          <InputComponent
            parameter="chassisNumber"
            disabled={false}
            placeholder="Chassis Number"
            onChangeText={(text) => setParam("chassisNumber", text)}
            value={carData["chassisNumber"]}
          />

          <InputComponent
            parameter="engineNumber"
            disabled={false}
            placeholder="Engine Number"
            onChangeText={(text) => setParam("engineNumber", text)}
            value={carData["engineNumber"]}
          />

          <InputComponent
            disabled={false}
            placeholder="Customer Name"
            onChangeText={(text) => setParam("customerName", text)}
            value={carData["customerName"]}
          />

          <Selector
            keyText="Owner Serial"
            disabled={false}
            valueText={carData.ownerSerial}
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "ownerSerial",
                value: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Color"
            disabled={false}
            valueText={carData.color}
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "color",
                value: STATIC_COLORS.map((item) => item.name),
              });
            }}
          />
          <HorizontalBreak />

          {(carData.vehicleType.toLowerCase() === "repo" ||
            carData.vehicleType.toLowerCase() === "commercial") && (
            <>
              <Selector
                keyText="Repo Date"
                valueText={carData.repoDate}
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    minimumDate: new Date(),
                    onChange: (event, date) => {
                      if (event.type === "dismissed") {
                        setParam("repoDate", "");
                        return;
                      }
                      const formattedRepoDate = (date?.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) || "").replace(/\//g, "-");
                      setParam("repoDate", formattedRepoDate);
                    },
                    mode: "date",
                    timeZoneName: "Asia/Kolkata",
                    display: "spinner",
                  });
                }}
              />
              <HorizontalBreak />
            </>
          )}

          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Remarks"
              placeholderTextColor="#999"
              value={carData.remarks}
              onChangeText={(e) => {
                setParam("remarks", e);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={HandleSubmit}
            style={styles.submitButton}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.bottomSheetWrapper, { marginTop: insets.top + 5 }]}>
        <BottomSheetModalProvider>
          <View style={styles.bottomSheetContainer}>
            <BottomSheetModal
              enablePanDownToClose
              enableDismissOnClose
              onDismiss={handleCloseModalPress}
              ref={bottomSheetModalRef}
              index={1}
              enableOverDrag={false}
              enableDynamicSizing={false}
              enableContentPanningGesture={false}
              snapPoints={snapPoints}
              onChange={(e) => {
                if (e !== bottomSheetModalState) {
                  setBottomSheetModalState(e);
                }
              }}
            >
              <BottomSheetView style={styles.contentContainer}>
                <View style={styles.searchInputWrapper}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#999"
                    maxLength={50}
                    onChangeText={(value) => setFilterData(value)}
                    value={filterData}
                  />
                </View>

                <FlatList
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews
                  style={styles.flatList}
                  data={bottomSheetData?.value.filter((item) =>
                    item?.toLowerCase()?.includes(filterData.toLowerCase())
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        if (!bottomSheetData?.key) {
                          ToastAndroid.show(
                            "Something went wrong while saving data",
                            ToastAndroid.SHORT
                          );
                          return;
                        }
                        handleSetData(bottomSheetData?.key, item);
                        handleCloseModalPress();
                        setFilterData("");
                      }}
                    >
                      <Text style={styles.listItemText}>
                        {item.replaceAll("(Client)", "")}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </View>
    </SafeAreaView>
  );
};

export default VehicleDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.AppTheme.primaryBg,
  },
  scrollView: {
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.AppTheme.primaryBg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  fetchVahanBtn: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  fetchVahanText: {
    color: "black",
    fontSize: 15,
    fontWeight: "500",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  horizontalBreak: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
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
  selectorDisabled: {
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
    maxWidth: "50%",
    textAlign: "right",
  },
  detailsListContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  detailsListCell: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 50,
    paddingHorizontal: 8,
  },
  detailsListHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsListValue: {
    fontSize: 16,
    paddingLeft: 8,
  },
  inputWrapper: {
    marginVertical: 7,
    width: "100%",
  },
  input: {
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderWidth: 0,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  inputDisabled: {
    opacity: 0.6,
  },
  textAreaWrapper: {
    marginVertical: 7,
    width: "100%",
  },
  textArea: {
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderWidth: 0,
    minHeight: 100,
    maxHeight: 150,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: COLORS.AppTheme.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSheetWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  searchInputWrapper: {
    width: "90%",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  searchInput: {
    backgroundColor: COLORS.Dashboard.bg.Grey,
    borderWidth: 0,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  flatList: {
    width: "100%",
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemText: {
    textAlign: "center",
    fontSize: 16,
    textTransform: "capitalize",
    color: "#333",
  },
});
