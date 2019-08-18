import { Hook, HookContext } from '@feathersjs/feathers';
import titleCase from 'title-case';

export const nameToTitleCase = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { method, result } = context;
    const things = method === 'find' ? result.data : [result];

    things
      .filter(thing => typeof thing.name !== 'undefined') // filter all named things
      .forEach(thing => (thing.name = titleCase(thing.name))); // convert names to title case

    return context;
  };
};
