export interface IOptions {
    expanded?: boolean;
}

/**
 * Mixin that defines expandable aspect in collection item behaviour.
 * @mixin Types/_display/ExpandableMixin
 * @public
 * @author Мальцев А.А.
 */
export default abstract class ExpandableMixin {
    '[Types/_display/ExpandableMixin]': boolean;

    /**
     * The node is expanded or collapsed. Expanded by default.
     */
    protected _$expanded: boolean;

    protected constructor() {
        this._$expanded = !!this._$expanded;
    }

    /**
     * Returns node state is expanded.
     */
    isExpanded(): boolean {
        return this._$expanded;
    }

    /**
     * Sets node state as expanded or collapsed.
     * @param expanded True if node is expanded, otherwise collapsed
     * @param [silent=false] Do not fire event about node's state change
     */
    setExpanded(expanded: boolean, silent?: boolean): void {
        if (this._$expanded === expanded) {
            return;
        }
        this._$expanded = expanded;
        if (!silent && this._notifyItemChangeToOwner) {
            this._notifyItemChangeToOwner('expanded');
        }
    }

    /**
     * Switches node state from expanded to collapsed and vice versa.
     */
    toggleExpanded(): void {
        this.setExpanded(!this.isExpanded());
    }

    // region Types/_display/CollectionItem

    protected abstract _notifyItemChangeToOwner(property: string): void;

    // endregion
}

Object.assign(ExpandableMixin.prototype, {
    '[Types/_display/ExpandableMixin]': true,
    _$expanded: true
});
