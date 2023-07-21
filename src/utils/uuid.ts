export function matchUUID(str: string) {
  const res = str.match(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[8|9|aA|bB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}/)
  return res ? res[0] : '';
}