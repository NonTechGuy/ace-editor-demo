//https://www.npmjs.com/package/ace-builds
import {
  AfterViewInit,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewChild,
} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-lucene-ext';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private aceEditor: ace.Ace.Editor;
  title = 'ace-editor-demo';
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  annotations: Array<Object> = [];
  errors: Array<String> = [];

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    //todo I am concerned that this file is online
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    ace.require('ace/ext/language_tools');
    this.aceEditor = ace.edit(this.editor.nativeElement);

    this.aceEditor.session.setValue(
      '<h1>Ace Editor works great in Angular!</h1>'
    );

    this.aceEditor.setOptions({
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
      scrollSpeed: 2, // number: the scroll speed index
      dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default
      dragEnabled: true, // boolean: enable dragging
      focusTimout: 0, // number: the focus delay before focus starts.
      tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse

      // session options
      firstLineNumber: 1, // number: the line number in first line
      overwrite: false, // boolean
      newLineMode: 'auto', // "auto" | "unix" | "windows"
      useWorker: true, // boolean: true if use web worker for loading scripts
      useSoftTabs: true, // boolean: true if we want to use spaces than tabs
      tabSize: 4, // number
      wrap: true, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
      indentedSoftWrap: true, // boolean
      foldStyle: 'markbegin', // enum: 'manual'/'markbegin'/'markbeginend'.
      mode: 'ace/mode/lucene-ext', // string: path to language mode
    });

    this.aceEditor.completers.push({
      getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, [
          { value: 'AND', score: 1000, meta: 'keyword' },
          { value: 'OR', score: 1000, meta: 'keyword' },
          { value: 'AND NOT', score: 1000, meta: 'keyword' },
          { value: 'NEAR', score: 1000, meta: 'keyword' },
          { value: 'AT-LEAST', score: 1000, meta: 'keyword' },
        ]);
      },
    });

    /*this.aceEditor.on('change', () => {
    var err = this.aceEditor.getSession().getAnnotations();
    console.log(err)
    });*/
  }
}
