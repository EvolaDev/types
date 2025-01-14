import dateFormat from './date';

export enum Type {
    FullDate,
    ShortDate,
    FullMonth,
    ShortMonth,
    FullQuarter,
    ShortQuarter,
    FullHalfYear,
    ShortHalfYear,
    Year
}

const SEPARATOR = '-';

function generalPeriod(start: Date, finish: Date, format: string): string {
    const startLabel = dateFormat(start, format);
    const finishLabel = dateFormat(finish, format);
    if (startLabel === finishLabel) {
        return startLabel;
    } else {
        return `${startLabel}${SEPARATOR}${finishLabel}`;
    }
}

function datesPeriod(start: Date, finish: Date, type: Type): string {
    const format = type === Type.FullDate ? dateFormat.FULL_DATE_FULL_MONTH : dateFormat.FULL_DATE_SHORT_MONTH;
    const onlyMonthFormat = type === Type.FullDate
        ? dateFormat.FULL_DATE_FULL_MONTH
        : dateFormat.SHORT_DATE_SHORT_MONTH;
    const onlyDateFormat = type === Type.FullDate ? dateFormat.FULL_DATE_FULL_MONTH : 'DD';

    const startDate = start.getDate();
    const startMonth = start.getMonth();
    const startYear = start.getFullYear();
    const finishDate = finish.getDate();
    const finishMonth = finish.getMonth();
    const finishYear = finish.getFullYear();
    if (startYear === finishYear) {
        // The same year
        if (startMonth === finishMonth) {
            // The same month
            if (startDate === finishDate) {
                // The same date
                return dateFormat(start, format);
            }
            return `${dateFormat(start, onlyDateFormat)}${SEPARATOR}${dateFormat(finish, format)}`;
        }
        return `${dateFormat(start, onlyMonthFormat)}${SEPARATOR}${dateFormat(finish, format)}`;
    }
    return `${dateFormat(start, format)}${SEPARATOR}${dateFormat(finish, format)}`;
}

function monthsPeriod(start: Date, finish: Date, type: Type): string {
    const format = type === Type.FullMonth ? dateFormat.FULL_MONTH : dateFormat.SHORT_MONTH;
    const onlyMonthFormat = type === Type.FullMonth ? 'MMMM' : 'MMM';

    const startMonth = start.getMonth();
    const startYear = start.getFullYear();
    const finishMonth = finish.getMonth();
    const finishYear = finish.getFullYear();
    if (startYear === finishYear) {
        if (startMonth === finishMonth) {
            return dateFormat(start, format);
        }
        return `${dateFormat(start, onlyMonthFormat)}${SEPARATOR}${dateFormat(finish, format)}`;
    }
    return `${dateFormat(start, format)}${SEPARATOR}${dateFormat(finish, format)}`;
}

function quartersPeriod(start: Date, finish: Date, type: Type): string {
    return generalPeriod(
        start,
        finish,
        type === Type.FullQuarter ? dateFormat.FULL_QUATER : dateFormat.SHORT_QUATER
    );
}

function halvesYearsPeriod(start: Date, finish: Date, type: Type): string {
    return generalPeriod(
        start,
        finish,
        type === Type.FullHalfYear ? dateFormat.FULL_HALF_YEAR : dateFormat.SHORT_HALF_YEAR
    );
}

function yearsPeriod(start: Date, finish: Date): string {
    return generalPeriod(start, finish, 'YYYY');
}

/**
 * Преобразует временной период в строку указанного формата {@link http://axure.tensor.ru/standarts/v7/форматы_дат_и_времени_01_2.html по стандарту}.
 * @remark
 * <h2>Параметры функции</h2>
 * <ul>
 *      <li><b>start</b> {Date} Дата начала периода.</li>
 *      <li><b>finish</b> {Date} Дата окончания периода.</li>
 *      <li><b>[type]</b> {Type} Тип периода.</li>
 * </ul>
 * <h2>Возвращает</h2>
 * {String} Период в в текстовом виде.
 *
 * <h2>Доступные значения type.</h2>
 * <ul>
 *     <li>FullDate: выводится период в виде дат в полном формате;</li>
 *     <li>ShortDate: выводится период в виде дат в коротком формате;</li>
 *     <li>FullMonth: выводится период в виде месяцев в полном формате;</li>
 *     <li>ShortMonth: выводится период в виде месяцев в коротком формате;</li>
 *     <li>FullQuarter: выводится период в виде кварталов в полном формате;</li>
 *     <li>ShortQuarter: выводится период в виде кварталов в коротком формате;</li>
 *     <li>FullHalfYear: выводится период в виде полугодий в полном формате;</li>
 *     <li>ShortHalfYear: выводится период в виде полугодий в коротком формате;</li>
 *     <li>Year: выводится период в виде дат в годовом формате;</li>
 * </ul>
 *
 * Выведем период в формате короткой даты:
 * <pre>
 *     import {period, periodType} from 'Types/formatter';
 *     const start = new Date(2018, 4, 7);
 *     const finish = new Date(2019, 11, 3);
 *     console.log(period(start, finish, periodType.ShortDate)); // 7 май'18-3 дек'19
 * </pre>
 *
 * @class
 * @name Types/_formatter/period
 * @public
 * @author Мальцев А.А.
 */
export default function period(start: Date, finish: Date, type: Type = Type.FullDate): string {
    // Check arguments
    if (!(start instanceof Date)) {
        throw new TypeError('Argument "start" should be an instance of Date');
    }
    if (!(finish instanceof Date)) {
        throw new TypeError('Argument "finish" should be an instance of Date');
    }

    // Dates period
    if (type === Type.FullDate || type === Type.ShortDate) {
        return datesPeriod(start, finish, type);
    }

    // Months period
    if (type === Type.FullMonth || type === Type.ShortMonth) {
        return monthsPeriod(start, finish, type);
    }

    // Quarters period
    if (type === Type.FullQuarter || type === Type.ShortQuarter) {
        return quartersPeriod(start, finish, type);
    }

    // Halves a year period
    if (type === Type.FullHalfYear || type === Type.ShortHalfYear) {
        return halvesYearsPeriod(start, finish, type);
    }

    // Years period
    return yearsPeriod(start, finish);
}
