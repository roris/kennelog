import { Hook, HookContext } from '@feathersjs/feathers';

const populateMeasure_ = async (measure, app) => {
  const measure_ = measure;
  measure_.measure = await app.service('measures').get(measure_.id);
  return measure_;
};

export const populateMeasure = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const measures = method === 'find' ? result.data : [result];
    await Promise.all(measures.map(measure => populateMeasure_(measure, app)));
    return context;
  };
};
