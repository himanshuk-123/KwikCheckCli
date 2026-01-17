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

  /* ---------- PROCEED ---------- */
  const handleProceed = () => {
    if (!imageUri) return;

    navigation.navigate("Valuate", {
      id,
      vehicleType,
      imageUri,
      side,
    });
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
