import React from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import {
    DragSourceMonitor,
    DropTargetMonitor,
    DragLayerMonitor,
    ConnectDragSource,
    ConnectDragPreview,
    ConnectDropTarget
} from "react-dnd";
import * as constants from "./constants";

declare namespace PageDesignCore {
    type EventType = "add" | "sort";
    type Axis = "vertical" | "horizontal" | "both";
    type CommitAction = "auto" | "drop";
    type HoverDirection = "up" | "down" | "left" | "right" | "none";

    interface Point {
        x: number;
        y: number;
    }

    interface Item {
        id: string | number;
        pid: string | number | null;
        [propName: string]: any;
    }

    interface DragAndDropEvent {
        item: Item;
        dom: HTMLElement;
        component: any;
        monitor: DragSourceMonitor | DropTargetMonitor;
        model: Model;
    }

    interface DragStartEvent extends DragAndDropEvent {
        type: EventType;
    }

    interface DragEndEvent extends DragStartEvent {}

    interface DropToItemEvent extends DragStartEvent {
        target: Item;
        targetDOM: HTMLElement;
    }

    interface DropToContainerEvent extends DragStartEvent {
        target: string | number | null;
        targetDOM: HTMLElement;
    }

    interface DropEvent extends DragStartEvent {
        target: Item | string | number | null;
        targetDOM: HTMLElement;
    }

    interface DragHoverItemEvent extends DropToItemEvent {}
    interface DragHoverContainerEvent extends DropToContainerEvent {}
    interface DragHoverEvent extends DropEvent {}

    type ProviderRender = (model: Model) => React.ReactNode;

    interface ProviderProps {
        backend: object;
        idField: string | "id";
        pidField: string | "pid";
        value?: Item[];
        defaultValue?: Item[];
        axis?: Axis;
        commitAction?: CommitAction;
        children?: React.ReactNode | ProviderRender;
        onChange?: (items: Item[]) => void;
        onDragStart?: (e: DragStartEvent) => void;
        onDragEnd?: (e: DragEndEvent) => void;
        onDropToItem?: (e: DropToItemEvent) => void;
        onDropToContainer?: (e: DropToContainerEvent) => void;
        onDrop?: (e: DropEvent) => void;
        onDragHoverContainer?: (e: DragHoverContainerEvent) => void;
        onDragHoverItem?: (e: DragHoverItemEvent) => void;
        onDragHover?: (e: DragHoverEvent) => void;
    }

    type ModelProps = ProviderProps;

    interface ProviderState {
        readonly scope: string;
        items: Item[];
    }

    interface CanDragOptions {
        monitor: DragSourceMonitor;
        model: Model;
        component: WidgetItem;
    }

    interface CanDropOptions extends CanDragOptions {
        item: Item;
        dom: HTMLElement;
    }

    interface DragHoverOptions extends CanDropOptions {}

    interface BeginDragOptions extends CanDropOptions {}

    interface EndDragOptions extends BeginDragOptions {}

    interface DropOptions extends CanDropOptions {}

    interface WidgetItemRenderProps {
        monitor: DragSourceMonitor;
        isDragging: boolean;
        model: Model;
        connectDragSource: ConnectDragSource;
        connectDragPreview: ConnectDragPreview;
    }

    type WidgetItemRender = (props: WidgetItemRenderProps) => JSX.Element;

    interface WidgetItemProps {
        getInstance: () => Item;
        children?: React.ReactNode | WidgetItemRender;
        render?: WidgetItemRender;
        canDrag?: (props: CanDragOptions) => boolean;
        beginDrag?: (props: BeginDragOptions) => void;
        endDrag?: (props: EndDragOptions) => void;
    }

    interface DropItemRenderProps {
        monitor: DropTargetMonitor;
        hoverDirection: HoverDirection;
        isOver: boolean;
        isStrictlyOver: boolean;
        canDrop: boolean;
        isDragging: boolean;
        item: Item;
        isTmp: boolean;
        model: Model;
        connectDropTarget: ConnectDropTarget;
        connectDragSource: ConnectDragSource;
        connectDragAndDrop: (dom: HTMLElement) => void;
        connectDragPreview: ConnectDragPreview;
    }

    type DropItemRender = (props: DropItemRenderProps) => JSX.Element;

    interface DropItemProps {
        item: Item;
        axis?: Axis;
        children?: React.ReactNode | DropItemRender;
        render?: DropItemRender;
        canDrop?: (props: CanDropOptions) => boolean;
        hover?: (props: DragHoverOptions) => void;
        canDrag?: (props: CanDragOptions) => void;
        beginDrag?: (props: BeginDragOptions) => void;
        endDrag?: (props: EndDragOptions) => void;
    }

    interface DropContainerRenderProps {
        monitor: DropTargetMonitor;
        canDrop: boolean;
        isOver: boolean;
        isStrictlyOver: boolean;
        model: Model;
        connectDropTarget: ConnectDropTarget;
        items: Items[];
        [propName: string]: any;
    }

    type DropContainerRender = (props: DropContainerRenderProps) => JSX.Element;

    interface DropContainerProps {
        id: any;
        children?: React.ReactNode | DropContainerRender;
        axis?: Axis;
        render?: DropContainerRender;
        canDrop?: (props: CanDropOptions) => boolean;
        hover?: (props: DragHoverOptions) => void;
        drop?: (props: DropOptions) => void;
    }

    interface DragLayerRenderProps {
        item: Item | null;
        dom: HTMLElement | null;
        monitor: DragLayerMonitor;
        // type: any;
        isDragging: boolean;
        initialClientOffset: Point | null;
        initialSourceClientOffset: Point | null;
        clientOffset: Point | null;
        differenceFromInitialOffset: Point | null;
        sourceClientOffset: Point | null;
    }

    type DragLayerRender = (props: DragLayerRenderProps) => JSX.Element;

    interface DragLayerProps {
        children: React.ReactNode | DragLayerRender;
    }

    export class Provider extends React.Component<
        ProviderProps,
        ProviderState
    > {
        getModel(): Model;
        render(): JSX.Element;
    }

    export class Model extends React.Component<ModelProps, {}> {
        render(): JSX.Element;
    }

    export class WidgetItem extends React.Component<WidgetItemProps, {}> {
        render(): JSX.Element;
    }

    export class DropItem extends React.Component<DropItemProps, {}> {
        render(): JSX.Element;
    }

    export class DropContainer extends React.Component<DropContainerProps, {}> {
        render(): JSX.Element;
    }

    export class DragLayer extends React.Component<DragLayerProps, {}> {
        render(): JSX.Element;
    }

    export class DropZone extends React.Component<{}, {}> {
        render(): JSX.Element;
    }
}

declare const useModel: () => PageDesignCore.Model;
declare const ModelContext: React.Context<PageDesignCore.Model>;
declare const constants: typeof constants;
declare const getEmptyImage: () => HTMLImageElement;
declare const DropZone = PageDesignCore.DropZone;
declare const Provider = PageDesignCore.Provider;
declare const WidgetItem = PageDesignCore.WidgetItem;
declare const DropItem = PageDesignCore.DropItem;
declare const DropContainer = PageDesignCore.DropContainer;
declare const DragLayer = PageDesignCore.DragLayer;

export {
    useModel,
    ModelContext,
    constants,
    getEmptyImage,
    DropZone,
    Provider,
    WidgetItem,
    DropItem,
    DropContainer,
    DragLayer,
    NativeTypes
};

export default {
    useModel,
    ModelContext,
    constants,
    getEmptyImage,
    DropZone,
    Provider,
    WidgetItem,
    DropItem,
    DropContainer,
    DragLayer,
    NativeTypes
};
