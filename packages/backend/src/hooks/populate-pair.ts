import { Hook, HookContext } from '@feathersjs/feathers';

const populatePair_ = async (thing, app) => {
  thing.pair = await app.service('pairs').get(thing.pairId);
  return thing;
};

export const populatePair = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const things = method === 'find' ? result.data : [result];

    const filtered = things.filter(thing => !!thing.pairId);
    await Promise.all(filtered.map(async thing => populatePair_(thing, app)));

    return context;
  };
};
