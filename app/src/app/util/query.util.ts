import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueryUtil {
  constructor() {}

  getQuery(
    dictionary: 'rumgrischun' | 'sursilv' | 'sutsilv' | 'surm' | 'puter' | 'vall',
    searchDirection: 'fromDe' | 'fromRm' | 'both',
    searchMode: 'start' | 'substring' | 'end' | 'match' = 'start',
    searchLemma: string,
  ): string {
    switch (dictionary) {
      case 'sursilv':
        return ''; // TODO

      case 'sutsilv':
        return ''; // TODO

      case 'surm':
        return ''; // TODO

      case 'puter':
        return ''; // TODO

      case 'vall':
        return this.getValladerQuery(searchDirection, searchMode, searchLemma);

      case 'rumgrischun':
      default:
        return this.getRumgrischunQuery(searchDirection, searchMode, searchLemma);
    }
  }

  private getRumgrischunQuery(
    searchDirection: 'fromDe' | 'fromRm' | 'both',
    searchMode: 'start' | 'substring' | 'end' | 'match' = 'start',
    lemma: string,
  ): string {
    switch(searchDirection) {
      case 'fromDe':
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case 'fromRm':
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case 'both':
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getValladerQuery(
    searchDirection: 'fromDe' | 'fromRm' | 'both',
    searchMode: 'start' | 'substring' | 'end' | 'match' = 'start',
    lemma: string,
  ): string {
    switch(searchDirection) {
      case 'fromDe':
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case 'fromRm':
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case 'both':
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getTerm(searchMode: 'start' | 'substring' | 'end' | 'match' = 'start', lemma: string): string {
    switch(searchMode) {
      case 'start':
        return '"' + lemma + '%"';
      case 'substring':
        return '"%' + lemma + '%"';
      case 'end':
        return '"%' + lemma + '"';
      case 'match':
        return '"' + lemma + '"';
    }
  }
}
