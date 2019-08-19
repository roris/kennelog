import { Hook, HookContext } from '@feathersjs/feathers';

const populateDame_ = async (pair, app) => {
  pair.dame = await app.service('dogs').get(pair.dameId);
  return pair;
};

export const populateDame = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const pairs = method === 'find' ? result.data : [result];

    const filtered = pairs.filter(pair => !!pair.dameId);
    await Promise.all(filtered.map(async pair => populateDame_(pair, app)));

    return context;
  };
};
