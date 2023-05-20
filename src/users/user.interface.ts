import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CardRequisitesDTO } from './card-requisites.interface';

export interface User {
  _id?: string;
  login: string;
  password: string;
  cardRequisites?: CardRequisitesDTO;
}
export type UserResponse = Omit<User, 'password'>;
export type UserUpdateRequest = Partial<Omit<User, '_id'>>;

export class UserDTO implements User {
  _id?: string;
  /**
   * @example someemail@gmail.com
   */
  login: string;
  /**
   * @example qwerty123
   */
  password: string;
  @ApiProperty({ type: CardRequisitesDTO })
  cardRequisites?: CardRequisitesDTO;
}
export class UserResponseDTO
  extends OmitType(UserDTO, ['password'] as const)
  implements UserResponse {}
export class UserUpdateRequestDTO
  extends PartialType(OmitType(UserDTO, ['_id'] as const))
  implements UserUpdateRequest {}
