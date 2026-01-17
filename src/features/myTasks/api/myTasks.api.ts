import apiCallService from '../../../services/apiCallService';
import { MyTasksResponse } from '../types';
import { LEAD_LIST_STATUS_MAPPING } from '../../../constants';
export const fetchMyTasksApi = async (
  page?: number,
  pageSize?: number,
  vehicleType?: string
): Promise<MyTasksResponse> => {
  const body: any = {
    Version: '2',
    StatusId: LEAD_LIST_STATUS_MAPPING['AssignedLeads'], // 3
  };

  if (page !== undefined && pageSize !== undefined) {
    body.PageNumber = page.toString();
    body.PageSize = pageSize.toString();
  }

  if (vehicleType) {
    body.VehicleType = vehicleType;
  }

  const request = {
    service: '/App/webservice/LeadListStatuswise',
    body,
  };

  try {
    const response = await apiCallService.post(request);
    return response as MyTasksResponse;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch tasks');
  }
};
