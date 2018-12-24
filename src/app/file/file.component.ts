import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  AfterContentInit,
  ViewChild,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {TextService} from '../text-service/text.service';

import {fromEvent, Subscription} from 'rxjs';
import {SynonymService} from '../synonym-service/synonym.service';
import {CaretPosition} from '../shared/caret-position';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FileComponent implements OnInit, AfterContentInit, OnDestroy {

  public placeholder = 'Enter text here...';
  public hidePlaceholder = false;

  private lastCaretPosition: CaretPosition;
  private subscription: Subscription[] = [];

  @ViewChild('editor') editor: ElementRef;

  constructor(
    private textService: TextService,
    private synonymService: SynonymService,
    private changeDetRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    // set caret position value by default
    this.lastCaretPosition = {
      container: this.editor.nativeElement,
      offset: 0
    };
    // Observe control panel button's events
    this.subscription.push(this.textService.getCommandAction()
      .subscribe((value => {
        if (value === 'indent') {
          this.togglePlaceholder(value);
        }
        this.onEditorFocus();
        this.textService.execCommand(value);
      })));
    // Observe synonym component
    this.subscription.push(this.synonymService.getSelectedWordEvent()
      .subscribe((value) => {
        this.togglePlaceholder(value);
        this.insertSelectedWord(value);
      }));
    // Observe keyboard event
    fromEvent( this.editor.nativeElement, 'keyup')
      .subscribe((event: KeyboardEvent) => {
        this.onChange(event);
      }, (error) => { throw error; });
  }

  onChange(event: KeyboardEvent): void {
    // toggle placeholder
    this.togglePlaceholder(event.currentTarget['innerHTML']);
    // execute command check btns state
    this.execute();
  }

  insertSelectedWord(word: string): void {
    this.onEditorFocus();
    this.textService.setSelectionRangeToSearchWord(this.editor.nativeElement, this.lastCaretPosition);
    this.textService.execCommand('insertText', word);
  }

  togglePlaceholder(html: string): void {
    if ((!html || html === '<br>' || html === '') === this.hidePlaceholder) {
      this.hidePlaceholder = !!html;
      this.changeDetRef.markForCheck();
    }
  }

  // component handlers:
  onEditorFocus(): void {
    this.editor.nativeElement.focus();
  }

  onBlur(): void {
    this.lastCaretPosition = this.textService.getCaretPosition(this.editor.nativeElement);
  }

  execute(): void {
    this.textService.triggerButtons();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

}
