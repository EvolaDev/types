/// <amd-module name="Types/_entity/adapter/Sbis" />
/**
 * Адаптер для данных в формате СБиС.
 * Работает с форматом данных, который использует БЛ СБИС.
 * Примеры можно посмотреть в модулях {@link Types/Adapter/SbisRecord} и {@link Types/Adapter/SbisTable}.
 * @class Types/Adapter/Sbis
 * @extends Types/Adapter/Abstract
 * @public
 * @author Мальцев А.А.
 */

import Abstract from './Abstract';
import SbisTable from './SbisTable';
import SbisRecord from './SbisRecord';
import FIELD_TYPE from './SbisFieldType';
import di from '../../di';

export default class Sbis extends Abstract /** @lends Types/Adapter/Sbis.prototype */{

   forTable(data) {
      return new SbisTable(data);
   }

   forRecord(data) {
      return new SbisRecord(data);
   }

   getKeyField(data) {
      //TODO: primary key field index can be defined in this._data.k. and can be -1
      let index;
      let s;
      if (data && data.s) {
         s = data.s;
         for (let i = 0, l = s.length; i < l; i++) {
            if (s[i].n && s[i].n[0] === '@') {
               index = i;
               break;
            }
         }
         if (index === undefined && s.length) {
            index = 0;
         }
      }
      return index === undefined ? undefined : s[index].n;
   }

   static get FIELD_TYPE() {
      return FIELD_TYPE;
   }
}

Sbis.prototype['[Types/_entity/adapter/Sbis]'] = true;
Sbis.prototype._moduleName = 'Types/entity:adapter.Sbis';

di.register('Types/entity:adapter.Sbis', Sbis, {instantiate: false});
// Deprecated
di.register('adapter.sbis', Sbis);