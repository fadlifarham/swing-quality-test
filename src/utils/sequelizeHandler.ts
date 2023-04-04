export const catchMigrationError = (error: any): void => {
  const listCodes = [
    {
      code: 42701,
      msg: "-----WARNING: Column already Exist-----"
    },
    {
      code: 42703,
      msg: "-----WARNING: Column already Removed-----"
    },
  ];

  const errCode = parseInt(error.original.code);
  const err = listCodes.find(x => x.code == errCode);

  if (err) {
    console.log(err.msg);
  } else {
    throw error;
  }
};
