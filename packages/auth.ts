
export type token = {
  accessToken: string,
  expired: string
};

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-device-authorization-flow
const getDeviceCode = async (requestScope: string[]) => {
  const requiredScope = [ 'openid', 'profile', 'email' ];
  const deviceCodeEndpoint = `https://auth0.auth0.com/oauth/device/code`;

  const scope = [...requiredScope, ...requestScope];
  console.log(scope.join(' '));

  const res = await fetch(deviceCodeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: '2iZo3Uczt5LFHacKdM0zzgUO2eG2uDjT',
      scope: scope.join(' '),
      audience: `https://*.auth0.com/api/v2/`,
    }),
  });

  const json = await res.json();
  console.log(json);

  return json;
};

const getToken = async (device_code: string) => {
  const tokenEndpoint = 'https://auth0.auth0.com/oauth/token';
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      client_id: '2iZo3Uczt5LFHacKdM0zzgUO2eG2uDjT',
      device_code: device_code,
    })
  };

  const token = await fetch(tokenEndpoint, options).then(async (response) => {
    return await response.json();
  }).catch((error) => {
    console.log(error);
  });
  console.log(token);

  return {accessToken: token.access_token, expiresIn: token.expires_in};
}

const getAccessToken = async (requestScope: string[]) => {
  const kv = await Deno.openKv('kv.sqlite');

  const token = await kv.get<{accessToken:string, expiresIn:string}>(['auth0', 'token']);
  if (token.value) {
    // 有効期限のチェック
    // TODO
    return token.value?.accessToken;
  }

  const  { device_code, interval } = await getDeviceCode(requestScope);
  console.log('waiting...');
  await sleep(interval * 3000);

  await await sleep(1000);
  const { accessToken, expiresIn } = await getToken(device_code);
  kv.set(['auth0', 'token'], {accessToken, expiresIn});

  return accessToken;

}
export { getAccessToken };
