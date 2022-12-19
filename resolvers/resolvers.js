import module from "module";

const requireForJSON = module.createRequire(import.meta.url);
const animals = requireForJSON("../data/animals.json");

export const resolvers = {
  Query: {
    animals: () => animals,
    animal: (parent, args) =>
      animals.find((animal) => animal.title === args.title),
  },
};
