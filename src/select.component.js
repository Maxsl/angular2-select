"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var style_1 = require('./style');
var select_dropdown_component_1 = require('./select-dropdown.component');
exports.SELECT_VALUE_ACCESSOR = new core_1.Provider(forms_1.NG_VALUE_ACCESSOR, {
    useExisting: core_1.forwardRef(function () { return SelectComponent; }),
    multi: true
});
var SelectComponent = (function () {
    function SelectComponent() {
        this.S2 = 'select2';
        this.S2_CONTAINER = this.S2 + '-container';
        this.S2_SELECTION = this.S2 + '-selection';
        this.onClick = new core_1.EventEmitter();
        this.onValueSelected = new core_1.EventEmitter();
        this.isDisabled = false;
        this.isBelow = true;
        this.isOpen = false;
        this.hasFocus = false;
        this.optionValues = [];
        this.optionsDict = {};
        this.selection = [];
        this.value = [];
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.KEYS = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            UP: 38,
            DOWN: 40
        };
    }
    SelectComponent.prototype.ngOnInit = function () {
        this.init();
    };
    SelectComponent.prototype.ngOnChanges = function (changes) {
        this.init();
    };
    SelectComponent.prototype.onSelectionClick = function (event) {
        this.toggleDropdown();
        if (this.multiple) {
            this.searchInput.nativeElement.focus();
        }
        event.stopPropagation();
        this.onClick.emit({
            value: 'click'
        });
    };
    SelectComponent.prototype.onClearAllClick = function (event) {
        this.clearSelected();
        event.stopPropagation();
    };
    SelectComponent.prototype.onClearItemClick = function (event) {
        this.deselect(event.target.dataset.value);
        event.stopPropagation();
    };
    SelectComponent.prototype.onToggleSelect = function (optionValue) {
        this.toggleSelect(optionValue);
    };
    SelectComponent.prototype.onClose = function (focus) {
        this.close(focus);
    };
    SelectComponent.prototype.onWindowClick = function () {
        this.close(false);
    };
    SelectComponent.prototype.onWindowResize = function () {
        this.updateWidth();
    };
    SelectComponent.prototype.onKeydown = function (event) {
        this.handleKeyDown(event);
    };
    SelectComponent.prototype.onInput = function (event) {
        var _this = this;
        if (!this.isOpen) {
            this.open();
            setTimeout(function () {
                _this.handleInput(event);
            }, 100);
        }
        else {
            this.handleInput(event);
        }
    };
    SelectComponent.prototype.onSearchKeydown = function (event) {
        this.handleSearchKeyDown(event);
    };
    SelectComponent.prototype.init = function () {
        this.initOptions();
        this.initDefaults();
    };
    SelectComponent.prototype.initOptions = function () {
        var values = [];
        var opts = {};
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            opts[option.value] = {
                value: option.value,
                label: option.label,
                selected: false
            };
            values.push(option.value);
        }
        this.optionValues = values;
        this.optionsDict = opts;
    };
    SelectComponent.prototype.initDefaults = function () {
        if (typeof this.multiple === 'undefined') {
            this.multiple = false;
        }
        if (typeof this.theme === 'undefined') {
            this.theme = 'default';
        }
        if (typeof this.allowClear === 'undefined') {
            this.allowClear = false;
        }
    };
    SelectComponent.prototype.toggleDropdown = function () {
        if (!this.isDisabled) {
            this.isOpen ? this.close(true) : this.open();
        }
    };
    SelectComponent.prototype.open = function () {
        this.updateWidth();
        this.updatePosition();
        this.isOpen = true;
    };
    SelectComponent.prototype.close = function (focus) {
        this.isOpen = false;
        if (focus) {
            this.focus();
        }
    };
    SelectComponent.prototype.toggleSelect = function (value) {
        if (!this.multiple && this.selection.length > 0) {
            this.selection[0].selected = false;
        }
        this.optionsDict[value].selected = !this.optionsDict[value].selected;
        this.updateSelection();
        if (this.multiple) {
            this.searchInput.nativeElement.value = '';
            this.searchInput.nativeElement.focus();
        }
        else {
            this.focus();
        }
    };
    SelectComponent.prototype.deselect = function (value) {
        this.optionsDict[value].selected = false;
        this.updateSelection();
    };
    SelectComponent.prototype.updateSelection = function () {
        var s = [];
        var v = [];
        for (var _i = 0, _a = this.optionValues; _i < _a.length; _i++) {
            var optionValue = _a[_i];
            if (this.optionsDict[optionValue].selected) {
                var opt = this.optionsDict[optionValue];
                s.push(opt);
                v.push(opt.value);
            }
        }
        this.selection = s;
        this.value = v;
        this.onChange(this.getOutputValue());
    };
    SelectComponent.prototype.popSelect = function () {
        if (this.selection.length > 0) {
            this.selection[this.selection.length - 1].selected = false;
            this.updateSelection();
            this.onChange(this.getOutputValue());
        }
    };
    SelectComponent.prototype.clearSelected = function () {
        for (var item in this.optionsDict) {
            this.optionsDict[item].selected = false;
        }
        this.selection = [];
        this.value = [];
        this.onChange(this.getOutputValue());
    };
    SelectComponent.prototype.getOutputValue = function () {
        if (this.multiple) {
            return this.value.slice(0);
        }
        else {
            return this.value.length === 0 ? '' : this.value[0];
        }
    };
    SelectComponent.prototype.writeValue = function (value) {
        if (typeof value === 'undefined' || value === null) {
            value = [];
        }
        this.value = value;
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var optionValue = value_1[_i];
            var option = this.optionsDict[optionValue];
            option.selected = true;
            this.selection.push(option);
        }
    };
    SelectComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    SelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    SelectComponent.prototype.handleKeyDown = function (event) {
        var key = event.which;
        if (key === this.KEYS.ENTER || key === this.KEYS.SPACE ||
            (key === this.KEYS.DOWN && event.altKey)) {
            this.open();
            event.preventDefault();
        }
    };
    SelectComponent.prototype.handleInput = function (event) {
        this.dropdown.filter(event.target.value);
    };
    SelectComponent.prototype.handleSearchKeyDown = function (event) {
        var key = event.which;
        if (key === this.KEYS.ENTER) {
            if (typeof this.dropdown !== 'undefined') {
                var hl = this.dropdown.highlighted;
                if (hl !== null) {
                    this.onToggleSelect(hl.value);
                }
            }
        }
        else if (key === this.KEYS.BACKSPACE) {
            if (this.searchInput.nativeElement.value === '') {
                this.popSelect();
            }
        }
        else if (key === this.KEYS.UP) {
            if (typeof this.dropdown === 'undefined') {
                this.open();
            }
            else {
                this.dropdown.highlightPrevious();
            }
        }
        else if (key === this.KEYS.DOWN) {
            if (typeof this.dropdown === 'undefined') {
                this.open();
            }
            else {
                this.dropdown.highlightNext();
            }
        }
        else if (key === this.KEYS.ESC) {
            this.close(true);
        }
    };
    SelectComponent.prototype.focus = function () {
        this.hasFocus = true;
        if (this.multiple) {
            this.searchInput.nativeElement.focus();
        }
        else {
            this.selectionSpan.nativeElement.focus();
        }
    };
    SelectComponent.prototype.blur = function () {
        this.hasFocus = false;
        this.selectionSpan.nativeElement.blur();
    };
    SelectComponent.prototype.updateWidth = function () {
        this.width = this.container.nativeElement.offsetWidth;
    };
    SelectComponent.prototype.updatePosition = function () {
        var e = this.container.nativeElement;
        this.left = e.offsetLeft;
        this.top = e.offsetTop + e.offsetHeight;
    };
    SelectComponent.prototype.getContainerClass = function () {
        var result = {};
        result[this.S2] = true;
        var c = this.S2_CONTAINER;
        result[c] = true;
        result[c + '--open'] = this.isOpen;
        result[c + '--focus'] = this.hasFocus;
        result[c + '--' + this.theme] = true;
        result[c + '--' + (this.isBelow ? 'below' : 'above')] = true;
        return result;
    };
    SelectComponent.prototype.getSelectionClass = function () {
        var result = {};
        var s = this.S2_SELECTION;
        result[s] = true;
        result[s + '--' + (this.multiple ? 'multiple' : 'single')] = true;
        return result;
    };
    SelectComponent.prototype.showPlaceholder = function () {
        return typeof this.placeholder !== 'undefined' &&
            this.selection.length === 0;
    };
    SelectComponent.prototype.getPlaceholder = function () {
        return this.showPlaceholder() ? this.placeholder : '';
    };
    SelectComponent.prototype.getInputStyle = function () {
        var width;
        if (typeof this.searchInput === 'undefined') {
            width = 200;
        }
        else if (this.showPlaceholder() &&
            this.searchInput.nativeElement.value.length === 0) {
            width = 10 + 10 * this.placeholder.length;
        }
        else {
            width = 10 + 10 * this.searchInput.nativeElement.value.length;
        }
        return {
            'width': width + 'px'
        };
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "theme", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectComponent.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectComponent.prototype, "allowClear", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectComponent.prototype, "onClick", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectComponent.prototype, "onValueSelected", void 0);
    __decorate([
        core_1.ViewChild('container'), 
        __metadata('design:type', Object)
    ], SelectComponent.prototype, "container", void 0);
    __decorate([
        core_1.ViewChild('selectionSpan'), 
        __metadata('design:type', Object)
    ], SelectComponent.prototype, "selectionSpan", void 0);
    __decorate([
        core_1.ViewChild('dropdown'), 
        __metadata('design:type', select_dropdown_component_1.SelectDropdownComponent)
    ], SelectComponent.prototype, "dropdown", void 0);
    __decorate([
        core_1.ViewChild('searchInput'), 
        __metadata('design:type', Object)
    ], SelectComponent.prototype, "searchInput", void 0);
    SelectComponent = __decorate([
        core_1.Component({
            selector: 'ng-select',
            template: "\n<div style=\"width:100%;position:relative;\">\n    <span style=\"width:100%\"\n        #container\n        [ngClass]=\"getContainerClass()\"\n        (window:resize)=\"onWindowResize()\"\n        (window:click)=\"onWindowClick()\">\n        <span class=\"selection\">\n            <span tabindex=0\n                #selectionSpan\n                [ngClass]=\"getSelectionClass()\"\n                (click)=\"onSelectionClick($event)\"\n                (keydown)=\"onKeydown($event)\">\n\n                <span class=\"select2-selection__rendered\"\n                    *ngIf=\"!multiple\">\n                    <span class=\"select2-selection__placeholder\">\n                        {{getPlaceholder()}}\n                    </span>\n                </span>\n\n                <span class=\"select2-selection__rendered\"\n                    *ngIf=\"!multiple && selection.length > 0\">\n                    <span class=\"select2-selection__clear\"\n                        *ngIf=\"allowClear\"\n                        (click)=\"onClearAllClick($event)\">\n                        x\n                    </span>\n                    {{selection[0].label}}\n                </span>\n\n                <ul class=\"select2-selection__rendered\"\n                    *ngIf=\"multiple\">\n                    <li class=\"select2-selection__choice\" title=\"{{option.label}}\"\n                        *ngFor=\"let option of selection\">\n                        <span class=\"select2-selection__choice__remove\"\n                            [attr.data-value]=\"option.value\"\n                            (click)=onClearItemClick($event)>\n                            \u00D7</span>\n                        {{option.label}}\n                    </li>\n                    <li class=\"select2-search select2-search--inline\">\n                        <input class=\"select2-search__field\"\n                            #searchInput\n                            placeholder=\"{{getPlaceholder()}}\"\n                            [ngStyle]=\"getInputStyle()\"\n                            (input)=\"onInput($event)\"\n                            (keydown)=\"onSearchKeydown($event)\"/>\n                    </li>\n                </ul>\n\n                <span class=\"select2-selection__arrow\">\n                    <b></b>\n                </span>\n            </span>\n        </span>\n    </span>\n    <select-dropdown\n        *ngIf=\"isOpen\"\n        #dropdown\n        [multiple]=\"multiple\"\n        [optionValues]=\"optionValues\"\n        [optionsDict]=\"optionsDict\"\n        [selection]=\"selection\"\n        [width]=\"width\"\n        [top]=\"top\"\n        [left]=\"left\"\n        (toggleSelect)=\"onToggleSelect($event)\"\n        (close)=\"onClose($event)\">\n    </select-dropdown>\n</div>\n",
            styles: [
                style_1.DEFAULT_STYLES
            ],
            providers: [
                exports.SELECT_VALUE_ACCESSOR
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SelectComponent);
    return SelectComponent;
}());
exports.SelectComponent = SelectComponent;
//# sourceMappingURL=select.component.js.map