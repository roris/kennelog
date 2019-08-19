import { Hook, HookContext } from '@feathersjs/feathers';

const populateSire_ = async (pair, app) => {
  pair.sire = await app.service('dogs').get(pair.sireId);
  return pair;
};

export const populateSire = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const pairs = method === 'find' ? result.data : [result];

    const filtered = pairs.filter(pair => !!pair.sireId);
    await Promise.all(filtered.map(async pair => populateSire_(pair, app)));

    return context;
  };
};
