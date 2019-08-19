import { Hook, HookContext } from '@feathersjs/feathers';

const populateChildren_ = async (litter, app) => {
  const params = {
    query: {
      $joinRelation: 'litter',
      'litter.litterId': litter.id,
      $sort: {
        dateOfBirth: -1
      }
    }
  };

  const { data } = await app.service('dogs').find(params);
  litter.children = data;
  return litter;
};

export const populateChildren = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const litters = method === 'find' ? result.data : [result];

    await Promise.all(
      litters.map(async litter => populateChildren_(litter, app))
    );

    return context;
  };
};
