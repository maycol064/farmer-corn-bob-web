export type User = { id: string; email: string; name: string };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  refreshJti: string;
};

export type AuthPayload = { user: User; tokens: Tokens };
