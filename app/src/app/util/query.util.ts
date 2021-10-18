import { Injectable } from '@angular/core';
import { Dictionary, SearchDirection, SearchMode } from 'src/data/search';

@Injectable({
  providedIn: 'root',
})
export class QueryUtil {
  constructor() {}

  getQuery(
    dictionary: Dictionary,
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    searchLemma: string,
  ): string {
    switch (dictionary) {
      case Dictionary.sursilv:
        return ''; // TODO

      case Dictionary.sutsilv:
        return this.getSutsilvanQuery(searchDirection, searchMode, searchLemma);

      case Dictionary.surm:
        return this.getSurmiranQuery(searchDirection, searchMode, searchLemma);

      case Dictionary.puter:
        return this.getPuterQuery(searchDirection, searchMode, searchLemma);

      case Dictionary.vall:
        return this.getValladerQuery(searchDirection, searchMode, searchLemma);

      case Dictionary.rumgrischun:
      default:
        return this.getRumgrischunQuery(searchDirection, searchMode, searchLemma);
    }
  }

  getDetailQuery(dictionary: Dictionary, id: string) {
    // eslint-disable-next-line max-len
    return 'SELECT * FROM rumgr WHERE id LIKE "' + id + '"';
  }

  private getRumgrischunQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getSurmiranQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM surmiran WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM surmiran WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM surmiran WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getSutsilvanQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM sutsilvan WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM sutsilvan WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, preschentsing3 FROM sutsilvan WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getPuterQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM puter WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM puter WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM puter WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getValladerQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, StichwortR as RStichwort, StichwortD as DStichwort, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getTerm(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    switch(searchMode) {
      case  SearchMode.start:
        return '"' + lemma + '%"';
      case  SearchMode.substring:
        return '"%' + lemma + '%"';
      case  SearchMode.end:
        return '"%' + lemma + '"';
      case SearchMode.match:
        return '"' + lemma + '"';
    }
  }
}
