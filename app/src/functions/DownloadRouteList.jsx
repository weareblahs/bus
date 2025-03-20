import ky from "ky";

export const downloadRoutes = async (provider) => {
  const response = await ky.get(
    `${window.location.protocol}//${window.location.host}/data/${provider}.json`
  );
  const data = await response.json();
  return data;
};
