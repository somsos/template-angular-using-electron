
export abstract class NumberUtils {

  // "1.1", "12345.09876", "12345."
  private static isANumberMaybeDecimal = /[0-9]{1,}[\.]{0,1}[0-9]{0,}/g;

  //point cases ej.: "0.", "12345.",  comma cases ej.: "0,", "6789,"
  private static decimalIncompleteToTheLeft = /^[0-9]{1,}[\.,]$/;

  //point cases ej.: ".0", ".54321", comma cases ej.: ",5", ",98765"
  private static decimalIncompleteToTheRight = /^[\.,]{1}[0-9]{1,}$/;

  private static isIntroducingADecimalThatEndsInCero = /^[0-9]{0,}[\.\,]{1}[0-9]{0,}[0]{1}$/

  public static cleanNumberString(input: string | number): string {
    input = NumberUtils._normalizeNumberString(input);
    const matches = input.match(NumberUtils.isANumberMaybeDecimal);
    if(matches == null) {
      return "";
    }
    let cleaned = NumberUtils._concatenateStringArray(matches);
    if(NumberUtils.userIsStillIntroducing(cleaned)) {
      cleaned = cleaned + "0";
    }
    return cleaned;
  }

  public static toNumber(toCast: string): number {
    let valueNum = Number(toCast);
    if (isNaN(valueNum) || typeof valueNum !== 'number') {
      throw new Error("'" + toCast +  "' couldn't be transformed to number");
    }
    return valueNum;
  }

  public static userIsStillIntroducing(input: string): boolean {
    if(input == "." || input == ",") {
      return true;
    }

    if( input.match(NumberUtils.decimalIncompleteToTheLeft) ) {
      return true;
    }

    if( input.match(NumberUtils.decimalIncompleteToTheRight) ) {
      return true;
    }

    if( input.match(NumberUtils.isIntroducingADecimalThatEndsInCero) ) {
      return true;
    }

    return false;
  }

  public static completeInputIfIsIncomplete(input: string): string {
    input = NumberUtils._normalizeNumberString(input);

    if(input == "." || input == ",") {
      return "0.0";
    }

    if(input.match(NumberUtils.decimalIncompleteToTheLeft)) {
      return input + "0";
    }

    if(input.match(NumberUtils.decimalIncompleteToTheRight)) {
      return "0" + input;
    }

    return input;
  }

  private static _concatenateStringArray(matches: RegExpMatchArray): string {
    let concatenated = "";
    for (let i = 0; i < matches.length; i++) {
      concatenated = concatenated + matches[i]
    }
    return concatenated;
  }

  private static _normalizeNumberString(input: string | number): string {
    if(input == null) {
      return "";
    }

    if(typeof input == "number") {
      input = input + "";
    }

    if(input.includes(",")) {
      input = input.replaceAll(",", ".");
    }

    return input;
  }

}
