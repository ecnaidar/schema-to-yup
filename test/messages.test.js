const { buildYup } = require("../src");

let valid;
test("yup inserts custom messages for required fields", () => {
  const message = {
    title: "users",
    type: "object",
    required: ["username"],
    properties: {
      username: { type: "string", matches: "foo" },
    },
  };
  const config = {
    errMessages: {
      username: {
        required: "User is required",
        matches: "User must be foo",
      },
    },
  };
  try {
    const yupSchema = buildYup(message, config);
    valid = yupSchema.validateSync({
      foo: "dfds",
    });
  } catch (e) {
    console.log(e.errors);
    valid = e.errors[0];
  }
  expect(valid).toBe("User is required");
});
test("yup inserts custom messages for regex fields", () => {
  const message2 = {
    title: "users",
    type: "object",
    properties: {
      place: {
        type: "object",
        required: ["amazon"],
        properties: {
          amazon: { type: "string", pattern: /(foo|bar)/ },
        },
      },
    },
  };
  const config = {
    errMessages: {
      amazon: {
        pattern: "Pattern must be foo or bar",
      },
    },
  };
  try {
    const yupSchema = buildYup(message2, config);
    valid = yupSchema.validateSync({
      place: { amazon: "xyz" },
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("Pattern must be foo or bar");
});

test("yup uses custom error message function", () => {
  const message2 = {
    title: "users",
    type: "object",
    required: ["amazon"],
    properties: {
      amazon: { type: "string", pattern: /(foo|bar)/, title: "amazonas" },
    },
  };
  const config = {
    errMessages: {
      amazon: {
        pattern: (constraints, { title, parentNode }) => {
          return `Pattern must be ${constraints.pattern} for ${title}`;
        },
      },
    },
  };
  try {
    const yupSchema = buildYup(message2, config);
    valid = yupSchema.validateSync({
      amazon: "dfds",
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("Pattern must be /(foo|bar)/ for amazonas");
});

test("yup uses custom error message function", () => {
  const message2 = {
    title: "coffee",
    type: "object",
    properties: {
      place: {
        type: "object",
        required: ["amazon"],
        properties: {
          amazon: { type: "string", pattern: /(foo|bar)/, title: "amazonas" },
        },
      },
    },
  };
  const config = {
    errMessages: {
      amazon: {
        pattern: (constraints, { title, parentNode }) => {
          return `Pattern must be ${constraints.pattern} for ${title}`;
        },
      },
    },
  };
  try {
    const yupSchema = buildYup(message2, config);
    valid = yupSchema.validateSync({
      place: { amazon: "zyx" },
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("Pattern must be /(foo|bar)/ for amazonas");
});

test("yup uses custom error message for `typeError`", () => {
  const schema = {
    title: "users",
    type: "object",
    required: ["someNumber"],
    properties: {
      someNumber: { type: "number" },
    },
  };
  const invalidTypeMessage = "type is invalid";

  const config = {
    someNumber: {
      required: "is required",
      typeError: invalidTypeMessage,
    },
  };
  try {
    const yupSchema = buildYup(schema, config);
    valid = yupSchema.validateSync({
      someNumber: "asda",
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe(invalidTypeMessage);
});
