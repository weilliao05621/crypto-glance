/**
 * @example handleFloatNumber("139.1") > '139.10'
 * @example handleFloatNumber("139.100") > '139.10'
 * @example handleFloatNumber("0.100") > '0.10'
 * @example handleFloatNumber("1110.12",4) > '1110.1200'
 */
export const handleNumberToFloat = (num: string, digital: number = 2) => {
  const int = parseInt(num);
  const frag = num.split(".")[1];
  const hasFrag = !!frag;

  const digs = hasFrag
    ? frag.length < digital
      ? frag.padEnd(digital, "0")
      : frag.slice(0, digital)
    : "".padEnd(digital, "0");

  return `${int}.${digs}`;
};
