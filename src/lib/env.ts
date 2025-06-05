export function getEnvVar(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getPlaylabApiKey(): string {
  return getEnvVar('PLAYLAB_API_KEY');
}
