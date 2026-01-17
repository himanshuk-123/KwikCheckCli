import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { COLORS } from '../../constants/Colors.tsx';
import { SafeAreaView } from "react-native-safe-area-context";
// import { useCustomNavigation } from "@src/services/useCustomNavigation";

type Props = {};

const Account = (props: Props) => {
  // const { pushNavigation } = useCustomNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View>
          <View style={styles.imageContainer}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={{uri: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D'}}
              />
            </View>
            <Text style={styles.imageContainerText}>Shop Name</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.fwBold}>User Name</Text>
            <TextInput
              style={styles.input}
              placeholder="john@doe.com"
              value="johndoe"
              editable={false}
            />
            <Text style={styles.fwBold}>Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="john@doe.com"
              value="john@doe.com"
              editable={false}
            />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled
          keyboardVerticalOffset={Platform.select({ ios: 80, android: 50 })}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              // onPress={() => {
              //   pushNavigation("ChangePassword");
              // }}
            >
              <Text style={styles.primaryButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageContainerText: {
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 20,
    textAlign: "center",
  },
  fwBold: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  buttonContainer: {
    height: 150,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.AppTheme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  outlineButtonText: {
    color: COLORS.AppTheme.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: COLORS.AppTheme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
