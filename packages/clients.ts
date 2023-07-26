import type { token } from './index';

const getClients = async (domain: string, token: token): Promise<any> => {
  const url = `${domain}/api/v2/clients`;
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token.accessToken}`,
      redirect: 'follow',
    },
  };

  const json = await fetch(url, {
    ...options,
  }).then(async (response) => {
    return response.json();
  }).catch((error) => {
    console.log(error);
  });

  return json;
};

export { getClients };

