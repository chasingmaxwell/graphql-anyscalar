jest.mock('graphql');
const graphql = require('graphql');

['GraphQLString', 'GraphQLBoolean', 'GraphQLInt', 'GraphQLFloat'].forEach((type) => {
  ['serialize', 'parseValue', 'parseLiteral'].forEach((method) => {
    graphql[type][method] = jest.fn(() => 'the return');
  });
});

graphql.Kind = {
  INT: 'INT',
  FLOAT: 'FLOAT',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  OBJECT: 'OBJECT',
};

const {
  AnyScalar,
} = require('../lib');
const _ = require('lodash');

describe('The AnyScalar type', () => {
  const config = graphql.GraphQLScalarType.mock.calls[0][0];

  test('Is an instance of GraphQLScalarType', () => {
    expect.assertions(1);
    expect(AnyScalar).toBeInstanceOf(graphql.GraphQLScalarType);
  });

  test('Passes config to GraphQLScalarType', () => {
    expect.assertions(4);
    expect(_.pick(config, ['name', 'description'])).toEqual({
      name: 'AnyScalar',
      description:
        'The `AnyScalar` type allows any scalar value by examining the input and ' +
        'passing the serialize, parseValue, and parseLiteral operations to their ' +
        'respective types.',
    });
    ['serialize', 'parseValue', 'parseLiteral'].forEach((method) => {
      expect(typeof config[method]).toBe('function');
    });
  });

  [
    { kind: 'INT', value: 42, expectedType: 'GraphQLInt' },
    { kind: 'STRING', value: 'some string', expectedType: 'GraphQLString' },
    { kind: 'FLOAT', value: 4.2, expectedType: 'GraphQLFloat' },
    { kind: 'BOOLEAN', value: false, expectedType: 'GraphQLBoolean' },
  ].forEach(({ kind, value, expectedType }) => {
    test(`Passes operations on ${value} to ${expectedType}'s serialize method`, () => {
      expect.assertions(2);
      expect(config.serialize(value)).toBe('the return');
      expect(graphql[expectedType].serialize).toHaveBeenCalledWith(value);
    });

    test(`Passes operations on ${value} to ${expectedType}'s parseValue method`, () => {
      expect.assertions(2);
      expect(config.parseValue(value)).toBe('the return');
      expect(graphql[expectedType].parseValue).toHaveBeenCalledWith(value);
    });

    test(`Passes operations on ${value} to ${expectedType}'s parseLiteral method`, () => {
      expect.assertions(2);
      expect(config.parseLiteral({ kind, value })).toBe('the return');
      expect(graphql[expectedType].parseLiteral).toHaveBeenCalledWith({ kind, value });
    });
  });

  test('Unsupported kinds in parseLiteral return null', () => {
    expect.assertions(1);
    expect(config.parseLiteral({ kind: 'OBJECT', value: { iAm: 'an object' } })).toBeNull();
  });

  test('Throws an error when an unsupported type is requested', () => {
    expect.assertions(3);
    const valMap = {
      undefined,
      function: () => {},
      object: {},
    };
    Object.keys(valMap).forEach((type) => {
      expect(() => config.serialize(valMap[type])).toThrow(`"${type}" is not a supported scalar type.`);
    });
  });
});
