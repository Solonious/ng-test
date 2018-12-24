import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { CaretPosition } from '../shared/caret-position';

@Injectable()
export class TextService {
  constructor(@Inject(DOCUMENT) private doc: HTMLDocument) {}

  private eventSource = new BehaviorSubject('');
  private commandAction = this.eventSource.asObservable();

  changeEvent(eventType: string, element?: HTMLButtonElement): void {
    if (element) {
      this.triggerButtonState(element);
    }
    this.eventSource.next(eventType);
  }

  execCommand(command: string, value?: string): void {
    this.doc.execCommand(command, false, value);
  }

  insertColor(color: string, where: string): void {
      if (where === 'textColor') {
        this.doc.execCommand('foreColor', false, color);
      }
  }

  triggerButtonState(node: HTMLButtonElement): void {
      node.classList.toggle('active');
  }

  triggerButtons(): void {
    const btns = this.doc.getElementsByTagName('button');
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].name && this.doc.queryCommandState(btns[i].name)) {
          btns[i].classList.add('active');
        } else {
          btns[i].classList.remove('active');
        }
      }
  }

  getCaretPosition(element: HTMLElement): CaretPosition {
    const _range = this.doc.getSelection().getRangeAt(0);
    const range = _range.cloneRange();
    range.selectNodeContents(element);
    range.setEnd(_range.endContainer, _range.endOffset);
    return {
      offset: _range.endOffset,
      container: range.endContainer
    };
  }

  getCommandAction(): Observable<string> {
    return this.commandAction;
  }

  setSelectionRangeToSearchWord(element: HTMLElement, caretPosition: CaretPosition): void {
    const range = document.createRange();
    const sel = window.getSelection();
    if (caretPosition) {
      range.setStart(caretPosition.container, caretPosition.offset);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

}
