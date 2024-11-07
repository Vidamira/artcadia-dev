import { json, type ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, { status: 405 });
  }

  return json({ message: "POST request received" }, { status: 200 });
};
