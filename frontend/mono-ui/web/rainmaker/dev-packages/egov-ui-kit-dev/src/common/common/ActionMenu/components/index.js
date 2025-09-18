"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _components = require("components");

var _actions = require("egov-ui-framework/ui-redux/screen-configuration/actions");

var _actions2 = require("egov-ui-kit/redux/app/actions");

var _commons = require("egov-ui-kit/utils/commons");

var _localStorageUtils = require("egov-ui-kit/utils/localStorageUtils");

var _translationNode = require("egov-ui-kit/utils/translationNode");

var _translationNode2 = _interopRequireDefault(_translationNode);

var _lodash = require("lodash");

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = (0, _defineProperty3.default)({
  // Styles are preserved from the original component
  inputStyle: {
    color: "#ecf0f1 !important",
    marginTop: "0px",
    marginLeft: "-10px"
  },
  fibreIconStyle: {
    height: "21px",
    width: "21px",
    margin: 0,
    position: "relative",
    color: "#ecf0f1"
  },
  inputIconStyle: {
    margin: "0",
    bottom: "15px",
    top: "auto",
    right: "6px",
    color: "#ecf0f1"
  },
  textFieldStyle: {
    height: "auto",
    textIndent: "15px",
    color: "#ecf0f1"
  }
}, "inputStyle", {
  color: window.innerWidth > 768 ? "#ecf0f1" : "#2c3e50",
  bottom: "5px",
  height: "auto",
  paddingLeft: "5px",
  textIndent: "5px",
  marginTop: 0
});

var ActionMenuComp = function (_Component) {
  (0, _inherits3.default)(ActionMenuComp, _Component);

  function ActionMenuComp(props) {
    (0, _classCallCheck3.default)(this, ActionMenuComp);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ActionMenuComp.__proto__ || Object.getPrototypeOf(ActionMenuComp)).call(this, props));

    _this.getTopLevelMenuItems = function (actionList) {
      if (!actionList) return [];
      var topLevelPaths = {};
      actionList.forEach(function (action) {
        if (action.path) {
          var firstLevel = action.path.split(".")[0];
          if (!topLevelPaths[firstLevel]) {
            topLevelPaths[firstLevel] = {
              name: firstLevel,
              path: firstLevel,
              displayName: firstLevel,
              leftIcon: action.leftIcon ? action.leftIcon.split(".")[0] : null
            };
          }
        }
      });
      return Object.values(topLevelPaths);
    };

    _this.hasChildren = function (path) {
      return _this.props.actionListArr.some(function (action) {
        return action.path && action.path.startsWith(path + ".") && action.path !== path;
      });
    };

    _this.getSubmenuItems = function (path) {
      var actionListArr = _this.props.actionListArr;

      if (!actionListArr) return [];
      var submenuItems = [];
      var pathPrefix = path + ".";
      actionListArr.forEach(function (action) {
        if (action.path && action.path.startsWith(pathPrefix)) {
          var remainingPath = action.path.substring(pathPrefix.length);
          var parts = remainingPath.split(".");
          if (parts.length === 1) {
            submenuItems.push({
              name: action.displayName,
              path: action.path,
              displayName: action.displayName,
              navigationURL: action.navigationURL,
              url: action.url,
              leftIcon: action.leftIcon
            });
          } else if (parts.length > 1) {
            var firstPart = parts[0];
            var childPath = path + "." + firstPart;
            if (!submenuItems.some(function (item) {
              return item.path === childPath;
            })) {
              submenuItems.push({
                name: firstPart,
                path: childPath,
                displayName: firstPart,
                leftIcon: action.leftIcon
              });
            }
          }
        }
      });
      return submenuItems;
    };

    _this.fetchLocales = function () {
      var storedModuleList = (0, _localStorageUtils.getStoredModulesList)() ? JSON.parse((0, _localStorageUtils.getStoredModulesList)()) : [];
      if (!storedModuleList.includes((0, _commons.getModuleName)())) {
        storedModuleList.push((0, _commons.getModuleName)());
        (0, _localStorageUtils.setStoredModulesList)(JSON.stringify(storedModuleList));
        (0, _localStorageUtils.setModule)((0, _commons.getModuleName)());
        var tenantId = (0, _localStorageUtils.getTenantId)();
        _this.props.fetchLocalizationLabel((0, _localStorageUtils.getLocale)(), tenantId, tenantId);
      }
    };

    _this.handleChange = function (e) {
      var searchText = e.target.value;
      _this.setState({ searchText: searchText });
      if (searchText.length > 0) {
        var filtered = _this.props.actionListArr.filter(function (action) {
          return action.displayName && action.displayName.toLowerCase().includes(searchText.toLowerCase());
        });
        _this.setState({ filteredActions: filtered });
      } else {
        _this.setState({ filteredActions: null });
      }
    };

    _this.toggleMobileSearch = function () {
      _this.setState(function (prevState) {
        return {
          mobileSearchVisible: !prevState.mobileSearchVisible,
          searchText: prevState.mobileSearchVisible ? "" : prevState.searchText,
          filteredActions: prevState.mobileSearchVisible ? null : prevState.filteredActions
        };
      });
    };

    _this.handleToggleItem = function (itemPath) {
      _this.setState(function (prevState) {
        var currentExpanded = (0, _extends3.default)({}, prevState.expandedItems);
        var isCurrentlyExpanded = !!currentExpanded[itemPath];

        var pathParts = itemPath.split('.');

        // Case 1: The clicked item is currently expanded.
        // Action: Collapse this item and all its children.
        if (isCurrentlyExpanded) {
          var newExpanded = {};
          for (var key in currentExpanded) {
            // Keep an item only if its path does NOT start with the clicked item's path.
            if (!key.startsWith(itemPath)) {
              newExpanded[key] = true;
            }
          }
          return { expandedItems: newExpanded };
        }

        // Case 2: The clicked item is not expanded.
        // Action: Expand it, keeping ancestors open but closing siblings.
        else {
            var _newExpanded = {};

            // If it's a top-level item, it becomes the only expanded item.
            if (pathParts.length === 1) {
              _newExpanded[itemPath] = true;
            }
            // If it's a sub-item:
            else {
                // Keep all ancestors of the clicked item expanded.
                // An ancestor's path is a prefix of the clicked item's path.
                for (var _key in currentExpanded) {
                  if (itemPath.startsWith(_key)) {
                    _newExpanded[_key] = true;
                  }
                }
                // And, of course, expand the clicked item itself.
                _newExpanded[itemPath] = true;
              }

            return { expandedItems: _newExpanded };
          }
      });
    };

    _this.renderAccordionItem = function (item) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      console.log("Items : ===> ", item);
      var expandedItems = _this.state.expandedItems;

      var isExpanded = !!expandedItems[item.path];
      var hasChildren = _this.hasChildren(item.path);
      var itemStyle = { paddingLeft: 15 + level * 20 + "px" };
      var label = item.displayName ? "ACTION_TEST_" + item.displayName.toUpperCase().replace(/[.:-\s/]/g, "_") : "";

      if (item.navigationURL && item.navigationURL !== "newTab") {
        var url = item.navigationURL.startsWith("/") ? item.navigationURL : "/" + item.navigationURL;
        return _react2.default.createElement(
          "li",
          { className: "nav-item", key: item.path },
          _react2.default.createElement(
            _reactRouterDom.Link,
            {
              className: "nav-link",
              style: itemStyle,
              to: url,
              onClick: function onClick(e) {
                if (item.navigationURL === "tradelicence/apply") _this.props.setRequiredDocumentFlag();
                document.title = item.displayName || item.name;
                if (item.navigationURL && item.navigationURL.includes("digit-ui")) {
                  window.location.href = item.navigationURL;
                  e.preventDefault();
                  return;
                }
                _this.props.updateActiveRoute(item.path, item.displayName || item.name);
                _this.props.toggleDrawer && _this.props.toggleDrawer();
              }
            },
            _this.renderLeftIcon(item.leftIcon, item),
            _react2.default.createElement(_translationNode2.default, { label: label, className: "whiteColor" })
          )
        );
      }

      if (item.url) {
        return _react2.default.createElement(
          "li",
          { className: "nav-item", key: item.path },
          _react2.default.createElement(
            "a",
            {
              className: "nav-link",
              style: itemStyle,
              href: item.url,
              target: "_blank",
              rel: "noopener noreferrer",
              onClick: function onClick() {
                (0, _localStorageUtils.localStorageSet)("menuPath", item.path);
                document.title = item.displayName || item.name;
              }
            },
            _this.renderLeftIcon(item.leftIcon, item),
            _react2.default.createElement(_translationNode2.default, { label: label, className: "whiteColor" })
          )
        );
      }

      if (hasChildren) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: item.path },
          _react2.default.createElement(
            "li",
            { className: "nav-item" },
            _react2.default.createElement(
              "div",
              {
                className: "nav-link accordion-toggle " + (isExpanded ? "expanded" : ""),
                style: itemStyle,
                onClick: function onClick() {
                  return _this.handleToggleItem(item.path);
                }
              },
              _this.renderLeftIcon(item.leftIcon, item),
              _react2.default.createElement(_translationNode2.default, { label: label, className: "whiteColor" }),
              _react2.default.createElement(
                "span",
                { className: "menu-arrow " + (isExpanded ? "expanded" : "") },
                "\u25B6"
              )
            )
          ),
          _react2.default.createElement(
            "ul",
            {
              className: "nav flex-column submenu-accordion " + (isExpanded ? "open" : ""),
              style: { padding: 0, margin: 0, listStyle: "none" }
            },
            _this.getSubmenuItems(item.path).map(function (subItem) {
              return _this.renderAccordionItem(subItem, level + 1);
            })
          )
        );
      }

      return _react2.default.createElement(
        "li",
        { className: "nav-item", key: item.path },
        _react2.default.createElement(
          "div",
          { className: "nav-link disabled", style: itemStyle },
          _this.renderLeftIcon(item.leftIcon, item),
          _react2.default.createElement(_translationNode2.default, { label: label, className: "whiteColor" })
        )
      );
    };

    _this.renderSearchResults = function () {
      var _this$state = _this.state,
          filteredActions = _this$state.filteredActions,
          searchText = _this$state.searchText;

      if (!filteredActions || searchText.length === 0) return null;
      return _react2.default.createElement(
        "div",
        { className: "search-results-container" },
        _react2.default.createElement(
          "ul",
          { className: "nav flex-column" },
          filteredActions.map(function (action, index) {
            if (action.navigationURL) {
              var url = action.navigationURL.startsWith("/") ? action.navigationURL : "/" + action.navigationURL;
              return _react2.default.createElement(
                "li",
                { className: "nav-item", key: index },
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  {
                    className: "nav-link",
                    to: url,
                    onClick: function onClick(e) {
                      document.title = action.displayName;
                      if (action.navigationURL && action.navigationURL.includes("digit-ui")) {
                        window.location.href = action.navigationURL;
                        e.preventDefault();
                        return;
                      }
                      _this.props.updateActiveRoute(action.path, action.displayName);
                      _this.props.toggleDrawer && _this.props.toggleDrawer();
                    }
                  },
                  _this.renderLeftIcon(action.leftIcon, action),
                  _react2.default.createElement(_translationNode2.default, {
                    label: action.displayName ? "ACTION_TEST_" + action.displayName.toUpperCase().replace(/[.:-\s/]/g, "_") : "",
                    className: "whiteColor"
                  })
                )
              );
            }
            return null;
          })
        )
      );
    };

    _this.changeRoute = function (route) {
      _this.props.setRoute(route);
    };

    _this.state = {
      searchText: "",
      filteredActions: null,
      mobileSearchVisible: false,
      expandedItems: {}
    };
    return _this;
  }

  (0, _createClass3.default)(ActionMenuComp, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.activeRoutePath !== "null" && this.props.activeRoutePath !== prevProps.activeRoutePath) {
        this.fetchLocales();
        this.setState({ searchText: "" });
      }
    }

    // Handles toggling for a multi-level accordion.

  }, {
    key: "renderLeftIcon",
    value: function renderLeftIcon(leftIcon, item) {
      if (!leftIcon) return null;
      var iconParts = typeof leftIcon === "string" ? leftIcon.split(":") : [];
      if (iconParts.length >= 2) {
        return _react2.default.createElement(_components.Icon, {
          name: iconParts[1],
          action: iconParts[0],
          style: styles.fibreIconStyle,
          className: "iconClassHover left-icon-color material-icons custom-style-for-" + item.name
        });
      }
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var actionListArr = this.props.actionListArr;
      var _state = this.state,
          searchText = _state.searchText,
          filteredActions = _state.filteredActions,
          mobileSearchVisible = _state.mobileSearchVisible;


      if (!actionListArr) return null;

      var topLevelItems = this.getTopLevelMenuItems(actionListArr);
      console.log("Top Level Items : ==> ", topLevelItems);
      const allowedMenus = ["Finance"]
      const filteredTopLevelItems = topLevelItems.filter(item =>
        allowedMenus.includes(item.displayName)
      );
      console.log("Filtered Top Level Items : ",filteredTopLevelItems);
      // const financeChildren = actionListArr.filter(
      //   item => item.path.startsWith("Finance/")  // look in full menu list
      // );

      // console.log("Finance Children: ==> ", financeChildren);

      return _react2.default.createElement(
        "div",
        { className: "sidebar card py-2 mb-4", style: { overflow: 'auto' } },
        _react2.default.createElement(
          "div",
          { className: "mobile-search-toggle", onClick: this.toggleMobileSearch },
          _react2.default.createElement(_components.Icon, { name: "search" })
        ),
        mobileSearchVisible && _react2.default.createElement(
          "div",
          { className: "mobile-search-container" },
          _react2.default.createElement(_components.TextFieldIcon, {
            value: searchText,
            hintText: _react2.default.createElement(_translationNode2.default, { label: "PT_SEARCH_BUTTON", className: "whiteColor" }),
            iconStyle: styles.inputIconStyle,
            inputStyle: (0, _extends3.default)({}, styles.inputStyle, { color: "black" }),
            textFieldStyle: styles.textFieldStyle,
            iconPosition: "before",
            onChange: this.handleChange,
            autoFocus: true
          })
        ),
        !mobileSearchVisible && _react2.default.createElement(
          "div",
          {
            className: "menu-search-container",
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 10 }
          },
          _react2.default.createElement(_components.TextFieldIcon, {
            value: searchText,
            hintText: _react2.default.createElement(_translationNode2.default, { label: "PT_SEARCH_BUTTON", className: "whiteColor" }),
            iconStyle: styles.inputIconStyle,
            inputStyle: styles.inputStyle,
            textFieldStyle: (0, _extends3.default)({}, styles.textFieldStyle, { flex: 1 }),
            iconPosition: "before",
            onChange: this.handleChange
          }),
          _react2.default.createElement(_components.Icon, {
            action: "action",
            name: "home",
            className: "material-icons",
            style: { fontSize: 24, color: "white", cursor: "pointer", marginLeft: 10 },
            title: "Go to Home",
            onClick: function onClick() {
              return window.location.href = "/digit-ui/employee";
            }
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "menu-scroll-container" },
          filteredActions ? this.renderSearchResults() : _react2.default.createElement(
            "ul",
            { className: "nav flex-column main-menu accordion-menu" },
            this.getSubmenuItems("Finance").map((child) => {
             return this.renderAccordionItem(child, 0);
            })
          )
        )
      );
    }
  }]);
  return ActionMenuComp;
}(_react.Component);

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    handleToggle: function handleToggle(showMenu) {
      return dispatch({ type: "MENU_TOGGLE", showMenu: showMenu });
    },
    setRoute: function setRoute(route) {
      return dispatch({ type: "SET_ROUTE", route: route });
    },
    fetchLocalizationLabel: function fetchLocalizationLabel(locale, moduleName, tenantId) {
      return dispatch((0, _actions2.fetchLocalizationLabel)(locale, moduleName, tenantId));
    },
    setRequiredDocumentFlag: function setRequiredDocumentFlag() {
      return dispatch((0, _actions.prepareFinalObject)("isRequiredDocuments", true));
    }
  };
};

exports.default = (0, _reactRedux.connect)(null, mapDispatchToProps)(ActionMenuComp);