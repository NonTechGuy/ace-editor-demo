declare var require: any;
//https://www.npmjs.com/package/ace-builds
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
//import 'ace-builds/src-noconflict/mode-lucene';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
//import 'ace-builds/src-noconflict/mode-boolean-search.js';
import './mode-boolean-search.js';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements AfterViewInit {
  public isValid: Boolean = true;
  public errorMsg: string;
  private _booleanParser: any;
  private _codeEditor: ace.Ace.Editor;
  private _options = {
    // editor options
    selectionStyle: 'line', // "line"|"text"
    highlightActiveLine: true, // boolean
    highlightSelectedWord: true, // boolean
    readOnly: false, // boolean: true if read only
    cursorStyle: 'ace', // "ace"|"slim"|"smooth"|"wide"
    mergeUndoDeltas: true, // false|true|"always"
    behavioursEnabled: true, // boolean: true if enable custom behaviours
    wrapBehavioursEnabled: true, // boolean
    autoScrollEditorIntoView: undefined, // boolean: this is needed if editor is inside scrollable page
    keyboardHandler: null, // function: handle custom keyboard events

    // renderer options
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,

    animatedScroll: false, // boolean: true if scroll should be animated
    displayIndentGuides: false, // boolean: true if the indent should be shown. See 'showInvisibles'
    showInvisibles: false, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
    showPrintMargin: false, // boolean: true if show the vertical print margin
    printMarginColumn: 80, // number: number of columns for vertical print margin
    printMargin: undefined, // boolean | number: showPrintMargin | printMarginColumn
    showGutter: true, // boolean: true if show line gutter
    fadeFoldWidgets: false, // boolean: true if the fold lines should be faded
    showFoldWidgets: true, // boolean: true if the fold lines should be shown ?
    showLineNumbers: true,
    highlightGutterLine: true, // boolean: true if the gutter line should be highlighted
    hScrollBarAlwaysVisible: false, // boolean: true if the horizontal scroll bar should be shown regardless
    vScrollBarAlwaysVisible: false, // boolean: true if the vertical scroll bar should be shown regardless
    fontSize: 12, // number | string: set the font size to this many pixels
    fontFamily: undefined, // string: set the font-family css value
    maxLines: undefined, // number: set the maximum lines possible. This will make the editor height changes
    minLines: undefined, // number: set the minimum lines possible. This will make the editor height changes
    maxPixelHeight: 0, // number -> maxLines: set the maximum height in pixel, when 'maxLines' is defined.
    scrollPastEnd: 0, // number -> !maxLines: if positive, user can scroll pass the last line and go n * editorHeight more distance
    fixedWidthGutter: false, // boolean: true if the gutter should be fixed width
    theme: 'ace/theme/textmate', // theme string from ace/theme or custom?

    // mouseHandler options
    //scrollSpeed: 2, // number: the scroll speed index
    //dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default
    //dragEnabled: true, // boolean: enable dragging
    //focusTimout: 0, // number: the focus delay before focus starts.
    //tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse

    // session options
    firstLineNumber: 1, // number: the line number in first line
    overwrite: false, // boolean
    newLineMode: 'auto', // "auto" | "unix" | "windows"
    //useWorker: true, // boolean: true if use web worker for loading scripts
    useSoftTabs: true, // boolean: true if we want to use spaces than tabs
    tabSize: 4, // number
    wrap: true, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
    indentedSoftWrap: true, // boolean
    foldStyle: 'markbegin', // enum: 'manual'/'markbegin'/'markbeginend'.
    mode: 'ace/mode/boolean-search', // string: path to language mode
  };

  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  @Input() content: string;

  constructor() {}

  ngAfterViewInit(): void {
    this._booleanParser = require('boolean-parser');
    ace.config.set('fontSize', '14px');
    //todo I am concerned that this file is online
    /*ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );*/
    ace.require('ace/ext/language_tools');
    this._codeEditor = ace.edit(this.editor.nativeElement);

    /*this._codeEditor.session.setValue(
      '<h1>Ace Editor works great in Angular!</h1>'
    );*/

    this._codeEditor.setOptions(this._options);

    //AND|AND NOT|OR|OR NOT|NOT|TO|AT-LEAST|NEAR
    /*this._codeEditor.completers.push({
      getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, [
          { value: 'AND', score: 1000, meta: 'keyword' },
          { value: 'AND NOT', score: 1000, meta: 'keyword' },
          { value: 'OR', score: 1000, meta: 'keyword' },
          { value: 'OR NOT', score: 1000, meta: 'keyword' },
          { value: 'NOT', score: 1000, meta: 'keyword' },
          { value: 'TO', score: 1000, meta: 'keyword' },
          { value: 'AT-LEAST', score: 1000, meta: 'keyword' },
          { value: 'NEAR', score: 1000, meta: 'keyword' },
        ]);
      },
    });*/

    this._codeEditor.on('change', () => {
      //var err = this.aceEditor.getSession().getAnnotations();
      this.validate();
      //var myEfficientFn = this.debounce(this.validate, 250);
      //let myVar = setTimeout(this.validate.bind(this), 1000);
    });

    /*let textChange = this.getContent();
    textChange
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => this.validate());*/

    /*const changes = fromEvent(this._codeEditor, 'change');
    const result = changes.pipe(debounce(() => interval(1000)));
    result.subscribe(function () {
      this.validate();
    });*/
  }

  private validate() {
    //console.log('validate');
    const searchPhrase = this.getContent();
    console.log(searchPhrase);
    //limited to AND OR operators
    const parsedQuery = this._booleanParser.parseBooleanQuery(searchPhrase);
    let position: number = 0;
    let cont: boolean = false;

    //rules
    /*let regx = new RegExp(`(AND|AND NOT|OR|OR NOT)\\b`);
    if (regx.test(parsedQuery[0][0])) {
      this.isValid = false;
      this.errorMsg = `Invalid token expecting one of these [NOT, <phrase>, (, OCCURS, AT-LEAST] at position 0`;
      cont = false;
    } else {
      cont = true;
    }*/

    //empty string after operator
    /*if (cont) {
      parsedQuery.forEach((value: string, index: number) => {
        position++;
        this.isValid = value.indexOf('') >= 0 ? false : true;
        this.errorMsg = `Have an empty expression at position ${
          this.getContent().length
        }`;
      });
    }*/

    // brackets
    /*et regx2 = new RegExp(`/\(([^)]+)\)/`);
    if (regx2.test(this.getContent())) {
      console.log('brackets closed');
    } else {
      console.log('brackets open');
    }*/

    // empty code editor
    if (this.getContent() === '') {
      this.isValid = true;
    }

    //console.log(parsedQuery);
  }

  public getContent() {
    let code: string = '';
    if (this._codeEditor) {
      code = this._codeEditor.getValue();
    }
    return code;
  }

  public setContent(content: string): void {
    if (this._codeEditor) {
      this._codeEditor.setValue(content);
    }
  }

  /*public debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }*/
}
