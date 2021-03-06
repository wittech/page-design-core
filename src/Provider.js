import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Model from "./Model";

export default class PageDesignCoreProvider extends React.Component {
    static defaultProps = {
        context: window,
        backend: HTML5Backend
    };

    model = null;

    getModel() {
        return this.model;
    }

    saveModel = model => {
        this.model = model;
    };

    render() {
        const { backend, context, ...props } = this.props;

        return (
            <DndProvider backend={backend} context={context}>
                <Model {...props} ref={this.saveModel} />
            </DndProvider>
        );
    }
}
