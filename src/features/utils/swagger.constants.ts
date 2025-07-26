export const responseErrorObjectExample = {
  errorsMessages: [
    {
      message: 'string',
      field: 'string',
    },
  ],
};

export const BadRequestResponseOptions = {
  description: 'Incorrect input data',
  content: {
    'application/json': { example: responseErrorObjectExample },
  },
};
