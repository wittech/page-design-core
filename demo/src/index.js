import React from "react";

import { HashRouter, Switch, Route, NavLink, Redirect } from "react-router-dom";

import Basic from "./basic";
import SortList from "./sort-list";
import SortListAnimation from "./sort-list-animation";
import DragLayer from "./drag-layer";

import "./style/index.scss";

export default () => {
    return (
        <HashRouter>
            <div className="app-demo">
                <div className="left-nav">
                    <NavLink to="/basic">基本功能</NavLink>
                    <NavLink to="/sort-list">列表排序</NavLink>
                    <NavLink to="/sort-list-animation">
                        列表排序(动画效果)
                    </NavLink>
                    <NavLink to="/drag-layer">列表排序</NavLink>
                </div>
                <div className="container">
                    <Switch>
                        <Route
                            path="/"
                            exact
                            render={() => <Redirect to="/basic" />}
                        />
                        <Route path="/basic" component={Basic} />
                        <Route path="/sort-list" component={SortList} />
                        <Route
                            path="/sort-list-animation"
                            component={SortListAnimation}
                        />
                        <Route path="/drag-layer" component={DragLayer} />
                    </Switch>
                </div>
            </div>
        </HashRouter>
    );
};
