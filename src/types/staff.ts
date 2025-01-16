export type Allows = {
  id?: number;
  module: string;
  viewAccess: boolean;
  addAccess: boolean;
  editAccess: boolean;
  deleteAccess: boolean;
  activeDeactiveAccess: boolean;
};

export type CreateStaffUserPayload = {
  allow: Allows[];
};
