/// <amd-module name="Types/_source/DataSet" />
/**
 * Набор данных, полученный из источника.
 * Представляет собой набор {@link Types/Collection/RecordSet выборок}, {@link Types/Entity/Model записей}, а также скалярных значений, которые можно получить по имени свойства (или пути из имен).
 * Использование таких комплексных наборов позволяет за один вызов {@link Types/Source/ICrud#query списочного} либо {@link Types/Source/IRpc#call произвольного} метода источника данных получать сразу все требующиеся для отображения какого-либо сложного интерфейса данные.
 * {@link rawData Исходные данные} могут быть предоставлены источником в разных форматах (JSON, XML). По умолчанию используется формат JSON.
 * Для чтения каждого формата должен быть указан соответствующий адаптер. По умолчанию используется адаптер {@link Types/Adapter/Json}.
 * В общем случае не требуется создавать экземпляры DataSet самостоятельно - это за вас будет делать источник. Но для наглядности ниже приведены несколько примеров чтения частей из набора данных.
 *
 * Создадим комплексный набор в формате JSON из двух выборок "Заказы" и "Покупатели", одной записи "Итого" и даты выполнения запроса:
 * <pre>
 *    require(['Types/Source/DataSet'], function (DataSet) {
 *       var data = new DataSet({
 *          rawData: {
 *             orders: [
 *                {id: 1, buyer_id: 1, date: '2016-06-02 14:12:45', amount: 96},
 *                {id: 2, buyer_id: 2, date: '2016-06-02 17:01:12', amount: 174},
 *                {id: 3, buyer_id: 1, date: '2016-06-03 10:24:28', amount: 475}
 *             ],
 *             buyers: [
 *                {id: 1, email: 'tony@stark-industries.com', phone: '555-111-222'},
 *                {id: 2, email: 'steve-rogers@avengers.us', phone: '555-222-333'}
 *             ],
 *             total: {
 *                date_from: '2016-06-01 00:00:00',
 *                date_to: '2016-07-01 00:00:00',
 *                amount: 745,
 *                deals: 3,
 *                completed: 2,
 *                paid: 2,
 *                awaited: 1,
 *                rejected: 0
 *             },
 *             executeDate: '2016-06-27 11:34:57'
 *          },
 *          itemsProperty: 'orders',
 *          idProperty: 'id'
 *       });
 *
 *       var orders = data.getAll();//Here use itemsProperty option value
 *       console.log(orders.getCount());//3
 *       console.log(orders.at(0).get('amount'));//96
 *
 *       var buyers = data.getAll('buyers');//Here use argument 'property'
 *       console.log(buyers.getCount());//2
 *       console.log(buyers.at(0).get('email'));//'tony@stark-industries.com'
 *
 *       var total = data.getRow('total');
 *       console.log(total.get('amount'));//745
 *
 *       console.log(data.getScalar('executeDate'));//'2016-06-27 11:34:57'
 *    });
 * </pre>
 * Создадим комплексный набор в формате XML из двух выборок "Заказы" и "Покупатели", записи "Итого" и даты выполнения запроса:
 * <pre>
 *    require(['Types/Source/DataSet', 'Types/Adapter/Xml'], function (DataSet) {
 *       var data = new DataSet({
 *          adapter: 'adapter.xml',
 *          rawData: '<?xml version="1.0"?>' +
 *             '<response>' +
 *             '   <orders>' +
 *             '      <order>' +
 *             '         <id>1</id><buyer_id>1</buyer_id><date>2016-06-02 14:12:45</date><amount>96</amount>' +
 *             '      </order>' +
 *             '      <order>' +
 *             '         <id>2</id><buyer_id>2</buyer_id><date>2016-06-02 17:01:12</date><amount>174</amount>' +
 *             '      </order>' +
 *             '      <order>' +
 *             '         <id>3</id><buyer_id>1</buyer_id><date>2016-06-03 10:24:28</date><amount>475</amount>' +
 *             '      </order>' +
 *             '   </orders>' +
 *             '   <buyers>' +
 *             '      <buyer>' +
 *             '         <id>1</id><email>tony@stark-industries.com</email><phone>555-111-222</phone>' +
 *             '      </buyer>' +
 *             '      <buyer>' +
 *             '         <id>2</id><email>steve-rogers@avengers.us</email><phone>555-222-333</phone>' +
 *             '      </buyer>' +
 *             '   </buyers>' +
 *             '   <total>' +
 *             '      <date_from>2016-06-01 00:00:00</date_from>' +
 *             '      <date_to>2016-07-01 00:00:00</date_to>' +
 *             '      <amount>475</amount>' +
 *             '      <deals>3</deals>' +
 *             '      <completed>2</completed>' +
 *             '      <paid>2</paid>' +
 *             '      <awaited>1</awaited>' +
 *             '      <rejected>0</rejected>' +
 *             '   </total>' +
 *             '   <executeDate>2016-06-27 11:34:57</executeDate>' +
 *             '</response>',
 *          itemsProperty: 'orders/order',//XPath syntax
 *          idProperty: 'id'
 *       });
 *
 *       var orders = data.getAll();
 *       console.log(orders.getCount());//3
 *       console.log(orders.at(0).get('amount'));//96
 *
 *       var buyers = data.getAll('buyers/buyer');//XPath syntax
 *       console.log(buyers.getCount());//2
 *       console.log(buyers.at(0).get('email'));//'tony@stark-industries.com'
 *
 *       var total = data.getRow('total');
 *       console.log(total.get('amount'));//745
 *
 *       console.log(data.getScalar('executeDate'));//'2016-06-27 11:34:57'
 *    });
 * </pre>
 * @class Types/Source/DataSet
 * @mixes Types/Entity/DestroyableMixin
 * @mixes Types/Entity/OptionsMixin
 * @mixes Types/Entity/SerializableMixin
 * @ignoreOptions totalProperty writable
 * @ignoreMethods getTotal getTotalProperty setTotalProperty
 * @public
 * @author Мальцев А.А.
 */

import {DestroyableMixin, OptionsToPropertyMixin, SerializableMixin, Model, adapter} from '../entity';
import di from '../di';
import {mixin} from '../util';
import {RecordSet} from '../collection';

declare type TypeDeclaration = Function | string;

export default class DataSet extends mixin(
   DestroyableMixin, OptionsToPropertyMixin, SerializableMixin
) /** @lends Types/Source/DataSet.prototype */{
   /**
    * @cfg {String|Types/Adapter/IAdapter} Адаптер для работы данными, по умолчанию {@link Types/Adapter/Json}
    * @name Types/Source/DataSet#adapter
    * @see getAdapter
    * @see Types/Adapter/IAdapter
    * @see Types/Di
    * @example
    * <pre>
    *    require([
    *       'Types/Source/Provider/SbisBusinessLogic',
    *       'Types/Source/DataSet',
    *       'Types/Adapter/Sbis'
    *    ], function (Provider, DataSet, SbisAdapter) {
    *       new Provider({
    *          address: '/service/',
    *          contract: 'Employee'
    *       })
    *       .call('getReport', {type: 'Salary'})
    *       .addCallback(function(data) {
    *          var dataSet = new DataSet({
    *             adapter: new SbisAdapter(),
    *             data: data
    *          });
    *       });
    *    });
    * </pre>
    */
   protected _$adapter: adapter.IAdapter | string;

   /**
    * @cfg {*} Данные в "сыром" виде
    * @name Types/Source/DataSet#rawData
    * @remark
    * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
    * @see getRawData
    * @see setRawData
    * @example
    * Создадим набор данных с персонажами фильма:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *             rawData: [{
    *                id: 1,
    *                firstName: 'John',
    *                lastName: 'Connor',
    *                role: 'Savior'
    *             }, {
    *                id: 2,
    *                firstName: 'Sarah',
    *                lastName: 'Connor',
    *                role: 'Savior\'s Mother'
    *             }, {
    *                id: 3,
    *                firstName: '-',
    *                lastName: 'T-800',
    *                role: 'Terminator'
    *             }]
    *          }),
    *          characters = data.getAll();
    *
    *       console.log(characters.at(0).get('firstName'));//John
    *       console.log(characters.at(0).get('lastName'));//Connor
    *    });
    * </pre>
    */
   protected _$rawData: any;

   /**
    * @cfg {String|Function} Конструктор записей, порождаемых набором данных. По умолчанию {@link Types/Entity/Model}.
    * @name Types/Source/DataSet#model
    * @see getModel
    * @see Types/Entity/Model
    * @see Types/Di
    * @example
    * Установим модель "Пользователь":
    * <pre>
    *    require(['Types/Source/DataSet', 'Application/Models/User'], function (DataSet, UserModel) {
    *       var data = new DataSet({
    *          model: UserModel
    *       });
    *    });
    * </pre>
    */
   protected _$model: TypeDeclaration;

   /**
    * @cfg {String|Function} Конструктор рекордсетов, порождаемых набором данных. По умолчанию {@link Types/Collection/RecordSet}.
    * @name Types/Source/DataSet#listModule
    * @see getListModule
    * @see Types/Collection/RecordSet
    * @see Types/Di
    * @example
    * Установим рекодсет "Пользователи":
    * <pre>
    *    require(['Types/Source/DataSet', 'Application/Collections/Users'], function (DataSet, UsersCollection) {
    *       var data = new DataSet({
    *          listModule: UsersCollection
    *       });
    *    });
    * </pre>
    */
   protected _$listModule: TypeDeclaration;

   /**
    * @cfg {String} Название свойства записи, содержащего первичный ключ.
    * @name Types/Source/DataSet#idProperty
    * @see getIdProperty
    * @see Types/Entity/Model#idProperty
    * @example
    * Установим свойство 'primaryId' в качестве первичного ключа:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          idProperty: 'primaryId'
    *       });
    *    });
    * </pre>
    */
   protected _$idProperty: string;

   /**
    * @cfg {String} Название свойства сырых данных, в котором находится основная выборка
    * @name Types/Source/DataSet#itemsProperty
    * @see getItemsProperty
    * @see setItemsProperty
    * @example
    * Установим свойство 'orders' как содержащее основную выборку:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          rawData: {
    *             orders: [
    *                {id: 1, date: '2016-06-02 14:12:45', amount: 96},
    *                {id: 2, date: '2016-06-02 17:01:12', amount: 174},
    *                {id: 3, date: '2016-06-03 10:24:28', amount: 475}
    *             ],
    *             total: {
    *                date_from: '2016-06-01 00:00:00',
    *                date_to: '2016-07-01 00:00:00',
    *                amount: 745
    *             }
    *          },
    *          itemsProperty: 'orders'
    *       });
    *
    *       var orders = data.getAll();
    *       console.log(orders.getCount());//3
    *       console.log(orders.at(0).get('id'));//1
    *    });
    * </pre>
    */
   protected _$itemsProperty: string;

   /**
    * @cfg {String} Свойство данных, в которых находятся мета-данные выборки
    * @name Types/Source/DataSet#metaProperty
    * @see getMetaProperty
    */
   protected _$metaProperty: string;

   /**
    * @cfg {Boolean} Можно модифицировать. Признак передается объектам, которые инстанциирует DataSet.
    * @name Types/Source/DataSet#writable
    */
   protected _$writable: boolean;

   /**
    * Get instance can be changed
    */
   get writable(): boolean {
      return this._$writable;
   }

   /**
    * Set instance can be changed
    */
   set writable(value: boolean) {
      this._$writable = !!value;
   }

   constructor(options) {
      super();
      OptionsToPropertyMixin.call(this, options);
      SerializableMixin.constructor.call(this);
   }

   //region Public methods

   /**
    * Возвращает адаптер для работы с данными
    * @return {Types/Adapter/IAdapter}
    * @see adapter
    * @see Types/Adapter/IAdapter
    * @example
    * Получим адаптер набора данных, используемый по умолчанию:
    * <pre>
    *    require(['Types/Source/DataSet', 'Types/Adapter/Json'], function (DataSet, JsonAdapter) {
    *       var data = new DataSet();
    *       console.log(data.getAdapter() instanceof JsonAdapter);//true
    *    });
    * </pre>
    */
   getAdapter(): adapter.IAdapter {
      if (typeof this._$adapter === 'string') {
         this._$adapter = <adapter.IAdapter>di.create(this._$adapter);
      }
      return this._$adapter;
   }

   /**
    * Возвращает конструктор записей, порождаемых набором данных.
    * @return {String|Function}
    * @see model
    * @see Types/Entity/Model
    * @see Types/Di
    * @example
    * Получим конструктор записей, используемый по умолчанию:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet();
    *       console.log(data.getModel());//'Types/entity:Model'
    *    });
    * </pre>
    */
   getModel(): TypeDeclaration {
      return this._$model;
   }

   /**
    * Устанавливает конструктор записей, порождаемых набором данных.
    * @param {String|Function} model
    * @see model
    * @see getModel
    * @see Types/Entity/Model
    * @see Types/Di
    * @example
    * Установим конструктор пользовательской модели:
    * <pre>
    *    require(['Types/Source/DataSet', 'Application/Models/User'], function (DataSet, UserModel) {
    *       var data = new DataSet();
    *       data.setModel(UserModel);
    *    });
    * </pre>
    */
   setModel(model: TypeDeclaration) {
      this._$model = model;
   }

   /**
    * Возвращает конструктор списка моделей
    * @return {String|Function}
    * @see listModule
    * @see Types/Di
    * @example
    * Получим конструктор рекордсетов, используемый по умолчанию:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet();
    *       console.log(data.getListModule());//'Types/collection:RecordSet'
    *    });
    * </pre>
    */
   getListModule(): TypeDeclaration {
      return this._$listModule;
   }

   /**
    * Устанавливает конструктор списка моделей
    * @param {String|Function} listModule
    * @see getListModule
    * @see listModule
    * @see Types/Di
    * @example
    * Установим конструктор рекордсетов:
    * <pre>
    *    require(['Types/Source/DataSet', 'Application/Collection/Users'], function (DataSet, UsersCollection) {
    *       var data = new DataSet();
    *       data.setListModule(UsersCollection);
    *    });
    * </pre>
    */
   setListModule(listModule: TypeDeclaration) {
      this._$listModule = listModule;
   }

   /**
    * Возвращает название свойства модели, содержащего первичный ключ
    * @return {String}
    * @see idProperty
    * @see Types/Entity/Model#idProperty
    * @example
    * Получим название свойства модели, содержащего первичный ключ:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          idProperty: 'id'
    *       });
    *       console.log(data.getIdProperty());//'id'
    *    });
    * </pre>
    */
   getIdProperty(): string {
      return this._$idProperty;
   }

   /**
    * Устанавливает название свойства модели, содержащего первичный ключ
    * @param {String} name
    * @see getIdProperty
    * @see idProperty
    * @see Types/Entity/Model#idProperty
    * @example
    * Установим название свойства модели, содержащего первичный ключ:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet();
    *       data.setIdProperty('id');
    *    });
    * </pre>
    */
   setIdProperty(name: string) {
      this._$idProperty = name;
   }

   /**
    * Возвращает название свойства сырых данных, в котором находится основная выборка
    * @return {String}
    * @see setItemsProperty
    * @see itemsProperty
    * @example
    * Получим название свойства, в котором находится основная выборка:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          itemsProperty: 'items'
    *       });
    *       console.log(data.getItemsProperty());//'items'
    *    });
    * </pre>
    */
   getItemsProperty(): string {
      return this._$itemsProperty;
   }

   /**
    * Устанавливает название свойства сырых данных, в котором находится основная выборка
    * @param {String} name
    * @see getItemsProperty
    * @see itemsProperty
    * @example
    * Установим название свойства, в котором находится основная выборка:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet();
    *       data.setItemsProperty('items');
    *    });
    * </pre>
    */
   setItemsProperty(name: string) {
      this._$itemsProperty = name;
   }

   /**
    * Возвращает выборку
    * @param {String} [property] Свойство данных, в которых находятся элементы выборки. Если не указывать, вернется основная выборка.
    * @return {Types/Collection/RecordSet}
    * @see itemsProperty
    * @example
    * Получим основную выборку из набора данных, представляющего выборку:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *             rawData: [
    *                {id: 1, title: 'How to build a Home'},
    *                {id: 2, title: 'How to plant a Tree'},
    *                {id: 3, title: 'How to grow up a Son'}
    *             ]
    *          }),
    *          mansGuide = data.getAll();
    *
    *       console.log(mansGuide.at(0).get('title'));//'How to build a Home'
    *    });
    * </pre>
    * @example
    * Получим основную и дополнительную выборки из набора данных, представляющего несколько выборок:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *             rawData: {
    *                articles: [{
    *                   id: 1,
    *                   topicId: 1,
    *                   title: 'Captain America'
    *                }, {
    *                   id: 2,
    *                   topicId: 1,
    *                   title: 'Iron Man'
    *                }, {
    *                   id: 3,
    *                   topicId: 2,
    *                   title: 'Batman'
    *                }],
    *                topics: [{
    *                   id: 1,
    *                   title: 'Marvel Comics'
    *                }, {
    *                   id: 2,
    *                   title: 'DC Comics'
    *                }]
    *             },
    *             itemsProperty: 'articles'
    *          }),
    *          articles = data.getAll(),
    *          topics = data.getAll('topics');
    *
    *       console.log(articles.at(0).get('title'));//'Captain America'
    *       console.log(topics.at(0).get('title'));//'Marvel Comics'
    *    });
    * </pre>
    */
   getAll(property?: string): RecordSet<Model> {
      this._checkAdapter();
      if (property === undefined) {
         property = this._$itemsProperty;
      }

      let items = this._getListInstance(
         this._getDataProperty(property)
      );

      if (this._$metaProperty && items.getMetaData instanceof Function) {
         let itemsMetaData = items.getMetaData();
         let metaData = this.getMetaData();
         let someInMetaData = Object.keys(metaData).length > 0;

         // FIXME: don't use deprecated 'total' property from raw data
         if (!someInMetaData && this._$rawData && this._$rawData.total) {
            metaData = {total: this._$rawData.total};
            someInMetaData = true;
         }

         if (someInMetaData) {
            itemsMetaData = Object.assign(itemsMetaData || {}, metaData);

            // FIXME: don't use 'more' anymore
            if (!itemsMetaData.hasOwnProperty('more') && metaData.hasOwnProperty('total')) {
               itemsMetaData.more = (<any> metaData).total;
            }

            items.setMetaData(itemsMetaData);
         }
      }

      return items;
   }

   /**
    * Возвращает запись
    * @param {String} [property] Свойство данных, в которых находится модель
    * @return {Types/Entity/Model|undefined}
    * @see itemsProperty
    * @example
    * Получим запись из набора данных, который содержит только ее:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *             rawData: {
    *                id: 1,
    *                title: 'C++ Beginners Tutorial'
    *             }
    *          }),
    *          article = data.getRow();
    *
    *       console.log(article.get('title'));//'C++ Beginners Tutorial'
    *    });
    * </pre>
    * @example
    * Получим записи статьи и темы из набора данных, который содержит несколько записей:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *             rawData: {
    *                article: {
    *                   id: 2,
    *                   topicId: 1,
    *                   title: 'Iron Man'
    *                },
    *                topic: {
    *                   id: 1,
    *                   title: 'Marvel Comics'
    *                }
    *             }
    *          }),
    *          article = data.getRow('article'),
    *          topic = data.getRow('topic');
    *
    *       console.log(article.get('title'));//'Iron Man'
    *       console.log(topic.get('title'));//'Marvel Comics'
    *    });
    * </pre>
    */
   getRow(property?: string): Model {
      this._checkAdapter();
      if (property === undefined) {
         property = this._$itemsProperty;
      }

      //FIXME: don't use hardcoded signature for type detection
      let data = this._getDataProperty(property);
      let type = this.getAdapter().getProperty(data, '_type');
      if (type === 'recordset') {
         let tableAdapter = this.getAdapter().forTable(data);
         if (tableAdapter.getCount() > 0) {
            return this._getModelInstance(tableAdapter.at(0));
         }
      } else {
         return this._getModelInstance(data);
      }

      return undefined;
   }

   /**
    * Возвращает значение
    * @param {String} [property] Свойство данных, в которых находится значение
    * @return {*}
    * @see itemsProperty
    * @example
    * Получим количество открытых задач:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var statOpen = new DataSet({
    *          rawData: 234
    *       });
    *
    *       console.log(statOpen.getScalar());//234
    *    });
    * </pre>
    * @example
    * Получим количество открытых и закрытых задач:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var stat = new DataSet({
    *          rawData: {
    *             total: 500,
    *             open: 234,
    *             closed: 123,
    *             deleted: 2345
    *           }
    *       });
    *
    *       console.log(stat.getScalar('open'));//234
    *       console.log(stat.getScalar('closed'));//123
    *    });
    * </pre>
    */
   getScalar(property?: string): string | number | boolean {
      if (property === undefined) {
         property = this._$itemsProperty;
      }
      return this._getDataProperty(property);
   }

   /**
    * Возвращает свойство данных, в котором находися общее число элементов выборки
    * @return {String}
    * @see metaProperty
    */
   getMetaProperty(): string {
      return this._$metaProperty;
   }

   /**
    * Возвращает мета-данные выборки
    * @return {Object}
    * @see metaProperty
    */
   getMetaData(): Object {
      return this._$metaProperty && this._getDataProperty(this._$metaProperty) || {};
   }

   /**
    * Проверяет наличие свойства в данных
    * @param {String} property Свойство
    * @return {Boolean}
    * @see getProperty
    * @example
    * Проверим наличие свойств 'articles' и 'topics':
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          rawData: {
    *             articles: [{
    *                id: 1,
    *                title: 'C++ Beginners Tutorial'
    *             }]
    *          }
    *       });
    *
    *       console.log(data.hasProperty('articles'));//true
    *       console.log(data.hasProperty('topics'));//false
    *    });
    * </pre>
    */
   hasProperty(property: string): boolean {
      return property ? this._getDataProperty(property) !== undefined : false;
   }

   /**
    * Возвращает значение свойства в данных
    * @param {String} property Свойство
    * @return {*}
    * @see hasProperty
    * @example
    * Получим значение свойства 'article':
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          rawData: {
    *             article: {
    *                id: 1,
    *                title: 'C++ Beginners Tutorial'
    *             }
    *          }
    *       });
    *
    *       console.log(data.getProperty('article'));//{id: 1, title: 'C++ Beginners Tutorial'}
    *    });
    * </pre>
    */
   getProperty(property: string): any {
      return this._getDataProperty(property);
   }

   /**
    * Возвращает сырые данные
    * @return {*}
    * @see setRawData
    * @see rawData
    * @example
    * Получим данные в сыром виде:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          rawData: {
    *             id: 1,
    *             title: 'C++ Beginners Tutorial'
    *          }
    *       });
    *
    *       console.log(data.getRawData());//{id: 1, title: 'C++ Beginners Tutorial'}
    *    });
    * </pre>
    */
   getRawData(): any {
      return this._$rawData;
   }

   /**
    * Устанавливает сырые данные
    * @param rawData {*} Сырые данные
    * @see getRawData
    * @see rawData
    * @example
    * Установим данные в сыром виде:
    * <pre>
    *    require(['Types/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet();
    *
    *       data.setRawData({
    *          id: 1,
    *          title: 'C++ Beginners Tutorial'
    *       });
    *       console.log(data.getRow().get('title'));//'C++ Beginners Tutorial'
    *    });
    * </pre>
    */
   setRawData(rawData: any) {
      this._$rawData = rawData;
   }

   //endregion Public methods

   //region Protected methods

   /**
    * Возвращает свойство данных
    * @param {String} property Свойство
    * @return {*}
    * @protected
    */
   protected _getDataProperty(property: string): any {
      this._checkAdapter();
      return property
         ? this.getAdapter().getProperty(this._$rawData, property)
         : this._$rawData;
   }

   /**
    * Возвращает инстанс модели
    * @param {*} rawData Данные модели
    * @return {Types/Entity/Model}
    * @protected
    */
   protected _getModelInstance(rawData: any): Model {
      if (!this._$model) {
         throw new Error('Model is not defined');
      }
      return <Model>di.create(this._$model, {
         writable: this._$writable,
         rawData: rawData,
         adapter: this._$adapter,
         idProperty: this._$idProperty
      });
   }

   /**
    * Возвращает инстанс рекордсета
    * @param {*} rawData Данные рекордсета
    * @return {Types/Collection/RecordSet}
    * @protected
    */
   protected _getListInstance(rawData: any): RecordSet<Model> {
      return <RecordSet<Model>>di.create(this._$listModule, {
         writable: this._$writable,
         rawData: rawData,
         adapter: this._$adapter,
         model: this._$model,
         idProperty: this._$idProperty
      });
   }

   /**
    * Проверят наличие адаптера
    * @protected
    */
   protected _checkAdapter() {
      if (!this.getAdapter()) {
         throw new Error('Adapter is not defined');
      }
   }

   //endregion Protected methods
}

DataSet.prototype._moduleName = 'Types/source:DataSet';
DataSet.prototype['[Types/_source/DataSet]'] = true;
// @ts-ignore
DataSet.prototype._$adapter = 'Types/entity:adapter.Json';
// @ts-ignore
DataSet.prototype._$rawData = null;
// @ts-ignore
DataSet.prototype._$model = 'Types/entity:Model';
// @ts-ignore
DataSet.prototype._$listModule = 'Types/collection:RecordSet';
// @ts-ignore
DataSet.prototype._$idProperty = '';
// @ts-ignore
DataSet.prototype._$itemsProperty = '';
// @ts-ignore
DataSet.prototype._$metaProperty = '';
// @ts-ignore
DataSet.prototype._$writable = true;

di.register('Types/source:DataSet', DataSet, {instantiate: false});