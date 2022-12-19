import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Animal {
    id: ID!
    title: String!
    description: String!
    image: String!
  }

  type Query {
    animals: [Animal!]!
    animal(title: String!): Animal
  }
`;
