import { API } from "./constants";

export async function makeRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  responseType: "json" | "blob" = "json",
): Promise<T | null> {
  try {
    const url = API + path;

    const response = await fetch(url, {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok)
      throw new Error(`Http Error: ${response.status} ${response.statusText}`);

    // responses with no body
    if (response.status === 204 || response.status === 205)
      return undefined as T;

    if (responseType === "blob") return (await response.blob()) as T;

    return (await response.json()) as T;
  } catch (e: unknown) {
    console.log(e);
    const msg = e instanceof Error ? e.message : String(e);
    alert(msg);
    return null;
  }
}
