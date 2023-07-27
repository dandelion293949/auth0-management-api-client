import { load } from "https://deno.land/std/dotenv/mod.ts";

import { z } from "npm:zod@^3.17.10";
import { parse } from "npm:zodiarg@0.2.1";

import { getAccessToken } from "./packages/auth.ts";
import { getUsers } from "./packages/users.ts";
import { getClients } from "./packages/clients.ts";
import { getBranding } from "./packages/branding.ts";

const env = await load();
const AUTH0_DOMAIN = env.AUTH0_DOMAIN;

const parsed = parse({
  options: {},
  flags: {},
  args: [
    z.literal('users'),
    z.literal('clients').optional(),
    z.literal('branding').optional(),
  ],
  alias: {},

}, Deno.args.slice(0));

type ParsedInput = typeof parsed;

main(parsed).catch((err) => {
  console.error(err);
  Deno.exit(1);
});

async function main(input: ParsedInput) {
  const requestScope = input.args.filter((arg) => !!arg).map((arg) => `read:${arg}`);
  const accessToken = await getAccessToken(requestScope);

  const result = {};
  if (input.args.includes('users')) {
    const users = await getUsers(`https://${AUTH0_DOMAIN}`, accessToken);
    result['users'] = users;
  }

  if (input.args.includes('clients')) {
    const clients = await getClients(`https://${AUTH0_DOMAIN}`, accessToken);
    result['clients'] = clients;
  }

  if (input.args.includes('branding')) {
    const branding = await getBranding(`https://${AUTH0_DOMAIN}`, accessToken);
    result['branding'] = branding;
  }
  console.log("Parsed input:", input);
  console.log("Result:", result);
}


