export type UserBase = {
  id: string;
  login: string;
  type: string;
  isAdmin: boolean;
  isBanned: boolean;
  payload: object;
};

export type UserWeb = UserBase & {
  type: 'web';
  payload: {
    privateKeys: {
      passwordHash: string;
    };
  } & Record<string, unknown>;
};

export type UserTelegram = UserBase & {
  type: 'telegram';
  payload: {
    telegramId: string;
  } & Record<string, unknown>;
};

export type User = UserWeb | UserTelegram;

export type Scenario = {
  id: string;
  description: string;
  isDeleted: boolean;
  payload: object;
};

export type DemandStatus = 'active' | 'closed';

export type Demand = {
  id: string;
  title: string;
  description: string;
  date: string;
  scenario: string;
  status: DemandStatus;
  payload: object;
};

export type ParticipantTypes = 'recipient' | 'donor' | 'declined_donor';

export type Participant = {
  demand: string;
  user: string;
  type: ParticipantTypes;
  payload: Record<string, unknown>;
};

export type Message = {
  id: string;
  date: number;
  demand: string;
  author: string;
  type: string;
  payload: Record<string, any>;
};

export type SearchRequest = {
  limit: number;
  offset: number;
};

export type WithSession = {
  session: string;
};

export type WithSessionUser = {
  sessionUser: string;
  isSessionUserIsAdmin: boolean;
};
