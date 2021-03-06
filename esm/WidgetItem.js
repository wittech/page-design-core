
import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from "react";
import { findDOMNode } from "react-dom";
import propTypes from "prop-types";
import { useDrag } from "react-dnd";
import withHooks from "with-component-hooks";
import ModelContext from "./ModelContext";
import { EVENT_TYPE_ADD, EVENT_TYPE_SORT, COMMIT_ACTION_AUTO, COMMIT_ACTION_DROP } from "./constants";
import { isNodeInDocument } from "./utils";
import DragState from "./DragState";

var WidgetItem =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(WidgetItem, _React$Component);

  function WidgetItem() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "_connectDragDOM", null);

    _defineProperty(_assertThisInitialized(_this), "_connectDragTarget", null);

    _defineProperty(_assertThisInitialized(_this), "_connectDragPreview", null);

    return _this;
  }

  var _proto = WidgetItem.prototype;

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.connectDragTarget();
  };

  _proto.componentDidMount = function componentDidMount() {
    this.connectDragTarget();
  };

  _proto.getModel = function getModel() {
    return this.context.model;
  };

  _proto.connectDragTarget = function connectDragTarget() {
    var children = this.props.children;
    if (!children || typeof children === "function") return;

    this._connectDragTarget(findDOMNode(this));
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    //fix: 当拖动节点在拖动状态被删除时导致react-dnd在drop后需要移动鼠标才及时触发endDrag问题
    var dragDOM = this._connectDragDOM;
    var dragState = DragState.getState();

    if (dragState.isDragging && dragDOM && dragState.dragDOM === dragDOM) {
      DragState.setState({
        dragDOMIsRemove: true
      });
      setTimeout(function () {
        if (isNodeInDocument(dragDOM)) return;
        dragDOM.style.display = "none";
        dragDOM.style.width = "0px";
        dragDOM.style.height = "0px";
        dragDOM.style.overflow = "hidden";
        document.body.appendChild(dragDOM);
      }, 0);
    }

    this._connectDragTarget(null);

    this._connectDragPreview(null);
  };

  _proto.getDragOptions = function getDragOptions() {
    var _this2 = this;

    var _this$props = this.props,
        getInstance = _this$props.getInstance,
        _canDrag = _this$props.canDrag,
        beginDrag = _this$props.beginDrag,
        endDrag = _this$props.endDrag;
    var model = this.getModel();
    var commitAction = model.props.commitAction;
    return {
      item: {
        type: model.getScope()
      },
      canDrag: function canDrag(monitor) {
        if (_canDrag) {
          return _canDrag({
            monitor: monitor,
            model: model,
            component: _this2
          });
        }

        return true;
      },
      begin: function begin(monitor) {
        var item = getInstance();
        var dom = findDOMNode(_this2);

        if (beginDrag) {
          beginDrag({
            item: item,
            dom: dom,
            component: _this2,
            monitor: monitor,
            model: model
          });
        }

        var dragDOM = _this2._connectDragDOM;
        DragState.setState({
          item: item,
          isNew: true,
          dragDOMIsRemove: false,
          isDragging: true,
          dragDOM: dragDOM
        });

        if (commitAction === COMMIT_ACTION_AUTO) {
          model.addTmpItem(item);
        }

        model.fireEvent("onDragStart", {
          item: item,
          dom: dom,
          type: EVENT_TYPE_ADD,
          model: model,
          monitor: monitor,
          component: _this2
        });
        return {
          item: item,
          dom: dom
        };
      },
      end: function end(dragResult, monitor) {
        var _DragState$getState = DragState.getState(),
            dragDOMIsRemove = _DragState$getState.dragDOMIsRemove,
            dragDOM = _DragState$getState.dragDOM;

        DragState.reset();

        if (dragDOMIsRemove && dragDOM && dragDOM.parentNode) {
          dragDOM.parentNode.removeChild(dragDOM);
        }

        if (endDrag) {
          endDrag(_extends({}, dragResult, {
            model: model,
            monitor: monitor,
            component: _this2
          }));
        }

        model.clearTmpItems();
        model.fireEvent("onDragEnd", _extends({}, dragResult, {
          type: EVENT_TYPE_ADD,
          model: model,
          monitor: monitor,
          component: _this2
        }));
      },
      collect: function collect(monitor) {
        return {
          monitor: monitor,
          isDragging: monitor.isDragging()
        };
      }
    };
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$props2 = this.props,
        children = _this$props2.children,
        render = _this$props2.render;
    var model = this.getModel();

    var _useDrag = useDrag(this.getDragOptions()),
        collectProps = _useDrag[0],
        connectDragTarget = _useDrag[1],
        connectDragPreview = _useDrag[2];

    this._connectDragTarget = React.useCallback(function (dom) {
      _this3._connectDragDOM = dom;
      connectDragTarget(dom);
    }, [connectDragTarget]);
    this._connectDragPreview = connectDragPreview;

    var props = _extends({}, collectProps, {
      model: model,
      connectDragTarget: connectDragTarget,
      connectDragPreview: connectDragPreview
    });

    return children ? typeof children === "function" ? children(props) : children : render ? render(props) : null;
  };

  return WidgetItem;
}(React.Component);

_defineProperty(WidgetItem, "contextType", ModelContext);

WidgetItem.propTypes = process.env.NODE_ENV !== "production" ? {
  children: propTypes.oneOfType([propTypes.func, propTypes.node]),
  render: propTypes.func,
  getInstance: propTypes.func.isRequired,
  canDrag: propTypes.func,
  beginDrag: propTypes.func,
  endDrag: propTypes.func
} : {};
export default withHooks(WidgetItem);