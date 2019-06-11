import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export const contextMock = (): Context => ({
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: 512,
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  identity: undefined,
  clientContext: undefined,
  getRemainingTimeInMillis: () => 0,
  done: () => {},
  fail: () => {},
  succeed: () => {},
});

export const apiGatewayContext = (): APIGatewayEventRequestContext => ({
  accountId: '',
  apiId: '',
  authorizer: null,
  connectedAt: undefined,
  connectionId: undefined,
  domainName: undefined,
  eventType: undefined,
  extendedRequestId: undefined,
  httpMethod: '',
  identity: {
    accessKey: '',
    accountId: '',
    apiKey: '',
    apiKeyId: '',
    caller: '',
    cognitoAuthenticationProvider: '',
    cognitoAuthenticationType: '',
    cognitoIdentityId: '',
    cognitoIdentityPoolId: '',
    sourceIp: '',
    user: '',
    userAgent: '',
    userArn: '',
  },
  messageDirection: undefined,
  messageId: null,
  path: '',
  stage: '',
  requestId: '',
  requestTime: undefined,
  requestTimeEpoch: 0,
  resourceId: '',
  resourcePath: '',
  routeKey: undefined,
});

export const apiGatewayEventMock = (): APIGatewayProxyEvent => ({
  body: '',
  httpMethod: 'GET',
  headers: {},
  queryStringParameters: {},
  multiValueHeaders: {},
  isBase64Encoded: false,
  path: '',
  pathParameters: {},
  multiValueQueryStringParameters: {},
  stageVariables: {},
  requestContext: apiGatewayContext(),
  resource: '',
});

// tslint:disable:no-any
export const apiGatewayProxyResultMock = (
  body?: any,
  headers?: any,
  statusCode = 200
): APIGatewayProxyResult => ({
  statusCode,
  body: body ? JSON.stringify(body) : '',
  headers: headers || undefined,
});

export const login = async (
  // tslint:disable:no-any
  server: any,
  email: string,
  password: string
): Promise<{ accessToken: string; accountId: string; idToken: string }> => {
  const base64Password = Buffer.from(`${email}:${password}`).toString('base64');
  const { id_token, access_token } = (await server
    .post('/auth/login')
    .set('Authorization', `Basic ${base64Password}`)).body;
  const accountId = JSON.parse(
    Buffer.from(id_token.split('.')[1], 'base64').toString('ascii')
  ).aud;

  return { accountId, accessToken: access_token, idToken: id_token };
};

export const logout = async (server: any, token: string): Promise<void> => {
  return server.delete('/auth/logout').set('Authorization', `Bearer ${token}`);
};
