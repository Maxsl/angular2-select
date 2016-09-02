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
var style_1 = require('./style');
var diacritics_service_1 = require('./diacritics.service');
var SelectDropdownComponent = (function () {
    function SelectDropdownComponent(diacriticsService) {
        this.diacriticsService = diacriticsService;
        this.MSG_LOADING = 'Searching...';
        this.MSG_NOT_FOUND = 'No results found';
        this.S2 = 'select2';
        this.S2_RESULTS = this.S2 + '-results';
        this.S2_MSG = this.S2_RESULTS + '__message';
        this.S2_OPTIONS = this.S2_RESULTS + '__options';
        this.S2_OPTION = this.S2_RESULTS + '__option';
        this.S2_OPTION_HL = this.S2_OPTION + '--highlighted';
        this.close = new core_1.EventEmitter();
        this.toggleSelect = new core_1.EventEmitter();
        this.optionValuesFiltered = [];
        this._highlighted = null;
        this.KEYS = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            UP: 38,
            DOWN: 40
        };
    }
    SelectDropdownComponent.prototype.ngOnInit = function () {
        this.init();
    };
    SelectDropdownComponent.prototype.ngOnChanges = function (changes) {
        this.init();
    };
    SelectDropdownComponent.prototype.ngAfterViewInit = function () {
        if (!this.multiple) {
            this.input.nativeElement.focus();
        }
    };
    SelectDropdownComponent.prototype.onInputClick = function (event) {
        event.stopPropagation();
    };
    SelectDropdownComponent.prototype.onOptionsMouseMove = function (event) {
        var v = event.target.dataset.value;
        if (typeof v !== 'undefined') {
            this.highlight(v);
        }
    };
    SelectDropdownComponent.prototype.onOptionsWheel = function (event) {
        this.handleOptionsWheel(event);
    };
    SelectDropdownComponent.prototype.onOptionsClick = function (event) {
        this.toggleSelect.emit(event.target.dataset.value);
    };
    SelectDropdownComponent.prototype.onKeydown = function (event) {
        this.handleKeyDown(event);
    };
    SelectDropdownComponent.prototype.onInput = function (event) {
        this.filter(event.target.value);
    };
    SelectDropdownComponent.prototype.init = function () {
        this.optionValuesFiltered = this.optionValues;
        this.initHighlight();
    };
    Object.defineProperty(SelectDropdownComponent.prototype, "highlighted", {
        get: function () {
            return this._highlighted;
        },
        enumerable: true,
        configurable: true
    });
    SelectDropdownComponent.prototype.initHighlight = function () {
        this._highlighted = this.selection.length > 0 ?
            this.selection[0] : this.optionsDict[this.optionValues[0]];
    };
    SelectDropdownComponent.prototype.highlight = function (optionValue) {
        if (this.highlighted === null ||
            optionValue !== this.highlighted.value) {
            this._highlighted = this.optionsDict[optionValue];
        }
    };
    SelectDropdownComponent.prototype.ensureHighlightedVisible = function () {
        var list = this.optionsList.nativeElement;
        var listHeight = list.offsetHeight;
        var itemIndex = this.highlightIndex();
        var item = list.children[itemIndex];
        var itemHeight = item.offsetHeight;
        var itemTop = itemIndex * itemHeight;
        var itemBottom = itemTop + itemHeight;
        var viewTop = list.scrollTop;
        var viewBottom = viewTop + listHeight;
        if (itemBottom > viewBottom) {
            list.scrollTop = itemBottom - listHeight;
        }
        else if (itemTop < viewTop) {
            list.scrollTop = itemTop;
        }
    };
    SelectDropdownComponent.prototype.highlightIndex = function () {
        if (this.highlighted === null) {
            return null;
        }
        return this.filteredOptionsIndex(this.highlighted.value);
    };
    SelectDropdownComponent.prototype.filter = function (term) {
        if (term.trim() === '') {
            this.optionValuesFiltered = this.optionValues;
        }
        var filtered = this.optionValues.slice(0);
        for (var i = this.optionValues.length - 1; i >= 0; i--) {
            var label = this.optionsDict[this.optionValues[i]].label;
            var a = this.diacriticsService.stripDiacritics(label).toUpperCase();
            var b = this.diacriticsService.stripDiacritics(term).toUpperCase();
            if (a.indexOf(b) === -1) {
                filtered.splice(i, 1);
            }
        }
        this.optionValuesFiltered = filtered;
        if (this.optionValuesFiltered.length > 0) {
            this._highlighted = this.optionsDict[this.optionValuesFiltered[0]];
        }
        else {
            this._highlighted = null;
        }
    };
    SelectDropdownComponent.prototype.handleKeyDown = function (event) {
        var key = event.which;
        if (key === this.KEYS.ESC || key === this.KEYS.TAB ||
            (key === this.KEYS.UP && event.altKey)) {
            this.close.emit(true);
            event.preventDefault();
        }
        else if (key === this.KEYS.ENTER) {
            if (this.highlighted !== null) {
                this.toggleSelect.emit(this.highlighted.value);
                this.close.emit(true);
            }
            event.preventDefault();
        }
        else if (key === this.KEYS.UP) {
            this.highlightPrevious();
            event.preventDefault();
        }
        else if (key === this.KEYS.DOWN) {
            this.highlightNext();
            event.preventDefault();
        }
    };
    SelectDropdownComponent.prototype.handleOptionsWheel = function (event) {
        var element = this.optionsList.nativeElement;
        var top = element.scrollTop;
        var bottom = (element.scrollHeight - top) - element.offsetHeight;
        var isAtTop = event.deltaY < 0 && top + event.deltaY <= 0;
        var isAtBottom = event.deltaY > 0 && bottom - event.deltaY <= 0;
        if (isAtTop) {
            element.scrollTop = 0;
            event.preventDefault();
            event.stopPropagation();
        }
        else if (isAtBottom) {
            element.scrollTop = element.scrollHeight - element.offsetHeight;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    SelectDropdownComponent.prototype.highlightPrevious = function () {
        var i = this.highlightIndex();
        if (i !== null && i > 0) {
            this.highlight(this.optionValuesFiltered[i - 1]);
            this.ensureHighlightedVisible();
        }
    };
    SelectDropdownComponent.prototype.highlightNext = function () {
        var i = this.highlightIndex();
        if (i !== null && i < this.optionValuesFiltered.length - 1) {
            this.highlight(this.optionValuesFiltered[i + 1]);
            this.ensureHighlightedVisible();
        }
    };
    SelectDropdownComponent.prototype.getOptionClass = function (optionValue) {
        var result = {};
        var hlValue = this.highlighted === null ? '' : this.highlighted.value;
        result[this.S2_OPTION] = true;
        result[this.S2_OPTION_HL] = optionValue === hlValue;
        result[this.S2_MSG] = optionValue === null;
        return result;
    };
    SelectDropdownComponent.prototype.filteredOptionsIndex = function (optionValue) {
        for (var i = 0; i < this.optionValuesFiltered.length; i++) {
            if (this.optionValuesFiltered[i] === optionValue) {
                return i;
            }
        }
        return null;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectDropdownComponent.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectDropdownComponent.prototype, "optionValues", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SelectDropdownComponent.prototype, "optionsDict", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectDropdownComponent.prototype, "selection", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SelectDropdownComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SelectDropdownComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SelectDropdownComponent.prototype, "left", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SelectDropdownComponent.prototype, "close", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SelectDropdownComponent.prototype, "toggleSelect", void 0);
    __decorate([
        core_1.ViewChild('input'), 
        __metadata('design:type', Object)
    ], SelectDropdownComponent.prototype, "input", void 0);
    __decorate([
        core_1.ViewChild('optionsList'), 
        __metadata('design:type', Object)
    ], SelectDropdownComponent.prototype, "optionsList", void 0);
    SelectDropdownComponent = __decorate([
        core_1.Component({
            selector: 'select-dropdown',
            template: "\n<span class=\"select2-container select2-container--default select2-container--open\"\n    [ngStyle]=\"{position: 'absolute', top: top + 'px', left: left + 'px'}\">\n    <span class=\"select2-dropdown select2-dropdown--below\"\n        [ngStyle]=\"{width: width + 'px'}\">\n        <span class=\"select2-search select2-search--dropdown\"\n            *ngIf=\"!multiple\">\n            <input class=\"select2-search__field\"\n                #input\n                (input)=\"onInput($event)\"\n                (keydown)=\"onKeydown($event)\"\n                (click)=\"onInputClick($event)\">\n        </span>\n        <span class=\"select2-results\">\n            <ul class=\"select2-results__options\"\n                #optionsList\n                (mousemove)=\"onOptionsMouseMove($event)\"\n                (wheel)=\"onOptionsWheel($event)\"\n                (click)=\"onOptionsClick($event)\">\n                <li\n                    *ngFor=\"let optionValue of optionValuesFiltered;\"\n                    [attr.aria-selected]=\"optionsDict[optionValue].selected\"\n                    [ngClass]=\"getOptionClass(optionValue)\"\n                    [attr.data-value]=\"optionValue\">\n                    {{optionsDict[optionValue].label}}\n                </li>\n                <li \n                    *ngIf=\"optionValuesFiltered.length === 0\"\n                    [ngClass]=\"getOptionClass(null)\">\n                    {{MSG_NOT_FOUND}}\n                </li>\n            </ul>\n        </span>\n    </span>\n</span>\n",
            styles: [
                style_1.DEFAULT_STYLES
            ]
        }), 
        __metadata('design:paramtypes', [diacritics_service_1.DiacriticsService])
    ], SelectDropdownComponent);
    return SelectDropdownComponent;
}());
exports.SelectDropdownComponent = SelectDropdownComponent;
//# sourceMappingURL=select-dropdown.component.js.map