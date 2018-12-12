/// <amd-module name="Types/_entity/ReadWriteMixin" />
/**
 * Миксин, позволяющий ограничивать запись и чтение.
 * Подмешивается после Types/Entity/ObservableMixin и после Types/Entity/ManyToManyMixin, перекрывая часть их методов
 * @mixin Types/Entity/ReadWriteMixin
 * @public
 * @author Мальцев А.А.
 */

import OptionsToPropertyMixin from './OptionsToPropertyMixin';
import ObservableMixin from  './ObservableMixin';
import ManyToManyMixin from  './ManyToManyMixin';
import {protect} from '../util';

let hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Свойство, хранящее признак возможности записи
 */
let $writable = protect('writable');

const ReadWriteMixin = /** @lends Types/Entity/ReadWriteMixin.prototype */{
   '[Types/_entity/ReadWriteMixin]': true,

   //region Types/Entity/ReadWriteMixin

   get writable() {
      return this[$writable];
   },

   constructor(options) {
      if (this._options && hasOwnProperty.call(this._options, 'writable')) {
         this[$writable] = this._options.writable;
      }
      if (options && hasOwnProperty.call(options, 'writable')) {
         this[$writable] = options.writable;
      }
      if (this[$writable]) {
         ObservableMixin.apply(this, arguments);
      }
   },

   destroy() {
      if (this[$writable]) {
         ObservableMixin.prototype.destroy.call(this);
         ManyToManyMixin.destroy.call(this);
      }
   },

   //endregion Types/Entity/ReadWriteMixin

   //region Types/Entity/ObservableMixin

   subscribe(event, handler, ctx) {
      if (this[$writable]) {
         return ObservableMixin.prototype.subscribe.call(this, event, handler, ctx);
      }
   },

   unsubscribe(event, handler, ctx) {
      if (this[$writable]) {
         return ObservableMixin.prototype.unsubscribe.call(this, event, handler, ctx);
      }
   },

   _publish() {
      if (this[$writable]) {
         // @ts-ignore
         return ObservableMixin.prototype._publish.apply(this, arguments);
      }
   },

   _notify() {
      if (this[$writable]) {
         // @ts-ignore
         return ObservableMixin.prototype._notify.apply(this, arguments);
      }
   },

   //endregion Types/Entity/ObservableMixin

   //region Types/Entity/OptionsToPropertyMixin

   _getOptions() {
      // @ts-ignore
      let options = OptionsToPropertyMixin.prototype._getOptions.call(this);

      //Delete "writable" property received from _options
      delete options.writable;
      return options;
   }

   //endregion Types/Entity/OptionsToPropertyMixin
};

// @ts-ignore
const IS_BROWSER = typeof window !== 'undefined';
// @ts-ignore
const IS_TESTING = !!(typeof global !== 'undefined' && global.assert && global.assert.strictEqual);

/**
 * @property {Boolean} Объект можно модифицировать. Запрет модификации выключит механизмы генерации событий (ObservableMixin).
 */
Object.defineProperty(ReadWriteMixin, $writable, {
   writable: true,
   value: IS_BROWSER || IS_TESTING
});

export default ReadWriteMixin;