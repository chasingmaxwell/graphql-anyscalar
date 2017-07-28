# graphql-anyscalar

graphql-anyscalar provides an AnyScalar GraphQL type. This type can be used to handle any GraphQL scalar type (except GraphQLID), resolving by examining the input value.

## Installation

`yarn add graphql-anyscalar`

## Usage

```javascript
const {
  AnyScalar,
} = require('graphql-anyscalar');
const {
  GraphQLObjectType,
} = require('graphql');

const someObject = new GraphQLObjectType({
  name: 'someObject',
  fields: {
    // Use AnyScalar like you would use some other scalar type like GraphQLString.
    someScalar: { type: AnyScalar }
  },
});
```
