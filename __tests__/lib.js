jest.mock('graphql');
const graphql = require('graphql');

['GraphQLString', 'GraphQLBoolean', 'GraphQLInt', 'GraphQLFloat'].forEach((type) => {
  ['serialize', 'parseValue', 'parseLiteral'].forEach((method) => {
    graphql[type][method] = jest.fn(() => 'the return');
  });
});

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

  const values = new Map();
  values.set('string', 'GraphQLString');
  values.set(false, 'GraphQLBoolean');
  values.set(42, 'GraphQLInt');
  values.set(4.2, 'GraphQLFloat');
  values.forEach((type, val) => {
    test(`Passes operations on ${val} to ${type}'s serialize method`, () => {
      expect.assertions(2);
      expect(config.serialize(val)).toBe('the return');
      expect(graphql[type].serialize).toHaveBeenCalledWith(val);
    });

    test(`Passes operations on ${val} to ${type}'s parseValue method`, () => {
      expect.assertions(2);
      expect(config.parseValue(val)).toBe('the return');
      expect(graphql[type].parseValue).toHaveBeenCalledWith(val);
    });

    test(`Passes operations on ${val} to ${type}'s parseLiteral method`, () => {
      expect.assertions(2);
      expect(config.parseLiteral(val)).toBe('the return');
      expect(graphql[type].parseLiteral).toHaveBeenCalledWith(val);
    });
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
