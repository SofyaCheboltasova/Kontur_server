export class UserLoginDto {
  /**
   * Электронная почта пользователя
   * @example admin1@gmail.com
   */
  login: string;
  /**
   * @example adminadmin
   */
  password: string;
}

interface ErroredResponse {
  error?: string;
  message: string;
  statusCode: number;
}

export class UnauthorizedResponseDto implements ErroredResponse {
  /**
   * @example Unauthorized
   */
  message: string;
  /**
   * @example 401
   */
  statusCode: number;
}

export class ForbiddenResponseDto implements ErroredResponse {
  /**
   * @example Forbidden
   */
  error: string;
  /**
   * @example Forbidden resource
   */
  message: string;
  /**
   * @example 403
   */
  statusCode: number;
}
