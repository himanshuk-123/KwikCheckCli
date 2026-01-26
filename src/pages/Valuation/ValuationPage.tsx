import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Layout, Selector } from '../../components';
import { useValuationStore } from '../../features/valuation/store/valuation.store';
import { AppStepListDataRecord } from '../../features/valuation/types';
import { COLORS } from '../../constants/Colors';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define Route Params for Valuation
type ValuationRouteParams = {
  Valuation: {
    leadId: string | number;
    vehicleType: string;
    imgUrl?: string; // Optional
  };
};

const ValuationPage = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ValuationRouteParams, 'Valuation'>>();
  const { leadId, vehicleType } = route.params;

  const { stepList, isLoading, error, fetchValuationSteps } = useValuationStore();

  // 1. Data Fetching on Mount (useEffect)
  useEffect(() => {
    if (leadId) {
      fetchValuationSteps(leadId);
    }
  }, [leadId]);

  // 2. Derived State (in UI as requested)
  // Logic: Filter images vs optional questions based on vehicle type
  const sides = stepList
    .filter(item => item.VehicleType?.toUpperCase() === vehicleType?.toUpperCase() && item.Images === true)
    .map(item => item.Name || "");

  const optionalRecords = stepList
    .filter(item => item.Images === false);

  const handleCardClick = (side: string) => {
    ToastAndroid.show(`Camera for ${side} not implemented yet`, ToastAndroid.SHORT);
  };

  const handleNextClick = () => {
    ToastAndroid.show("Upload not implemented yet", ToastAndroid.SHORT);
  };

  if (isLoading) {
    return (
      <Layout>
        <ActivityIndicator size="large" color={COLORS.AppTheme.primary} style={{ marginTop: 20 }} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchValuationSteps(leadId)} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Valuation ID: {leadId}</Text>
          <Text style={styles.subHeaderText}>Vehicle Type: {vehicleType}</Text>
        </View>

        {/* Video Record Mock */}
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.videoCard} onPress={() => ToastAndroid.show("Video Recording not implemented", ToastAndroid.SHORT)}>
            <Text style={styles.cardText}>Record Video</Text>
          </TouchableOpacity>
        </View>

        {/* Valuation Cards Grid */}
        <View style={styles.gridContainer}>
          {sides.length === 0 && !isLoading ? (
            <Text>No valuation steps found for {vehicleType}</Text>
          ) : (
            sides.map((side, index) => (
              <TouchableOpacity
                key={`${side}-${index}`}
                style={styles.card}
                onPress={() => handleCardClick(side)}
              >
                {/* Placeholder Icon */}
                <Text style={styles.iconText}>🚗</Text>
                <Text style={styles.cardText}>{side}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Optional Information (Read Only) */}
        {optionalRecords.length > 0 && (
          <View style={styles.optionalContainer}>
            <Text style={styles.sectionTitle}>Optional Information Record</Text>
            {optionalRecords.map((item, index) => (
              <Selector
                key={`opt-${index}`}
                keyText={item.Questions || item.Name || "Question"}
                valueText={item.Answer || ""}
                onPress={() => ToastAndroid.show("Optional Information is Read-Only in this version", ToastAndroid.SHORT)}
              />
            ))}
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextClick}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: COLORS.AppTheme.primary,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
  },
  videoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  videoCard: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  card: {
    width: '40%', // Roughly 2 columns
    aspectRatio: 1,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 30,
    marginBottom: 10,
  },
  cardText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  optionalContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 5,
  },
  nextButton: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: 'darkblue',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ValuationPage;
