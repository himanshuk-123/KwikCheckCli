export interface LeadListStatuswiseRespDataRecord {
  Id: string;
  LeadUId: string;
  RegNo: string;
  Vehicle: string;
  ChassisNo: string;
  CustomerName: string;
  companyname: string;
  cityname: string;
  YardName: string;
  RetailFeesAmount: string;
  RepoFeesAmount: string;
  EngineNo: string;
  VehicleType: string | number; // API can return string "1" or number 1
  CustomerMobileNo: string;
  LeadTypeName: string;
  RetailBillType: string;
  RepoBillType: string;
  CandoBillType: string;
  AssetBillType: string;
  VehicleTypeValue?: string | number;
  [key: string]: any;
}

export interface MyTasksResponse {
  Error: string; // "0" means success
  MESSAGE: string;
  DataRecord?: LeadListStatuswiseRespDataRecord[];
}
