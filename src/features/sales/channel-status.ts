import { createServerFn } from '@tanstack/react-start';

/**
 * Nomes dos segredos que a integração com a Meta usa. Os valores ficam só no servidor
 * (Lovable → Cloud → Secrets); esta função devolve apenas se cada um está preenchido.
 */
export const CHANNEL_SECRETS = {
  whatsapp: ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN'],
  instagram: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_ACCOUNT_ID'],
} as const;

export type ChannelStatus = Record<keyof typeof CHANNEL_SECRETS, Record<string, boolean>>;

export const getChannelStatus = createServerFn({ method: 'GET' }).handler(async (): Promise<ChannelStatus> => {
  const has = (name: string) => Boolean(process.env[name]?.trim());
  return {
    whatsapp: Object.fromEntries(CHANNEL_SECRETS.whatsapp.map((n) => [n, has(n)])),
    instagram: Object.fromEntries(CHANNEL_SECRETS.instagram.map((n) => [n, has(n)])),
  };
});
