import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnInit,
  OnDestroy} from '@angular/core';
import {WordList} from '../shared/word-list';
import {SynonymService} from '../synonym-service/synonym.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-synonym',
  templateUrl: './synonym.component.html',
  styleUrls: ['./synonym.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SynonymComponent implements OnInit, OnDestroy {

  public wordList: WordList[] = [];
  public synonymInput = new FormControl('');

  private subscription: Subscription[] = [];

  constructor(
    private synonymService: SynonymService,
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.subscription.push(this.synonymInput.valueChanges
      .subscribe((value: string) => {
      this.synonymService.getSynonymDataObservable(value)
        .subscribe((data) => {
          this.wordList = data;
          this.cd.markForCheck();
        });
    }));
  }

  selectOptionalWord(event): void {
    const word = event.currentTarget.innerText;
    this.synonymService.sendSelectedWord(word);
    this.synonymInput.setValue('');
    this.wordList = [];
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

}
