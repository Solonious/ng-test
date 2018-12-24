import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WordList} from '../shared/word-list';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SynonymService {

  // todo replace params to separate class
  private synApiUrl = 'https://api.datamuse.com/words';
  private synonymParam = 'rel_syn';

  constructor(private http: HttpClient) {}

  private selectedWordSource = new BehaviorSubject('');
  private selectedWordEvent = this.selectedWordSource.asObservable();

  getSynonymDataObservable(value: string) {
    return this.http.get<WordList[]>(`${this.synApiUrl}?${this.synonymParam}=${value}`);
  }

  getSelectedWordEvent(): Observable<string> {
    return this.selectedWordEvent;
  }

  sendSelectedWord(word: string) {
    this.selectedWordSource.next(word);
  }

}
