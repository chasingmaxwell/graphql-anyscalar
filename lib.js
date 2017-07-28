const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
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
  parseLiteral: val => getScalarType(val).parseLiteral(val),
});

module.exports = { AnyScalar };
