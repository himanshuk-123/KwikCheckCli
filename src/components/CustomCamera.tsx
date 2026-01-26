import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import AntDesign from "react-native-vector-icons/AntDesign";
import { uploadValuationImageApi } from "../features/valuation/api/valuation.api";
import { ToastAndroid } from "react-native";

const CustomCamera = ({ route }: { route: any }) => {
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<any>();

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  // Get params from navigation
  const { id, side, vehicleType } = route.params || {};

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  /* ---------- PERMISSION ---------- */
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  /* ---------- CAMERA LIFECYCLE ---------- */
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setIsCameraActive(false);
    });
    return unsubscribe;
  }, [navigation]);

  /* ---------- CAPTURE ---------- */
  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePhoto({
        flash: "off",
        qualityPrioritization: "balanced",
      });

      setImageUri(`file://${photo.path}`);
      setIsCameraActive(false);
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  /* ---------- HELPERS ---------- */
  const readAsBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result as string;
          // Remove data:image/jpeg;base64, prefix if present
          resolve(base64data.split(',')[1] || base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Base64 conversion failed", e);
      return null;
    }
  };

  /* ---------- PROCEED ---------- */
  const handleProceed = async () => {
    if (!imageUri) return;

    // 1. Prepare Navigation Params
    // Check if we need to show modal (passed from previous screen or determined here? 
    // CLI structure implies ValuationPage handles modal logic based on step data, 
    // so we pass a flag if needed. For now, let's just return success).

    // Navigate back IMMEDIATELY
    navigation.navigate("Valuate", {
      id,
      vehicleType,
      imageUri,
      side,
      // Pass other params if needed for Modal trigger
    });

    // 2. Background Upload (Fire and Forget)
    (async () => {
      try {
        const base64 = await readAsBase64(imageUri);
        if (!base64) return;

        // Mock location or fetch if possible (keeping it simple and fast as requested)
        const location = { lat: '0', long: '0', timeStamp: new Date().toISOString() };

        // Construct dynamic param name
        const { appColumn } = route.params || {};
        const paramName = appColumn ? `${appColumn}Base64` : 'OtherBase64';

        await uploadValuationImageApi(
          base64,
          paramName,
          id,
          vehicleType,
          location
        );
        ToastAndroid.show("Image uploaded in background", ToastAndroid.SHORT);
      } catch (e) {
        console.error("Background upload failed", e);
      }
    })();
  };

  /* ---------- LOADER ---------- */
  if (!hasPermission || !device) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1181B2" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>
          Preparing camera…
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* ---------- IMAGE PREVIEW ---------- */}
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          {/* CLOSE / RETAKE */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setImageUri(null);
              setIsCameraActive(true);
            }}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* PROCEED */}
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={handleProceed}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ---------- CAMERA ---------- */
        isCameraActive && (
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isCameraActive}
              photo
            />

            <View style={styles.captureContainer}>
              <TouchableOpacity
                onPress={handleCapture}
                disabled={isCapturing}
                style={styles.captureBtn}
              >
                {isCapturing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <AntDesign name="camera" size={32} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
};

export default CustomCamera;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  captureContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },

  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1181B2",
    justifyContent: "center",
    alignItems: "center",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },

  previewImage: {
    flex: 1,
    width: "100%",
  },

  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },

  proceedBtn: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1181B2",
    width: 180,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  proceedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
