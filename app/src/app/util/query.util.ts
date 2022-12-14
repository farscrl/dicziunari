import { Injectable } from '@angular/core';
import { Dictionary, SearchDirection, SearchMode } from 'src/data/search';
import { ConfigService } from "../services/config.service";

@Injectable({
  providedIn: 'root',
})
export class QueryUtil {
  searchInVerbs = false;
  constructor(
    private configService: ConfigService,
  ) {
    configService.getIncludeVerbsObservable().subscribe(value => {
      this.searchInVerbs = value;
    });
  }

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
    const verbsQuery = this.getRumantschGrischunVerbQuery(searchMode, lemma);
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM rumgr WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
    }
  }

  private getSurmiranQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    const verbsQuery = this.getSurmiranVerbQuery(searchMode, lemma);
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
    }
  }

  private getSutsilvanQuery(
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    const verbsQuery = this.getSutsilvanVerbQuery(searchMode, lemma);
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + verbsQuery + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM puter WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RGrammatik, DGrammatik, RFlex, DFlex, RSempraez, DSempraez, NULL as preschentsing3 FROM vallader WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
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
    const verbsQuery = this.getSursilvanVerbQuery(searchMode, lemma);
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "' + this.regexiseTerm(lemma) + ', *" OR `DStichwort` GLOB "*,' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + ', *" ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanFromRmQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    const verbsQuery = this.getSursilvanVerbQuery(searchMode, lemma);
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" ' + verbsQuery + ' ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" ' + verbsQuery + '  ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" ' + verbsQuery + '  ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan`WHERE `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + ', *" ' + verbsQuery + '  ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1  else 2 end),  RStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanFromBothQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    const verbsQuery = this.getSursilvanVerbQuery(searchMode, lemma);
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" ' + verbsQuery + '  ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" OR `Corp` GLOB "*' + this.regexiseTerm(lemma) + '*" ' + verbsQuery + '  ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" ' + verbsQuery + '  ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "' + this.regexiseTerm(lemma) + ', *" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" ' + verbsQuery + '  ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
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

  private getRegexTerm(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    lemma = this.regexiseTerm(lemma);
    switch(searchMode) {
      case  SearchMode.start:
        return '"' + lemma + '*"';
      case  SearchMode.substring:
        return '"*' + lemma + '*"';
      case  SearchMode.end:
        return '"*' + lemma + '"';
      case SearchMode.match:
        return '"' + lemma + '"';
    }
  }

  private regexiseTerm(lemma: string): string {
    lemma = lemma.replaceAll(/[äÄ]/ig, "[äÄ]")
    lemma = lemma.replaceAll(/[àÀ]/ig, "[àÀ]")
    lemma = lemma.replaceAll(/[âÂ]/ig, "[âÂ]")
    lemma = lemma.replaceAll(/[a]/ig, "[aAäÄàÀâÂ]")
    lemma = lemma.replaceAll(/[b]/ig, "[bB]")
    lemma = lemma.replaceAll(/[c]/ig, "[cC]")
    lemma = lemma.replaceAll(/[d]/ig, "[dD]")
    lemma = lemma.replaceAll(/[èÈ]/ig, "[èÈ]")
    lemma = lemma.replaceAll(/[éÉ]/ig, "[éÉ]")
    lemma = lemma.replaceAll(/[êÊ]/ig, "[êÊ]")
    lemma = lemma.replaceAll(/[ëË]/ig, "[ëË]")
    lemma = lemma.replaceAll(/[e]/ig, "[eEèÈéÉêÊëË]")
    lemma = lemma.replaceAll(/[f]/ig, "[fF]")
    lemma = lemma.replaceAll(/[g]/ig, "[gG]")
    lemma = lemma.replaceAll(/[h]/ig, "[hH]")
    lemma = lemma.replaceAll(/[ìÌ]/ig, "[ìÌ]")
    lemma = lemma.replaceAll(/[îÎ]/ig, "[îÎ]")
    lemma = lemma.replaceAll(/[ïÏ]/ig, "[ïÏ]")
    lemma = lemma.replaceAll(/[i]/ig, "[iIìÌîÎïÏ]")
    lemma = lemma.replaceAll(/[j]/ig, "[jJ]")
    lemma = lemma.replaceAll(/[k]/ig, "[kK]")
    lemma = lemma.replaceAll(/[l]/ig, "[lL]")
    lemma = lemma.replaceAll(/[m]/ig, "[mM]")
    lemma = lemma.replaceAll(/[n]/ig, "[nN]")
    lemma = lemma.replaceAll(/[Öö]/ig, "[Öö]")
    lemma = lemma.replaceAll(/[ôÔ]/ig, "[ôÔ]")
    lemma = lemma.replaceAll(/[òÒ]/ig, "[òÒ]")
    lemma = lemma.replaceAll(/[o]/ig, "[oOÖöòÒôÔ]")
    lemma = lemma.replaceAll(/[p]/ig, "[pP]")
    lemma = lemma.replaceAll(/[q]/ig, "[qQ]")
    lemma = lemma.replaceAll(/[r]/ig, "[rR]")
    lemma = lemma.replaceAll(/[s]/ig, "[sS]")
    lemma = lemma.replaceAll(/[t]/ig, "[tT]")
    lemma = lemma.replaceAll(/[üÜ]/ig, "[üÜ]")
    lemma = lemma.replaceAll(/[ùÙ]/ig, "[ùÙ]")
    lemma = lemma.replaceAll(/[u]/ig, "[uUüÜùÙ]")
    lemma = lemma.replaceAll(/[v]/ig, "[vV]")
    lemma = lemma.replaceAll(/[w]/ig, "[wW]")
    lemma = lemma.replaceAll(/[x]/ig, "[xX]")
    lemma = lemma.replaceAll(/[y]/ig, "[yY]")
    lemma = lemma.replaceAll(/[z]/ig, "[zZ]")
    return lemma;
  }

  private getRumantschGrischunVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "jau ${term}" OR \`preschentsing1\` LIKE "jau ma ${term}" OR \`preschentsing1\` LIKE "jau m'${term}"
        OR \`preschentsing2\` LIKE "ti ${term}" OR \`preschentsing2\` LIKE "ti ta ${term}" OR \`preschentsing2\` LIKE "ti t'${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}" OR \`preschentsing3\` LIKE "el/ella sa ${term}" OR \`preschentsing3\` LIKE "el/ella s'${term}"
        OR \`preschentsing3\` LIKE "i ${term}" OR \`preschentsing3\` LIKE "i sa ${term}" OR \`preschentsing3\` LIKE "i s'${term}"
        OR \`preschentplural1\` LIKE "nus ${term}" OR \`preschentplural1\` LIKE "nus ans ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}" OR \`preschentplural2\` LIKE "vus as ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}" OR \`preschentplural3\` LIKE "els/ellas sa ${term}" OR \`preschentplural3\` LIKE "els/ellas s'${term}"
        OR \`imperfectsing1\` LIKE "jau ${term}" OR \`imperfectsing1\` LIKE "jau ma ${term}" OR \`imperfectsing1\` LIKE "jau m'${term}"
        OR \`imperfectsing2\` LIKE "ti ${term}" OR \`imperfectsing2\` LIKE "ti ta ${term}" OR \`imperfectsing2\` LIKE "ti t'${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}" OR \`imperfectsing3\` LIKE "el/ella sa ${term}" OR \`imperfectsing3\` LIKE "el/ella s'${term}"
        OR \`imperfectsing3\` LIKE "i ${term}" OR \`imperfectsing3\` LIKE "i sa ${term}" OR \`imperfectsing3\` LIKE "i s'${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}" OR \`imperfectplural1\` LIKE "nus ans ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}" OR \`imperfectplural2\` LIKE "vus as ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}" OR \`imperfectplural3\` LIKE "els/ellas sa ${term}" OR \`imperfectplural3\` LIKE "els/ellas s'${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "che jau ${term}" OR \`conjunctivsing1\` LIKE "che jau ma ${term}" OR \`conjunctivsing1\` LIKE "che jau m'${term}"
        OR \`conjunctivsing2\` LIKE "che ti ${term}" OR \`conjunctivsing2\` LIKE "che ti ta ta ${term}" OR \`conjunctivsing2\` LIKE "che ti t'${term}"
        OR \`conjunctivsing3\` LIKE "ch'el/ella ${term}" OR \`conjunctivsing3\` LIKE "ch'el/ella sa ${term}" OR \`conjunctivsing3\` LIKE "ch'el/ella s'${term}"
        OR \`conjunctivplural3\` LIKE "ch'i ${term}" OR \`conjunctivplural3\` LIKE "ch'i sa ${term}" OR \`conjunctivplural3\` LIKE "ch'i s'${term}"
        OR \`conjunctivplural1\` LIKE "che nus ${term}" OR \`conjunctivplural1\` LIKE "che nus ans ${term}"
        OR \`conjunctivplural2\` LIKE "che vus ${term}" OR \`conjunctivplural2\` LIKE "che vus as ${term}"
        OR \`conjunctivplural3\` LIKE "ch'els/ellas ${term}" OR \`conjunctivplural3\` LIKE "ch'els/ellas sa ${term}" OR \`conjunctivplural3\` LIKE "ch'els/ellas s'${term}"
        OR \`cundizionalsing1\` LIKE "jau ${term}" OR \`cundizionalsing1\` LIKE "jau ma ${term}" OR \`cundizionalsing1\` LIKE "jau m'${term}"
        OR \`cundizionalsing2\` LIKE "ti ${term}" OR \`cundizionalsing2\` LIKE "ti ta ${term}" OR \`cundizionalsing2\` LIKE "ti t'${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}" OR \`cundizionalsing3\` LIKE "el/ella sa ${term}" OR \`cundizionalsing3\` LIKE "el/ella s'${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}" OR \`cundizionalsing3\` LIKE "i sa ${term}" OR \`cundizionalsing3\` LIKE "i s'${term}"
        OR \`cundizionalplural1\` LIKE "nus ${term}" OR \`cundizionalplural1\` LIKE "nus ans ${term}"
        OR \`cundizionalplural2\` LIKE "vus ${term}" OR \`cundizionalplural2\` LIKE "vus as ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}" OR \`cundizionalplural3\` LIKE "els/ellas sa ${term}" OR \`cundizionalplural3\` LIKE "els/ellas s'${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private getSurmiranVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "ia ${term}" OR \`preschentsing1\` LIKE "ia ma ${term}" OR \`preschentsing1\` LIKE "ia m'${term}"
        OR \`preschentsing2\` LIKE "te ${term}" OR \`preschentsing2\` LIKE "te ta ${term}" OR \`preschentsing2\` LIKE "te t'${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}" OR \`preschentsing3\` LIKE "el/ella sa ${term}" OR \`preschentsing3\` LIKE "el/ella s'${term}"
        OR \`preschentsing3\` LIKE "i ${term}" OR \`preschentsing3\` LIKE "i sa ${term}" OR \`preschentsing3\` LIKE "i s'${term}"
        OR \`preschentplural1\` LIKE "nous ${term}" OR \`preschentplural1\` LIKE "nous ans ${term}"
        OR \`preschentplural2\` LIKE "vous ${term}" OR \`preschentplural2\` LIKE "vous az ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}" OR \`preschentplural3\` LIKE "els/ellas sa ${term}" OR \`preschentplural3\` LIKE "els/ellas s'${term}"
        OR \`imperfectsing1\` LIKE "ia ${term}" OR \`imperfectsing1\` LIKE "ia ma ${term}" OR \`imperfectsing1\` LIKE "ia m'${term}"
        OR \`imperfectsing2\` LIKE "te ${term}" OR \`imperfectsing2\` LIKE "te ta ${term}" OR \`imperfectsing2\` LIKE "te t'${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}" OR \`imperfectsing3\` LIKE "el/ella sa ${term}" OR \`imperfectsing3\` LIKE "el/ella s'${term}"
        OR \`imperfectsing3\` LIKE "i ${term}" OR \`imperfectsing3\` LIKE "i sa ${term}" OR \`imperfectsing3\` LIKE "i s'${term}"
        OR \`imperfectplural1\` LIKE "nous ${term}" OR \`imperfectplural1\` LIKE "nous ans ${term}"
        OR \`imperfectplural2\` LIKE "vous ${term}" OR \`imperfectplural2\` LIKE "vous az ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}" OR \`imperfectplural3\` LIKE "els/ellas sa ${term}" OR \`imperfectplural3\` LIKE "els/ellas s'${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "tg'ia ${term}" OR \`conjunctivsing1\` LIKE "tg'ia ma ${term}" OR \`conjunctivsing1\` LIKE "tg'ia m'${term}"
        OR \`conjunctivsing2\` LIKE "tgi te ${term}" OR \`conjunctivsing2\` LIKE "tgi te ta ta ${term}" OR \`conjunctivsing2\` LIKE "tgi te t'${term}"
        OR \`conjunctivsing3\` LIKE "tg'el/ella ${term}" OR \`conjunctivsing3\` LIKE "tg'el/ella sa ${term}" OR \`conjunctivsing3\` LIKE "tg'el/ella s'${term}"
        OR \`conjunctivplural3\` LIKE "tg'i ${term}" OR \`conjunctivplural3\` LIKE "tg'i sa ${term}" OR \`conjunctivplural3\` LIKE "tg'i s'${term}"
        OR \`conjunctivplural1\` LIKE "tgi nous ${term}" OR \`conjunctivplural1\` LIKE "tgi nous ans ${term}"
        OR \`conjunctivplural2\` LIKE "tgi vous ${term}" OR \`conjunctivplural2\` LIKE "tgi vous az ${term}"
        OR \`conjunctivplural3\` LIKE "tg'els/ellas ${term}" OR \`conjunctivplural3\` LIKE "tg'els/ellas sa ${term}" OR \`conjunctivplural3\` LIKE "tg'els/ellas s'${term}"
        OR \`cundizionalsing1\` LIKE "ia ${term}" OR \`cundizionalsing1\` LIKE "ia ma ${term}" OR \`cundizionalsing1\` LIKE "ia m'${term}"
        OR \`cundizionalsing2\` LIKE "te ${term}" OR \`cundizionalsing2\` LIKE "te ta ${term}" OR \`cundizionalsing2\` LIKE "te t'${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}" OR \`cundizionalsing3\` LIKE "el/ella sa ${term}" OR \`cundizionalsing3\` LIKE "el/ella s'${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}" OR \`cundizionalsing3\` LIKE "i sa ${term}" OR \`cundizionalsing3\` LIKE "i s'${term}"
        OR \`cundizionalplural1\` LIKE "nous ${term}" OR \`cundizionalplural1\` LIKE "nous ans ${term}"
        OR \`cundizionalplural2\` LIKE "vous ${term}" OR \`cundizionalplural2\` LIKE "vous az ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}" OR \`cundizionalplural3\` LIKE "els/ellas sa ${term}" OR \`cundizionalplural3\` LIKE "els/ellas s'${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private getSutsilvanVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "jou ${term}"
        OR \`preschentsing2\` LIKE "tei ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentsing3\` LIKE "i ${term}"
        OR \`preschentplural1\` LIKE "nous ${term}"
        OR \`preschentplural2\` LIKE "vous ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "jou ${term}"
        OR \`imperfectsing2\` LIKE "tei ${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}"
        OR \`imperfectsing3\` LIKE "i ${term}"
        OR \`imperfectplural1\` LIKE "nous ${term}"
        OR \`imperfectplural2\` LIKE "vous ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "tg'jou ${term}"
        OR \`conjunctivsing2\` LIKE "tgi tei ${term}"
        OR \`conjunctivsing3\` LIKE "tg'el/ella ${term}"
        OR \`conjunctivplural3\` LIKE "tg'i ${term}"
        OR \`conjunctivplural1\` LIKE "tgi nous ${term}"
        OR \`conjunctivplural2\` LIKE "tgi vous ${term}"
        OR \`conjunctivplural3\` LIKE "tg'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "jou ${term}"
        OR \`cundizionalsing2\` LIKE "tei ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}"
        OR \`cundizionalplural1\` LIKE "nous ${term}"
        OR \`cundizionalplural2\` LIKE "vous ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private getSursilvanVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "${term}"
        OR \`preschentsing2\` LIKE "${term}"
        OR \`preschentsing3\` LIKE "${term}"
        OR \`preschentplural1\` LIKE "${term}"
        OR \`preschentplural2\` LIKE "${term}"
        OR \`preschentplural3\` LIKE "${term}"
        OR \`imperfectsing1\` LIKE "${term}"
        OR \`imperfectsing2\` LIKE "${term}"
        OR \`imperfectsing3\` LIKE "${term}"
        OR \`imperfectplural1\` LIKE "${term}"
        OR \`imperfectplural2\` LIKE "${term}"
        OR \`imperfectplural3\` LIKE "${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "${term}"
        OR \`conjunctivsing2\` LIKE "${term}"
        OR \`conjunctivsing3\` LIKE "${term}"
        OR \`conjunctivplural1\` LIKE "${term}"
        OR \`conjunctivplural2\` LIKE "${term}"
        OR \`conjunctivplural3\` LIKE "${term}"
        OR \`cundizionalsing1\` LIKE "${term}"
        OR \`cundizionalsing2\` LIKE "${term}"
        OR \`cundizionalsing3\` LIKE "${term}"
        OR \`cundizionalplural1\` LIKE "${term}"
        OR \`cundizionalplural2\` LIKE "${term}"
        OR \`cundizionalplural3\` LIKE "${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }
}
