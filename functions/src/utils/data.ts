import { BaseFirestoreRepository, IEntity, IWherePropParam } from "fireorm";

/**
 * @description
 * Maps data from one model to another.
 * @param data The data to be mapped.
 * @param model The model to map the data to.
 * @returns The mapped data.
 */
export const mapData = <A, B>(data: A, model: new () => B) => {
  const mappedData = new model();
  Object.keys(data as Record<string, unknown>).forEach((key) => {
    mappedData[key as keyof B] = (data as Record<string, unknown>)[key] as B[keyof B];
  });
  return mappedData;
}

/**
 * @description
 * Checks if the values of the given keys are unique.
 * @param keys The keys to check.
 * @param values The values to check.
 * @param entity The entity to check.
 * @returns Whether the values of the given keys are unique.
 */
export const uniqueRepositoryValues = async <T extends IEntity>(keys: IWherePropParam<T>[], values: string[], entity: BaseFirestoreRepository<T>): Promise<boolean> => {
  const promises = keys.map((key) => entity.whereEqualTo(key, values[keys.indexOf(key)]).find());
  return Promise.all(promises).then((results) => {
    const uniqueValues = results.map((result) => result.length === 0);
    return uniqueValues.every((value) => value);
  });
}

/**
 * @description
 * Filters the values of the given keys.
 * @param keys The keys to check.
 * @param values The values to check.
 * @param entity The entity to check.
 * @returns Whether the values of the given keys are unique.
 */
export const filterWhereEqualRepositoryValues = async <T extends IEntity>(keys: IWherePropParam<T>[], values: string[], entity: BaseFirestoreRepository<T>): Promise<boolean> => {
  const promises = keys.map((key) => entity.whereEqualTo(key, values[keys.indexOf(key)]).find());
  return Promise.all(promises).then((results) => {
    const uniqueValues = results.map((result) => result.length === 0);
    return uniqueValues.every((value) => value);
  });
}
