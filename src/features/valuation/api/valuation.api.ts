import apiCallService from '../../../services/apiCallService';
import { AppStepListDataRecord, AppStepListResponse } from '../types';
import { ToastAndroid } from 'react-native';

export const fetchAppStepListApi = async (leadId: string): Promise<AppStepListDataRecord[]> => {
  try {
    // Use URLSearchParams for x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('LeadId', leadId);
    params.append('Version', '2');
    params.append('StepName', '');
    params.append('DropDownName', '');

    const response = await apiCallService.post({
      service: 'App/webservice/AppStepList',
      body: params.toString(), // Send as string
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }) as AppStepListResponse;

    if (response.ERROR !== '0') {
      console.warn('AppStepList API Error:', response.MESSAGE);
      ToastAndroid.show(response.MESSAGE || 'Failed to fetch valuation steps', ToastAndroid.SHORT);
      return [];
    }

    return response.DataList || [];

  } catch (error: any) {
    console.error('AppStepList API Exception:', error);
    ToastAndroid.show('Something went wrong fetching steps', ToastAndroid.SHORT);
    return [];
  }
}

export const uploadValuationImageApi = async (
  base64String: string,
  paramName: string,
  leadId: string,
  vehicleTypeValue: string,
  geolocation: { lat: string; long: string; timeStamp: string }
): Promise<any> => {
  try {
    const params = {
      LeadId: leadId,
      Version: '2',
      [paramName]: base64String, // Dynamic key
      VehicleTypeValue: vehicleTypeValue,
      geolocation
    };

    // Note: This API expects JSON, unlike AppStepList which used FormUrlEncoded
    const response = await apiCallService.post({
      service: 'App/webservice/DocumentUploadOtherImageApp',
      body: params,
      headers: {
        'Version': '2' // Header version check
      }
    });

    if (response.ERROR && response.ERROR !== '0') {
      console.warn('Upload API Warning:', response.MESSAGE);
      //      ToastAndroid.show(response.MESSAGE || 'Upload failed', ToastAndroid.SHORT);
      // We don't return null here to avoid breaking Promise flows, but caller can check response
    }
    return response;

  } catch (error: any) {
    console.error('Upload API Exception:', error);
    ToastAndroid.show('Image upload failed', ToastAndroid.SHORT);
    throw error;
  }
};

export const submitLeadReportApi = async (payload: any): Promise<any> => {
  try {
    const response = await apiCallService.post({
      service: 'App/webservice/LeadReportDataCreateEdit',
      body: payload
    });

    if (response.ERROR && response.ERROR !== '0') {
      ToastAndroid.show(response.MESSAGE || 'Report submission failed', ToastAndroid.SHORT);
      return null;
    }
    return response;
  } catch (error: any) {
    console.error('Report API Exception:', error);
    ToastAndroid.show('Failed to submit info', ToastAndroid.SHORT);
    return null;
  }
};
