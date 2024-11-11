export const bigintToString = (no_register: bigint): string => {
  return no_register.toString().padStart(12, '0');
};
