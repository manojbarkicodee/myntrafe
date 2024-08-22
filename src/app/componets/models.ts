export interface Authmodel {
  email: string;
  password: string;
}

export interface Loginresponse {
  message: string;
  statusCode: number;
  token?: string;
  status?: string;
}

export interface error {
  error: string;
  message: string;
  stausCode: number;
}

export interface response {
  message: string;
  status: string;
  statusCode: number;
}
