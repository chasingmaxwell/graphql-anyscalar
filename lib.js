const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
  Kind,
} = require('graphql');

const getScalarType = (val) => {
  const type = typeof val;
  const types = {
    string: () => GraphQLString,
    boolean: () => GraphQLBoolean,
    number: _val => (Number.isInteger(_val) ? GraphQLInt : GraphQLFloat),
  };

  if (typeof types[type] !== 'function') {
    throw new Error(`"${type}" is not a supported scalar type.`);
  }

  return types[type](val);
};

const AnyScalar = new GraphQLScalarType({
  name: 'AnyScalar',
  description:
    'The `AnyScalar` type allows any scalar value by examining the input and ' +
    'passing the serialize, parseValue, and parseLiteral operations to their ' +
    'respective types.',
  serialize: val => getScalarType(val).serialize(val),
  parseValue: val => getScalarType(val).parseValue(val),
  parseLiteral: (ast) => {
    const type = {
      [Kind.INT]: GraphQLInt,
      [Kind.FLOAT]: GraphQLFloat,
      [Kind.STRING]: GraphQLString,
      [Kind.BOOLEAN]: GraphQLBoolean,
    }[ast.kind];
    return type ? type.parseLiteral(ast) : null;
  },
});

module.exports = { AnyScalar };
