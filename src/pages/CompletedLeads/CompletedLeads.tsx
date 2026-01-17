import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
// @ts-ignore
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/Colors";
import ClubSvg from "../../assets/Club-svg";
import HSVG from "../../assets/H-Svg";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");

interface LeadsData {
  completedLead: number;
  qccompleted: number;
  qchold: number;
  qcpending: number;
}

const STATIC_LEADS_DATA: LeadsData = {
  qcpending: 8,
  qccompleted: 15,
  qchold: 3,
  completedLead: 42,
};

interface LeadCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  onPress: () => void;
}

const LeadCard = ({ title, count, icon, onPress }: LeadCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{count} </Text>
          <Text style={styles.reportsText}>Reports</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CompletedLeads() {
  const leadsData = STATIC_LEADS_DATA;
  const navigation = useNavigation<any>();
  const handleNavigation = (pageName: string) => {
    console.log("Navigate to:", pageName);
    // Placeholder for navigation logic
    navigation.navigate(pageName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <LeadCard
          title="QC Pending"
          count={leadsData.qcpending}
          icon={<ClubSvg />}
          onPress={() => handleNavigation("ValuationCompletedLeads")}
        />
        <LeadCard
          title="QC Completed"
          count={leadsData.qccompleted}
          icon={<HSVG />}
          onPress={() => handleNavigation("ValuationCompletedLeads")}
        />
        <LeadCard
          title="QC Hold"
          count={leadsData.qchold}
          icon={
            <MaterialIcons
              name="pause"
              size={75}
              color={COLORS.AppTheme.primary}
            />
          }
          onPress={() => handleNavigation("ValuationCompletedLeads")}
        />
        <LeadCard
          title="Completed Lead"
          count={leadsData.completedLead}
          icon={
            <MaterialCommunityIcons
              name="check-decagram"
              size={75}
              color={COLORS.AppTheme.primary}
            />
          }
          onPress={() => handleNavigation("ValuationCompletedLeads")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 16,
  },
  card: {
    width: '48%',
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180,
      marginBottom: 16,

  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  iconContainer: {
    marginVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    height: 75,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
  },
  countText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.AppTheme.primary,
  },
  reportsText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#4b5563",
  },
});
