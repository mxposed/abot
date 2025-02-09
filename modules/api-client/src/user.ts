import { ApiContractUser, UserGetRequest, UserGetResponse } from '@abot/api-contract/target/user';
import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';
import { TelegramUserGetRequest, TelegramUserSignUpRequest, UserWithActiveDemands } from '@abot/api-contract/target/user/telegram';

import APIClient from '.';

export default class APIClientUser implements ApiContractUser {
  constructor(public apiClient: APIClient) {}

  password = {
    signUp: (request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
      return this.apiClient.execute('user.password.signUp', request);
    },

    signIn: (request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
      return this.apiClient.execute('user.password.signIn', request);
    },
  };

  telegram = {
    get: (request: TelegramUserGetRequest): Promise<UserWithActiveDemands> => {
      return this.apiClient.execute('user.telegram.get', request);
    },

    signUp: (request: TelegramUserSignUpRequest): Promise<UserGetResponse> => {
      return this.apiClient.execute('user.telegram.signUp', request);
    },
  };

  get(request: UserGetRequest): Promise<UserGetResponse> {
    return this.apiClient.execute('user.get', request);
  }
}
