export function isValidHttpURL(text: string) {
  let url: URL;
  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }
  return ["https:", "http:"].includes(url.protocol);
}
