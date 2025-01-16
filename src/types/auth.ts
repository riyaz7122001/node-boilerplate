export type LoginPayload = {
  userId: string;
  email: string;
  roleId: number;
  passwordHash?: string | null;
  passwordSetOn?: Date;
  is2faEnabled?: boolean;
};

export type ResetPasswordPayload = {
  userId: string;
};

export type ProtectedPayload = {
  userId: string;
  email: string;
  passwordHash?: string | null;
};
