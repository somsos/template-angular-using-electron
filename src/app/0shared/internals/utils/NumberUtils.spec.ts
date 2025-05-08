import { input } from "@angular/core";
import { NumberUtils } from "./NumberUtils";

interface CleanStNumberTestCase {
  input: string,
  expected: string,

}

describe('NumberUtils', () => {
  const testCases: CleanStNumberTestCase[] = [
    //no move cases
    { input: "1", expected: "1" },
    { input: "2.2", expected: "2.2" },
    { input: "333.333", expected: "333.333" },
    { input: "44.44", expected: "44.44" },
    { input: "0", expected: "0" },
    { input: "0.0", expected: "0.0" },
    { input: "0.00", expected: "0.00" },
    { input: "00.00", expected: "00.00" },

  //dot cases
    //add zero cases
    { input: ".0", expected: "0.0" },
    { input: ".11", expected: "0.11" },
    { input: ".444444", expected: "0.444444" },

    //dot at the start
    { input: ".7.7", expected: "7.7" },
    { input: "..8.8", expected: "8.8" },
    { input: "....9.1", expected: "9.1" },
    { input: ",0", expected: "0.0" },

    //dot in the middle
    { input: "5....5", expected: "5.5" },
    { input: "6.6.", expected: "6.6" },
    { input: "9..9", expected: "9.9" },

    //dot at the end
    { input: "10.10.", expected: "10.10" },
    { input: "11.11..", expected: "11.11" },
    { input: "12.12......", expected: "12.12" },

  //comma cases
    { input: ",7,7", expected: "7.7" },
    { input: ",,8,8", expected: "8.8" },
    { input: ",,,9,1", expected: "9.1" },

    //dot in the middle
    { input: "5....5", expected: "5.5" },
    { input: "6.6.", expected: "6.6" },
    { input: "9..9", expected: "9.9" },

    //dot at the end
    { input: "10.10.", expected: "10.10" },
    { input: "11.11..", expected: "11.11" },
    { input: "12.12......", expected: "12.12" },

  //comma cases
    { input: "1,", expected: "1.0" },
    { input: "0,", expected: "0.0" },
    { input: "1376,", expected: "1376.0" },

    { input: ",7,7", expected: "7.7" },
    { input: ",,8,8", expected: "8.8" },
    { input: ",,,9,1", expected: "9.1" },

    //comma in the middle
    { input: "5,,,,5", expected: "5.5" },
    { input: "6,6,", expected: "6.6" },
    { input: "9,,9", expected: "9.9" },

    //comma at the end
    { input: "10,10,", expected: "10.10" },
    { input: "11,11,,", expected: "11.11" },
    { input: "12,12,,,,,,", expected: "12.12" },

  ];


  //beforeEach(async () => { })//end-beforeEach

  it('should work normally', () => {
    for (let i = 0; i < testCases.length; i++) {
      const input = testCases[i].input;
      const got = NumberUtils.cleanNumberString(input);
      const expected = testCases[i].expected;
      const stringsAreEquals = (got == expected);
      if(!stringsAreEquals) {
        console.log("input: ", input);
        console.log("got: ", got);
        console.log("expected: ", expected);
      }
      expect(stringsAreEquals).toBeTruthy();
    }


  })//end-it



})//end-describe
