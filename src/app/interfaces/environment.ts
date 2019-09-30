export interface Environment {
  name: 'production' | 'staging' | 'local';
  development: boolean;
  api: {
    v1: string;
    zero: string;
  };
  paymentPublicId: string;
}
