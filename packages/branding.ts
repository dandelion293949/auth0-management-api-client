const getBranding = async (domain: string, token: string): Promise<any> => {
  const url = `${domain}/api/v2/branding`;
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
      redirect: 'follow',
    },
  };

  const json = await fetch(url, {
    ...options,
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log(error);
  });

  return json;
};

export { getBranding };

