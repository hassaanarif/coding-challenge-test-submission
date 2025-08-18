import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  const MIN_POSTCODE_LENGTH = 4;

  if (postcode.length < MIN_POSTCODE_LENGTH) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  const isStrictlyNumeric = (value: string) => !isNaN(Number(value)) && Number(value) >= 0;

  if (!isStrictlyNumeric(postcode as string)) {
    return res.status(400).send({
      status: "error",
      errormessage: "Postcode must be all digits and non negative!",
    });
  }

  if (!isStrictlyNumeric(streetnumber as string)) {
    return res.status(400).send({
      status: "error",
      errormessage: "Street Number must be all digits and non negative!",
    });
  }

  const mockAddresses = generateMockAddresses(postcode as string, streetnumber as string);
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
