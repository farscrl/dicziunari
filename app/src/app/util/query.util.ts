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
    switch(searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM surmiran WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
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
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return  'SELECT id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing3 FROM sutsilvan WHERE RStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' OR DStichwort GLOB ' + this.getRegexTerm(searchMode, lemma) + ' ORDER BY (case when RStichwort = \'' + lemma + '\' then 1 when DStichwort = \'' + lemma + '\' then 1 else 2 end), DStichwort COLLATE NOCASE ASC';
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
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan`WHERE `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + ', *" ORDER BY (case when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1  else 2 end),  RStichwort COLLATE NOCASE ASC';
    }
  }

  private getSursilvanFromBothQuery(
    searchMode: SearchMode,
    lemma: string,
  ): string {
    switch (searchMode) {
      case SearchMode.start:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '*" ORDER BY (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), RStichwort COLLATE NOCASE ASC';
      case SearchMode.substring:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '*" OR `Corp` GLOB "*' + this.regexiseTerm(lemma) + '*" ORDER BY RStichwort (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), COLLATE NOCASE ASC';
      case SearchMode.end:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*' + this.regexiseTerm(lemma) + ', *" ORDER BY RStichwort (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), COLLATE NOCASE ASC';
      case SearchMode.match:
        // eslint-disable-next-line max-len
        return 'SELECT * FROM `sursilvan` WHERE `DStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "' + this.regexiseTerm(lemma) + ', *" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" OR `DStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + ', *" OR `RStichwort` GLOB "' + this.regexiseTerm(lemma) + '" OR `RStichwort` GLOB "*, ' + this.regexiseTerm(lemma) + '" ORDER BY RStichwort (case when DStichwort LIKE \'' + lemma + '\' then 1 when DStichwort LIKE \'%,' + lemma + '\' then 1 when DStichwort LIKE \'' + lemma + ',%\' then 1 when DStichwort = \'%,' + lemma + ',%\' then 1 when RStichwort LIKE \'' + lemma + '\' then 1 when RStichwort LIKE \'%,' + lemma + '\' then 1 when RStichwort LIKE \'' + lemma + ',%\' then 1 when RStichwort = \'%,' + lemma + ',%\' then 1 else 2 end), COLLATE NOCASE ASC';
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
        OR \`preschentsing1\` LIKE "jau ${term}"
        OR \`preschentsing2\` LIKE "ti ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentsing3\` LIKE "i ${term}"
        OR \`preschentplural1\` LIKE "nus ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "jau ${term}"
        OR \`imperfectsing2\` LIKE "ti ${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}"
        OR \`imperfectsing3\` LIKE "i ${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "che jau ${term}"
        OR \`conjunctivsing2\` LIKE "che ti ${term}"
        OR \`conjunctivsing3\` LIKE "ch'ell/ella ${term}"
        OR \`conjunctivplural1\` LIKE "che nus ${term}"
        OR \`conjunctivplural2\` LIKE "che vus ${term}"
        OR \`conjunctivplural3\` LIKE "ch'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "jau ${term}"
        OR \`cundizionalsing2\` LIKE "ti ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}"
        OR \`cundizionalplural1\` LIKE "nus ${term}"
        OR \`cundizionalplural2\` LIKE "vus ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }
}
