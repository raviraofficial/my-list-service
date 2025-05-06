export type AuthRequest = {
  user: {
    id: string;
  };
};

export class CommonResponseDto<T> {
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}
