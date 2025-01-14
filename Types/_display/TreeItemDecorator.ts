import TreeItem from './TreeItem';
import BreadcrumbsItem from './BreadcrumbsItem';
import Tree from './Tree';
import {register} from '../di';

export interface IOptions<T> {
    source: TreeItem<T>;
    parent?: TreeItem<T> | BreadcrumbsItem<T>;
}

/**
 * Tree item which is just a decorator for another one
 * @class Types/_display/TreeItemDecorator
 * @extends Types/_display/TreeItem
 * @public
 * @author Мальцев А.А.
 */
export default class TreeItemDecorator<T> extends TreeItem<T> {
    protected _$source: TreeItem<T>;

    constructor(options?: IOptions<T>) {
        super();
        this._$source = options && options.source;
        this._$parent = options && options.parent;
    }

    getSource(): TreeItem<T> {
        return this._$source;
    }

    // region CollectionItem

    getOwner(): Tree<T> {
        return this._$source && this._$source.getOwner();
    }

    setOwner(owner: Tree<T>): void {
        return this._$source && this._$source.setOwner(owner);
    }

    getContents(): T {
        return this._$source && this._$source.getContents();
    }

    setContents(contents: T, silent?: boolean): void {
        return this._$source && this._$source.setContents(contents, silent);
    }

    getUid(): string {
        return this._$source && this._$source.getUid();
    }

    isSelected(): boolean {
        return this._$source && this._$source.isSelected();
    }

    setSelected(selected: boolean, silent?: boolean): void {
        return this._$source && this._$source.setSelected(selected, silent);
    }

    // endregion

    // region TreeItem

    getRoot(): TreeItem<T> {
        return this._$source && this._$source.getRoot();
    }

    isRoot(): boolean {
        return this._$source && this._$source.isRoot();
    }

    isNode(): boolean {
        return this._$source && this._$source.isNode();
    }

    setNode(node: boolean): void {
        return this._$source && this._$source.setNode(node);
    }

    isExpanded(): boolean {
        return this._$source && this._$source.isExpanded();
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        return this._$source && this._$source.setExpanded(expanded, silent);
    }

    toggleExpanded(): void {
        return this._$source && this._$source.toggleExpanded();
    }

    isHasChildren(): boolean {
        return this._$source && this._$source.isHasChildren();
    }

    setHasChildren(value: boolean): void {
        return this._$source && this._$source.setHasChildren(value);
    }

    isLoaded(): boolean {
        return this._$source && this._$source.isLoaded();
    }

    setLoaded(value: boolean): void {
        return this._$source && this._$source.setLoaded(value);
    }

    getChildrenProperty(): string {
        return this._$source && this._$source.getChildrenProperty();
    }

    // endregion
}

Object.assign(TreeItemDecorator.prototype, {
    '[Types/_display/TreeItemDecorator]': true,
    _moduleName: 'Types/display:TreeItemDecorator',
    _$source: undefined
});

register('Types/display:TreeItemDecorator', TreeItemDecorator, {instantiate: false});
