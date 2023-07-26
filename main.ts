import { load } from "https://deno.land/std/dotenv/mod.ts";

import { z } from "npm:zod@^3.17.10";
import { parse } from "npm:zodiarg@0.2.1";

import { getAccessToken } from "./packages/auth.ts";
import { getUsers } from "./packages/users.ts";

const env = await load();
const AUTH0_DOMAIN = env.AUTH0_DOMAIN;

const parsed = parse({
  options: {},
  flags: {},
  args: [
    z.string().nullable(),
  ],
  alias: {},

}, Deno.args.slice(0));

type ParsedInput = typeof parsed;

main(parsed).catch((err) => {
  console.error(err);
  Deno.exit(1);
});

async function main(input: ParsedInput) {
  const accessToken = await getAccessToken(['read:users']);
  console.log("Access token:", accessToken);
  if (input.args.includes('users')) {
    const users = await getUsers(`https://${AUTH0_DOMAIN}`, accessToken);
    console.log("Users:", users);
  };

  console.log("Parsed input:", input);
}


