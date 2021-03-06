
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _reactDnd = require("react-dnd");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _withComponentHooks = _interopRequireDefault(require("with-component-hooks"));

var _invariant = _interopRequireDefault(require("invariant"));

var _constants = require("./constants");

var _ModelContext = _interopRequireDefault(require("./ModelContext"));

var _DragState = _interopRequireDefault(require("./DragState"));

var DropContainer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(DropContainer, _React$Component);

  function DropContainer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_connectDropTarget", null);
    return _this;
  }

  var _proto = DropContainer.prototype;

  _proto.connectDropTarget = function connectDropTarget() {
    var children = this.props.children;
    if (!children || typeof children === "function") return;
    var dom = (0, _reactDom.findDOMNode)(this);

    this._connectDropTarget(dom);
  };

  _proto.componentDidMount = function componentDidMount() {
    //TODO: 后续提示_connectDropTarget是否被未被调用 DropItem WidgetItem 同样提示
    this.connectDropTarget();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    //TODO: 后续提示_connectDropTarget是否被未被调用
    this.connectDropTarget();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this._connectDropTarget(null);
  };

  _proto.getModel = function getModel() {
    return this.context.model;
  };

  _proto.getDropOptions = function getDropOptions() {
    var _this2 = this;

    var _this$props = this.props,
        _this$props$id = _this$props.id,
        id = _this$props$id === void 0 ? null : _this$props$id,
        _hover = _this$props.hover,
        _canDrop = _this$props.canDrop,
        _drop = _this$props.drop,
        accepts = _this$props.accepts;
    var targetDOM = (0, _reactDom.findDOMNode)(this);
    var model = this.getModel(); // const DropContainerContext = model.DropContainerContext;
    // const { isRootContainer } = React.useContext(DropContainerContext);

    var commitAction = model.props.commitAction;
    return {
      accept: [model.getScope()].concat(accepts),
      canDrop: function canDrop(dragResult, monitor) {
        var ret = !model.contains(dragResult.item, model.getItem(id));

        if (ret && _canDrop) {
          ret = _canDrop((0, _extends2.default)({}, dragResult, {
            component: _this2,
            monitor: monitor,
            model: model
          }));
        }

        return ret;
      },
      hover: function hover(dragResult, monitor) {
        var canDrop = monitor.canDrop();

        if (_hover) {
          _hover((0, _extends2.default)({}, dragResult, {
            component: _this2,
            monitor: monitor,
            model: model
          }));
        }

        var isStrictlyOver = monitor.isOver({
          shallow: true
        });
        if (!isStrictlyOver) return;

        _DragState.default.setState({
          canDrop: monitor.canDrop(),
          hoverContainerId: id,
          hoverItem: undefined,
          hoverDirection: _constants.DRAG_DIR_NONE
        });

        if (canDrop) {
          if (commitAction === _constants.COMMIT_ACTION_AUTO) {
            model.updateItemPid(dragResult.item, id);
          }
        }

        var e = (0, _extends2.default)({
          target: id,
          targetDOM: targetDOM,
          monitor: monitor,
          component: _this2,
          model: model
        }, dragResult);
        model.fireEvent("onDragHoverContainer", e);
        model.fireEvent("onDragHover", e);
      },
      drop: function drop(dragResult, monitor) {
        _DragState.default.reset();

        if (_drop) {
          _drop((0, _extends2.default)({}, dragResult, {
            component: _this2,
            monitor: monitor,
            model: model
          }));
        } // //在根节点统一commit时会出现问题，当根节点canDrop返回false时导致无法提交
        // if (isRootContainer) {
        //     const isTmpItem = model.isTmpItem(dragResult.item);
        //     model.fireEvent("onDrop", {
        //         target: id,
        //         targetDOM,
        //         type: isTmpItem ? EVENT_TYPE_ADD : EVENT_TYPE_SORT,
        //         ...dragResult
        //     });
        //     if (commitAction === COMMIT_ACTION_AUTO) {
        //         model.commitItem(dragResult.item);
        //     } else if (commitAction === COMMIT_ACTION_DROP) {
        //         model.commitDragStateItem();
        //     }
        // }


        if (!monitor.didDrop()) {
          if (commitAction === _constants.COMMIT_ACTION_AUTO) {
            model.commitItem(dragResult.item);
          } else if (commitAction === _constants.COMMIT_ACTION_DROP) {
            model.commitDragStateItem();
          }

          var _DragState$getState = _DragState.default.getState(),
              isNew = _DragState$getState.isNew; // const isTmpItem = model.isTmpItem(dragResult.item);


          var e = (0, _extends2.default)({
            target: id,
            targetDOM: targetDOM,
            type: isNew ? _constants.EVENT_TYPE_ADD : _constants.EVENT_TYPE_SORT,
            monitor: monitor,
            component: _this2,
            model: model
          }, dragResult);
          model.fireEvent("onDropToContainer", e);
          model.fireEvent("onDrop", e);
        }
      },
      collect: function collect(monitor) {
        return {
          monitor: monitor,
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver(),
          isStrictlyOver: monitor.isOver({
            shallow: true
          })
        };
      }
    };
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        id = _this$props2.id,
        children = _this$props2.children,
        render = _this$props2.render,
        axis = _this$props2.axis;
    var model = this.getModel();
    var DropContainerContext = model.DropContainerContext;

    var _React$useContext = _react.default.useContext(DropContainerContext),
        isRootContainer = _React$useContext.isRootContainer;

    !(isRootContainer ? true : id != null) ? process.env.NODE_ENV !== "production" ? (0, _invariant.default)(false, "sub DropContainer id is required.") : invariant(false) : void 0;

    var _useDrop = (0, _reactDnd.useDrop)(this.getDropOptions()),
        collectedProps = _useDrop[0],
        connectDropTarget = _useDrop[1];

    var items = model.getChildren(id);

    if (!collectedProps.isOver) {
      //collectedProps.isStrictlyOver
      items = items.filter(function (item) {
        return !model.isTmpItem(item);
      });
    }

    this._connectDropTarget = connectDropTarget;
    var props = (0, _extends2.default)({}, collectedProps, {
      model: model,
      connectDropTarget: connectDropTarget,
      items: items
    });
    var child = children ? typeof children === "function" ? children(props) : children : render ? render(props) : null;
    return _react.default.createElement(DropContainerContext.Provider, {
      value: {
        isRootContainer: false,
        axis: axis
      }
    }, child);
  };

  return DropContainer;
}(_react.default.Component);

(0, _defineProperty2.default)(DropContainer, "contextType", _ModelContext.default);
(0, _defineProperty2.default)(DropContainer, "defaultProps", {
  id: null,
  accepts: []
});
DropContainer.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.node]),
  axis: _propTypes.default.oneOf([_constants.AXIS_BOTH, _constants.AXIS_HORIZONTAL, _constants.AXIS_VERTICAL]),
  accepts: _propTypes.default.array,
  render: _propTypes.default.func,
  id: _propTypes.default.any,
  canDrop: _propTypes.default.func,
  hover: _propTypes.default.func,
  drop: _propTypes.default.func
} : {};

var _default = (0, _withComponentHooks.default)(DropContainer);

exports.default = _default;