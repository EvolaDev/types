import Abstract from './Abstract';

export interface ICompute {
    readonly properties: string[];
}

/**
 * A functor that holds data about properties on which calculation result is depends on.
 * @example
 * Let's define a functor which shows that function result is depends on 'amount' property:
 * <pre>
 *     import {functor} from 'Types/entity';
 *
 *     const getTax = functor.Compute.create(
 *         (totals, percent) => totals.amount * percent / 100,
 *         ['amount']
 *     );
 *
 *     const tax = getTax({
 *         count: 5,
 *         amount: 250
 *     }, 20);
 *     console.log(tax); // 50
 *     console.log(getTax.properties); // ['amount']
 * </pre>
 * @class Types/_entity/functor/Compute
 * @public
 * @author Мальцев А.А.
 */
export default class Compute<T> extends Abstract<T> implements ICompute {
   readonly properties: string[];

    /**
     * Creates the functor.
     * @param fn Function to call
     * @param properties Properties on which calculation result is depends on
     */
    static create<T = Function>(fn: T, properties?: string[]): T & ICompute {
        const result = Abstract.create.call(this, fn);

        properties = properties || [];
        if (!(properties instanceof Array)) {
            throw new TypeError('Argument "properties" should be an instance of Array');
        }

        Object.defineProperty(result, 'properties', {
            get(): string[] {
                return properties;
            }
        });

        return result;
    }
}
