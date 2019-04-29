import {ICloneable, OptionsToPropertyMixin} from '../entity';

declare type Where = Object | ((item: any, index: number) => boolean);
declare type Expression = Object | string[] | string;

export enum ExpandMode {
   None,
   Nodes,
   Leaves,
   All
}

export enum NavigationType {
   Page = 'Page',
   Offset = 'Offset',
   Position = 'Position'
}

export interface IMeta {
   expand?: ExpandMode;
   navigationType?: NavigationType;
}

/**
 * Clones object
 * @param data Object to clone
 */
function duplicate(data: any): object {
   if (data['[Types/_entity/ICloneable]']) {
      return data.clone();
   }
   if (data && typeof data === 'object') {
      return {...data};
   }
   return data;
}

/**
 * Parses expression from fields set
 * @param expression Expression with fields set
 */
function parseSelectExpression(expression: Expression): object {
   if (typeof expression === 'string') {
      expression = expression.split(/[ ,]/);
   }

   if (expression instanceof Array) {
      const orig = expression;
      expression = {};
      for (let i = 0; i < orig.length; i++) {
         expression[orig[i]] = orig[i];
      }
   }

   if (typeof expression !== 'object') {
      throw new TypeError('Invalid argument "expression"');
   }

   return expression;
}

/**
 * Объект, задающий способ объединения множеств.
 * @class Types/_source/Query/Join
 * @mixes Types/_entity/OptionsMixin
 * @public
 */
export class Join extends OptionsToPropertyMixin {
   /**
    * @cfg {String} Правое множество
    * @name Types/_source/Query/Join#resource
    */
   protected _$resource: string = '';

   /**
    * @cfg {String} Синоним правого множества
    * @name Types/_source/Query/Join#as
    */
   protected _$as: string = '';

   /**
    * @cfg {Object} Правило объединения
    * @name Types/_source/_source/Query/Join#on
    */
   protected _$on: object = {};

   /**
    * @cfg {Object} Выбираемые поля
    * @name Types/_source/Query/Join#select
    */
   protected _$select: object = {};

   /**
    * @cfg {Boolean} Внутреннее объединение
    * @name Types/_source/Query/Join#inner
    */
   protected _$inner: boolean = true;

   constructor(options?: object) {
      super();
      OptionsToPropertyMixin.call(this, options);
   }

   /**
    * Возвращает правое множество
    */
   getResource(): string {
      return this._$resource;
   }

   /**
    * Возвращает синоним правого множества
    */
   getAs(): string {
      return this._$as;
   }

   /**
    * Возвращает правило объединения
    */
   getOn(): object {
      return this._$on;
   }

   /**
    * Возвращает выбираемые поля
    */
   getSelect(): object {
      return this._$select;
   }

   /**
    * Это внутреннее объединение
    */
   isInner(): boolean {
      return this._$inner;
   }
}

/**
 * Объект, задающий способ сортировки множества
 * @class Types/_source/Query/Order
 * @mixes Types/_entity/OptionsMixin
 * @public
 */
export class Order extends OptionsToPropertyMixin {
   /**
    * @typedef {Boolean} Order
    * @variant false По возрастанию
    * @variant true По убыванию
    */

   /**
    * @cfg {String} Объект сортировки
    * @name Types/_source/Query/Order#selector
    */
   protected _$selector: string = '';

   /**
    * @cfg {Order} Порядок сортировки
    * @name Types/_source/Query/Order#order
    */
   protected _$order: boolean | string = false;

   constructor(options?: object) {
      super();
      OptionsToPropertyMixin.call(this, options);

      let order = this._$order;
      if (typeof order === 'string') {
         order = order.toUpperCase();
      }
      switch (order) {
         case Order.SORT_DESC:
         case Order.SORT_DESC_STR:
            this._$order = Order.SORT_DESC;
            break;
         default:
            this._$order = Order.SORT_ASC;
      }
   }

   /**
    * Возвращает Объект сортировки
    */
   getSelector(): string {
      return this._$selector;
   }

   /**
    * Возвращает порядок сортировки
    */
   getOrder(): boolean | string {
      return this._$order;
   }

   // region Static

   /**
    * Сортировка по возрастанию
    */
   static get SORT_ASC(): boolean {
      return false;
   }

   /**
    * Сортировка по убыванию
    */
   static get SORT_DESC(): boolean {
      return true;
   }

   /**
    * Сортировка по возрастанию (для строки)
    */
   static get SORT_ASC_STR(): string {
      return 'ASC';
   }

   /**
    * Сортировка по убыванию (для строки)
    */
   static get SORT_DESC_STR(): string {
      return 'DESC';
   }

   // endregion
}

/**
 * Запрос на выборку.
 * @remark
 * Выберем 100 заказов за последние сутки и отсортируем их по возрастанию номера:
 * <pre>
 *    require(['Types/source'], function (source) {
 *       var query = new source.Query(),
 *          date = new Date();
 *
 *       date.setDate(date.getDate() - 1);
 *
 *       query
 *          .select(['id', 'date', 'customerId'])
 *          .from('Orders')
 *          .where(function(order) {
 *             return order.date - date >= 0;
 *          })
 *          .orderBy('id')
 *          .limit(100);
 *    });
 * </pre>
 * @class Types/_source/Query
 * @implements Types/_entity/ICloneable
 * @mixes Types/_entity/OptionsMixin
 * @public
 * @author Мальцев А.А.
 */
export default class Query extends OptionsToPropertyMixin implements ICloneable {
   /**
    * Выбираемые поля
    */
   protected _select: object = {};

   /**
    * Объект выборки
    */
   protected _from: string = '';

   /**
    * Псеводним объекта выборки
    */
   protected _as: string = '';

   /**
    * Объединения с другими выборками
    */
   protected _join: Join[] = [];

   /**
    * Способ фильтрации
    */
   protected _where: Where = {};

   /**
    * Способ группировки
    */
   protected _groupBy: string[] = [];

   /**
    * Способы сортировки
    */
   protected _orderBy: Order[] = [];

   /**
    * Смещение
    */
   protected _offset: number = 0;

   /**
    * Максимальное кол-во записей
    */
   protected _limit: number = undefined;

   /**
    * Мета-данные запроса
    */
   protected _meta: IMeta = {};

   constructor(options?: object) {
      super();
      OptionsToPropertyMixin.call(this, options);
   }

   // region ICloneable

   readonly '[Types/_entity/ICloneable]': boolean;

   clone<T = this>(): T {
      // TODO: deeper clone?
      const clone = new Query();
      clone._select = duplicate(this._select);
      clone._from = this._from;
      clone._as = this._as;
      clone._join = this._join.slice();
      clone._where = duplicate(this._where);
      clone._groupBy = this._groupBy.slice();
      clone._orderBy = this._orderBy.slice();
      clone._offset = this._offset;
      clone._limit = this._limit;
      clone._meta = duplicate(this._meta);

      return clone as any;
   }

   // endregion

   // region Public methods

   /**
    * Сбрасывает все параметры запроса
    */
   clear(): this {
      this._select = {};
      this._from = '';
      this._as = '';
      this._join = [];
      this._where = {};
      this._groupBy = [];
      this._orderBy = [];
      this._offset = 0;
      this._limit = undefined;
      this._meta = {};

      return this;
   }

   /**
    * Возвращает поля выборки
    * @example
    * Получим поля выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select(['id', 'date']);
    *       console.log(query.getSelect());//{id: 'id', date: 'date'}
    *    });
    * </pre>
    */
   getSelect(): object {
      return this._select;
   }

   /**
    * Устанавливает поля выборки
    * @param {Array.<String>|Object.<String>|String} expression Выбираемые поля
    * @example
    * Выбираем все заказы с определенным набором полей:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select(['id', 'date', 'customerId' ])
    *          .from('Orders');
    *    });
    * </pre>
    * Выбираем все заказы со всеми полями:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders');
    *    });
    * </pre>
    */
   select(expression: Expression): this {
      this._select = parseSelectExpression(expression);

      return this;
   }

   /**
    * Возвращает объект выборки
    * @example
    * Получим объект выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select(['id', 'date'])
    *          .from('Orders');
    *       console.log(query.getFrom());//'Orders'
    *    });
    * </pre>
    */
   getFrom(): string {
      return this._from;
   }

   /**
    * Возвращает псеводним выборки
    * @example
    * Получим псеводним выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select(['id', 'date'])
    *          .from('Orders', 'o');
    *       console.log(query.getAs());//'o'
    *    });
    * </pre>
    */
   getAs(): string {
      return this._as;
   }

   /**
    * Устанавливает объект выборки
    * @param {String} resource Объект выборки
    * @param {String} [as] Псеводним объекта выборки
    * @example
    * Выбираем заказы с указанием полей через псеводним:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select(['o.id', 'o.date', 'o.customerId'])
    *          .from('Orders', 'o');
    *    });
    * </pre>
    */
   from(resource: string, as?: string): this {
      this._from = resource;
      this._as = as;

      return this;
   }

   /**
    * Возвращает способы объединения
    * @example
    * Получим способ объединения c объектом Customers:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .join(
    *             'Customers',
    *             {id: 'customerId'},
    *             ['name', 'email']
    *          );
    *
    *       var join = query.getJoin()[0];
    *       console.log(join.getResource());//'Customers'
    *       console.log(join.getSelect());//{name: 'name', email: 'email'}
    *    });
    * </pre>
    */
   getJoin(): Join[] {
      return this._join;
   }

   /**
    * Устанавливает объединение выборки с другой выборкой
    * @param {String|Array} resource Объект выборки для объединения и его псеводним
    * @param {Object} on Правило объединения
    * @param {Object|Array|String} expression Выбираемые поля
    * @param {Boolean} [inner=true] Внутреннее или внешнее объединение
    * @example
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .join(
    *             'Customers',
    *             {id: 'customerId'},
    *             '*'
    *          );
    *
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .join(
    *             'Customers',
    *             {id: 'customerId'},
    *             {customerName: 'name', customerEmail: 'email'}
    *          );
    *    });
    * </pre>
    */
   join(resource: string | string[], on: any, expression: Expression, inner?: boolean): this {
      if (typeof resource === 'string') {
         resource = resource.split(' ');
      }

      if (!(resource instanceof Array)) {
         throw new Error('Invalid argument "resource"');
      }

      this._join.push(new Join({
         resource: resource.shift(),
         as: resource.shift() || '',
         on,
         select: parseSelectExpression(expression),
         inner: inner === undefined ? true : inner
      }));

      return this;
   }

   /**
    * Возвращает способ фильтрации
    * @example
    * Получим способ фильтрации выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .where({host: 'my.store.com'});
    *
    *       console.log(query.getWhere());//{'host': 'my.store.com'}
    *    });
    * </pre>
    */
   getWhere(): Where {
      return this._where;
   }

   /**
    * Устанавливает фильтр выборки.
    * @remark
    * Если expression передан в виде функции, то она принимает аргументы: элемент коллекции и его порядковый номер.
    * @param {Object.<String>|Function(*, Number): Boolean} expression Условие фильтрации
    * @example
    * Выберем рейсы, приземлившиеся в аэропорту "Шереметьево", прибывшие из Нью-Йорка или Лос-Анджелеса:
    * <pre>
    *    var query = new Query()
    *       .select('*')
    *       .from('AirportsSchedule')
    *       .where({
    *          iata: 'SVO',
    *          direction: 'Arrivals',
    *          state: 'Landed',
    *          fromCity: ['New York', 'Los Angeles']
    *       });
    * </pre>
    * Выберем все заказы с номером больше 10, сделанные до текущего момента:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .where(function(order) {
    *             return order.id > 10 && Number(order.date) < Date.now();
    *          });
    *    });
    * </pre>
    */
   where(expression: Where): this {
      expression = expression || {};
      const type = typeof expression;
      if (type !== 'object' && type !== 'function') {
         throw new TypeError('Invalid argument "expression"');
      }

      this._where = expression;

      return this;
   }

   /**
    * Возвращает способы сортировки
    * @example
    * Получим способы сортировки выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .orderBy('id');
    *
    *       var order = query.getOrderBy()[0];
    *       console.log(order.getSelector());//'id'
    *       console.log(order.getOrder());//false
    *    });
    * </pre>
    */
   getOrderBy(): Order[] {
      return this._orderBy;
   }

   /**
    * Устанавливает порядок сортировки выборки
    * @param {String|Array.<Object.<Types/_source/Query/Order.typedef>>} selector Название поле сортировки или набор
    * полей и направление сортировки в каждом (false - по возрастанию, true - по убыванию)
    * @param {Types/_source/Query/Order.typedef} [desc=false] По убыванию
    * @example
    * Отсортируем заказы по полю id по возрастанию:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .orderBy('id');
    *    });
    * </pre>
    * Отсортируем заказы по полю id по убыванию:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .orderBy('id', true);
    *    });
    * </pre>
    * Отсортируем заказы сначала по полю customerId по возрастанию, затем по полю date по убыванию:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .orderBy([
    *             {customerId: false},
    *             {date: true}
    *          ]);
    *    });
    * </pre>
    */
   orderBy(selector: string | boolean[], desc?: boolean): this {
      if (desc === undefined) {
         desc = true;
      }

      this._orderBy = [];

      if (typeof selector === 'object') {
         const processObject = (obj) => {
            if (!obj) {
               return;
            }
            for (const key in obj) {
               if (obj.hasOwnProperty(key)) {
                  this._orderBy.push(new Order({
                     selector: key,
                     order: obj[key]
                  }));
               }
            }
         };

         if (selector instanceof Array) {
            for (let i = 0; i < selector.length; i++) {
               processObject(selector[i]);
            }
         } else {
            processObject(selector);
         }
      } else if (selector) {
         this._orderBy.push(new Order({
            selector,
            order: desc
         }));
      }

      return this;
   }

   /**
    * Возвращает способ группировки
    * @example
    * Получим способ группировки выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .groupBy('customerId');
    *
    *       console.log(query.getGroupBy());//['customerId']
    *    });
    * </pre>
    */
   getGroupBy(): string[] {
      return this._groupBy;
   }

   /**
    * Устанавливает способ группировки выборки
    * @param {String|Array.<String>} expression Способ группировки элементов
    * @example
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .groupBy('customerId');
    *
    *       var query = new Query()
    *          .select('*')
    *          .from('Orders')
    *          .groupBy(['date', 'customerId']);
    *    });
    * </pre>
    */
   groupBy(expression: string | string[]): this {
      if (typeof expression === 'string') {
         expression = [expression];
      }

      if (!(expression instanceof Array)) {
         throw new Error('Invalid argument');
      }

      this._groupBy = expression;

      return this;
   }

   /**
    * Возвращает смещение
    * @example
    * Получим смещение выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .offset(50);
    *
    *       query.getOffset();//50
    *    });
    * </pre>
    */
   getOffset(): number {
      return this._offset;
   }

   /**
    * Устанавливает смещение первого элемента выборки
    * @param {Number} start Смещение первого элемента выборки
    * @example
    * Выберем все заказы, начиная с пятидесятого:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .offset(50);
    *    });
    * </pre>
    */
   offset(start: number | string): this {
      this._offset = parseInt(start as string, 10) || 0;

      return this;
   }

   /**
    * Возвращает максимальное количество записей выборки
    * @return {Number}
    * @example
    * Получим максимальное количество записей выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .limit(10);
    *
    *       console.log(query.getLimit());//10
    *    });
    * </pre>
    */
   getLimit(): number {
      return this._limit;
   }

   /**
    * Устанавливает ограничение кол-ва элементов выборки
    * @param {Number} count Максимальное кол-во элементов выборки
    * @example
    * Выберем первые десять заказов:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Orders')
    *          .limit(10);
    *    });
    * </pre>
    */
   limit(count: number): this {
      this._limit = count;

      return this;
   }

   /**
    * Возвращает мета-данные выборки
    * @example
    * Получим мета-данные выборки:
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Catalogue')
    *          .meta({selectBreadCrumbs: true});
    *
    *       console.log(query.getMeta());//{selectBreadCrumbs: true}
    *    });
    * </pre>
    */
   getMeta(): IMeta {
      return this._meta;
   }

   /**
    * Устанавливает мета-данные выборки
    * @param {Object} data Мета-данные
    * @example
    * Укажем, что в результатах запроса хочем дополнительно получить "хлебные крошки":
    * <pre>
    *    require(['Types/source'], function (source) {
    *       var query = new source.Query()
    *          .select('*')
    *          .from('Catalogue')
    *          .where({'parentId': 10})
    *          .meta({selectBreadCrumbs: true});
    *    });
    * </pre>
    */
   meta(data: IMeta): this {
      data = data || {};
      if (typeof data !== 'object') {
         throw new TypeError('Invalid argument "data"');
      }

      this._meta = data;

      return this;
   }

   // endregion
}

Object.assign(Query.prototype, {
   '[Types/_source/Query]': true,
   _moduleName: 'Types/source:Query'
});
