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
        return this.getSursilvanQuery(searchDirection, searchMode, searchLemma);

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
    switch(dictionary) {
      case Dictionary.sursilv:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM sursilvan WHERE id = ' + id;
      case Dictionary.sutsilv:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM sutsilvan WHERE id = ' + id;
      case Dictionary.surm:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM surmiran WHERE id = ' + id;
      case Dictionary.puter:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM puter WHERE id = ' + id;
      case Dictionary.vall:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM vallader WHERE id = ' + id;
      case Dictionary.rumgrischun:
      default:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM rumgr WHERE id = ' + id;
    }
  }

  private getRumgrischunQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE RStichwort LIKE  ' + this.getTerm(searchMode, lemma) + ' OR DStichwort LIKE ' + this.getTerm(searchMode, lemma) +  ' ORDER BY DStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch(searchDirection) {
      case SearchDirection.fromDe:
        return this.getSursilvanFromDeQuery(searchMode, lemma);
      case SearchDirection.fromRm:
        return this.getSursilvanFromRmQuery(searchMode, lemma);
      case SearchDirection.both:
        return this.getSursilvanFromBothQuery(searchMode, lemma);
    }
  }

  private getSursilvanFromDeQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "'  + lemma + '%" OR `DStichwort` LIKE "%, ' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "%' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "%' + lemma + '" OR `DStichwort` LIKE "%' + lemma + ', %" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "' + lemma + '" OR `DStichwort` LIKE "' + lemma + ', %" OR `DStichwort` LIKE "%,' + lemma + '" OR `DStichwort` LIKE "%, ' + lemma + ', %" ORDER BY RStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanFromRmQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` LIKE "' + lemma + '%" OR `RStichwort` LIKE "%, ' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` LIKE "%' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` LIKE "%' + lemma + '" OR `RStichwort` LIKE "%' + lemma + ', %" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan`WHERE `RStichwort` LIKE "' + lemma + '" OR `RStichwort` LIKE "' + lemma + ', %" OR `RStichwort` LIKE "%, ' + lemma + '" OR `RStichwort` LIKE "%, ' + lemma + ', %" ORDER BY RStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanFromBothQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "' + lemma + '%" OR `DStichwort` LIKE "%, ' + lemma + '%" OR `RStichwort` LIKE "' + lemma + '%" OR `RStichwort` LIKE "%, ' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "%' + lemma + '%" OR `RStichwort` LIKE "%' + lemma + '%" OR `Corp` LIKE "%' + lemma + '%" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "%' + lemma + '" OR `DStichwort` LIKE "%' + lemma + ', %" OR `RStichwort` LIKE "%' + lemma + '" OR `RStichwort` LIKE "%' + lemma + ', %" ORDER BY RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` LIKE "' + lemma + '" OR `DStichwort` LIKE "' + lemma + ', %" OR `DStichwort` LIKE "%, ' + lemma + '" OR `DStichwort` LIKE "%, ' + lemma + ', %" OR `RStichwort` LIKE "' + lemma + '" OR `RStichwort` LIKE "%, ' + lemma + '" ORDER BY RStichwort COLLATE NOCASE ASC';
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
