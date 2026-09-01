export class ServiceError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export const NOT_FOUND = (msg: string) => new ServiceError(404, msg);
export const BAD_REQUEST = (msg: string) => new ServiceError(400, msg);
export const CONFLICT = (msg: string) => new ServiceError(409, msg);
export const FORBIDDEN = (msg: string) => new ServiceError(403, msg);
export const INTERNAL_ERROR = (msg: string) => new ServiceError(500, msg);
