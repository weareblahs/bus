import ky from "ky";

export type Provider = { name: string; realtimeUrl: string; id: string };

export type Providers = Provider[];

export async function retrieveAvailableProviders(): Promise<Providers | []> {
  const baseUrl: string = window.location.origin;

  try {
    const availableProviders = await ky.get(`${baseUrl}/providers.json`);
    return availableProviders.json();
  } catch (e) {
    return [];
  }
}
