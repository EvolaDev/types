/**
 * Интерфейс сущности, взаимодействующей с посредником
 * @interface Types/_entity/relation/IReceiver
 * @author Мальцев А.А.
 */
export default interface IReceiver {
    readonly '[Types/_entity/relation/IReceiver]': boolean;

    /**
     * Принимает уведомление от посредника об изменении отношений
     * @param which Объект, уведомивший об изменении отношений
     * @param route Маршрут до объекта
     * @return Модификация объекта, уведомившего об изменении отношений
     */
    relationChanged(which: any, route: string[]): any;
}
