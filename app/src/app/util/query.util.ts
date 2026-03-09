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

  private readonly tableNames: Record<Dictionary, string> = {
    [Dictionary.rumgrischun]: 'rumgr',
    [Dictionary.sursilv]: 'sursilvan',
    [Dictionary.sutsilv]: 'sutsilvan',
    [Dictionary.surm]: 'surmiran',
    [Dictionary.puter]: 'puter',
    [Dictionary.vall]: 'vallader',
  };

  private readonly verbQueryBuilders: Record<Dictionary, (searchMode: SearchMode, lemma: string) => string> = {
    [Dictionary.rumgrischun]: (m, l) => this.getRumantschGrischunVerbQuery(m, l),
    [Dictionary.sursilv]: (m, l) => this.getSursilvanVerbQuery(m, l),
    [Dictionary.sutsilv]: (m, l) => this.getSutsilvanVerbQuery(m, l),
    [Dictionary.surm]: (m, l) => this.getSurmiranVerbQuery(m, l),
    [Dictionary.puter]: (m, l) => this.getPuterVerbQuery(m, l),
    [Dictionary.vall]: (m, l) => this.getValladerVerbQuery(m, l),
  };

  getQuery(
    dictionary: Dictionary,
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    searchLemma: string,
  ): string {
    searchLemma = searchLemma.replaceAll(/"/g, '');
    const table = this.tableNames[dictionary];
    const verbsQuery = this.verbQueryBuilders[dictionary](searchMode, searchLemma);
    return this.buildQuery(table, verbsQuery, searchDirection, searchMode, searchLemma);
  }

  getDetailQuery(dictionary: Dictionary, id: string) {
    return `SELECT * FROM ${this.tableNames[dictionary]} WHERE id = ${id}`;
  }

  private buildQuery(
    table: string,
    verbsQuery: string,
    searchDirection: SearchDirection,
    searchMode: SearchMode,
    lemma: string,
  ): string {
    const cols = 'id, RStichwort, DStichwort, RGenus, DGenus, RSempraez, DSempraez, preschentsing1, preschentsing3';
    const rx = this.getRegexTerm(searchMode, lemma);
    const lc = lemma.toLowerCase();
    const uc = this.firstLetterUppercase(lemma);
    switch (searchDirection) {
      case SearchDirection.fromDe:
        // eslint-disable-next-line max-len
        return `SELECT ${cols} FROM ${table} WHERE DStichwort GLOB ${rx} ORDER BY (case when DStichwort = "${lemma}" then 1 when DStichwort = "${lc}" then 2 when DStichwort = "${uc}" then 2 else 3 end), DStichwort COLLATE NOCASE ASC`;
      case SearchDirection.fromRm:
        // eslint-disable-next-line max-len
        return `SELECT ${cols} FROM ${table} WHERE RStichwort GLOB ${rx}${verbsQuery} ORDER BY (case when RStichwort = "${lemma}" then 1 when RStichwort = "${lc}" then 2 when RStichwort = "${uc}" then 2 else 3 end), RStichwort COLLATE NOCASE ASC`;
      case SearchDirection.both:
        // eslint-disable-next-line max-len
        return `SELECT ${cols} FROM ${table} WHERE RStichwort GLOB ${rx}${verbsQuery} OR DStichwort GLOB ${rx} ORDER BY (case when RStichwort = "${lemma}" then 1 when DStichwort = "${lemma}" then 1 when RStichwort = "${lc}" then 2 when DStichwort = "${lc}" then 2 when RStichwort = "${uc}" then 2 when DStichwort = "${uc}" then 2 else 3 end), DStichwort COLLATE NOCASE ASC`;
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
        OR \`preschentsing1\` LIKE "i ${term}" OR \`preschentsing1\` LIKE "igl ${term}" OR \`preschentsing1\` LIKE "i sa ${term}" OR \`preschentsing1\` LIKE "i s'${term}"
        OR \`preschentsing2\` LIKE "ti ${term}" OR \`preschentsing2\` LIKE "ti ta ${term}" OR \`preschentsing2\` LIKE "ti t'${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}" OR \`preschentsing3\` LIKE "el/ella sa ${term}" OR \`preschentsing3\` LIKE "el/ella s'${term}"
        OR \`preschentsing3\` LIKE "i ${term}" OR \`preschentsing3\` LIKE "igl ${term}" OR \`preschentsing3\` LIKE "i sa ${term}" OR \`preschentsing3\` LIKE "i s'${term}"
        OR \`preschentplural1\` LIKE "nus ${term}" OR \`preschentplural1\` LIKE "nus ans ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}" OR \`preschentplural2\` LIKE "vus as ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}" OR \`preschentplural3\` LIKE "els/ellas sa ${term}" OR \`preschentplural3\` LIKE "els/ellas s'${term}"
        OR \`imperfectsing1\` LIKE "jau ${term}" OR \`imperfectsing1\` LIKE "jau ma ${term}" OR \`imperfectsing1\` LIKE "jau m'${term}"
        OR \`imperfectsing1\` LIKE "i ${term}" OR \`imperfectsing1\` LIKE "igl ${term}" OR \`imperfectsing1\` LIKE "i sa ${term}" OR \`imperfectsing1\` LIKE "i s'${term}"
        OR \`imperfectsing2\` LIKE "ti ${term}" OR \`imperfectsing2\` LIKE "ti ta ${term}" OR \`imperfectsing2\` LIKE "ti t'${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}" OR \`imperfectsing3\` LIKE "el/ella sa ${term}" OR \`imperfectsing3\` LIKE "el/ella s'${term}"
        OR \`imperfectsing3\` LIKE "i ${term}" OR \`imperfectsing3\` LIKE "igl ${term}" OR \`imperfectsing3\` LIKE "i sa ${term}" OR \`imperfectsing3\` LIKE "i s'${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}" OR \`imperfectplural1\` LIKE "nus ans ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}" OR \`imperfectplural2\` LIKE "vus as ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}" OR \`imperfectplural3\` LIKE "els/ellas sa ${term}" OR \`imperfectplural3\` LIKE "els/ellas s'${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "che jau ${term}" OR \`conjunctivsing1\` LIKE "che jau ma ${term}" OR \`conjunctivsing1\` LIKE "che jau m'${term}"
        OR \`conjunctivplural1\` LIKE "ch'i ${term}" OR \`conjunctivplural1\` LIKE "ch'igl ${term}" OR \`conjunctivplural1\` LIKE "ch'i sa ${term}" OR \`conjunctivplural1\` LIKE "ch'i s'${term}"
        OR \`conjunctivsing2\` LIKE "che ti ${term}" OR \`conjunctivsing2\` LIKE "che ti ta ta ${term}" OR \`conjunctivsing2\` LIKE "che ti t'${term}"
        OR \`conjunctivsing3\` LIKE "ch'el/ella ${term}" OR \`conjunctivsing3\` LIKE "ch'el/ella sa ${term}" OR \`conjunctivsing3\` LIKE "ch'el/ella s'${term}"
        OR \`conjunctivplural3\` LIKE "ch'i ${term}" OR \`conjunctivplural3\` LIKE "ch'igl ${term}" OR \`conjunctivplural3\` LIKE "ch'i sa ${term}" OR \`conjunctivplural3\` LIKE "ch'i s'${term}"
        OR \`conjunctivplural1\` LIKE "che nus ${term}" OR \`conjunctivplural1\` LIKE "che nus ans ${term}"
        OR \`conjunctivplural2\` LIKE "che vus ${term}" OR \`conjunctivplural2\` LIKE "che vus as ${term}"
        OR \`conjunctivplural3\` LIKE "ch'els/ellas ${term}" OR \`conjunctivplural3\` LIKE "ch'els/ellas sa ${term}" OR \`conjunctivplural3\` LIKE "ch'els/ellas s'${term}"
        OR \`cundizionalsing1\` LIKE "jau ${term}" OR \`cundizionalsing1\` LIKE "jau ma ${term}" OR \`cundizionalsing1\` LIKE "jau m'${term}"
        OR \`cundizionalsing1\` LIKE "i ${term}" OR \`cundizionalsing1\` LIKE "igl ${term}" OR \`cundizionalsing1\` LIKE "i sa ${term}" OR \`cundizionalsing1\` LIKE "i s'${term}"
        OR \`cundizionalsing2\` LIKE "ti ${term}" OR \`cundizionalsing2\` LIKE "ti ta ${term}" OR \`cundizionalsing2\` LIKE "ti t'${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}" OR \`cundizionalsing3\` LIKE "el/ella sa ${term}" OR \`cundizionalsing3\` LIKE "el/ella s'${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}" OR \`cundizionalsing3\` LIKE "igl ${term}" OR \`cundizionalsing3\` LIKE "i sa ${term}" OR \`cundizionalsing3\` LIKE "i s'${term}"
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
        OR \`preschentsing3\` LIKE "i ${term}" OR \`preschentsing3\` LIKE "i sa ${term}" OR \`preschentsing3\` LIKE "i s'${term}"
        OR \`preschentsing2\` LIKE "te ${term}" OR \`preschentsing2\` LIKE "te ta ${term}" OR \`preschentsing2\` LIKE "te t'${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}" OR \`preschentsing3\` LIKE "el/ella sa ${term}" OR \`preschentsing3\` LIKE "el/ella s'${term}"
        OR \`preschentsing3\` LIKE "i ${term}" OR \`preschentsing3\` LIKE "i sa ${term}" OR \`preschentsing3\` LIKE "i s'${term}"
        OR \`preschentplural1\` LIKE "nous ${term}" OR \`preschentplural1\` LIKE "nous ans ${term}"
        OR \`preschentplural2\` LIKE "vous ${term}" OR \`preschentplural2\` LIKE "vous az ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}" OR \`preschentplural3\` LIKE "els/ellas sa ${term}" OR \`preschentplural3\` LIKE "els/ellas s'${term}"
        OR \`imperfectsing1\` LIKE "ia ${term}" OR \`imperfectsing1\` LIKE "ia ma ${term}" OR \`imperfectsing1\` LIKE "ia m'${term}"
        OR \`imperfectsing1\` LIKE "i ${term}" OR \`imperfectsing1\` LIKE "i sa ${term}" OR \`imperfectsing1\` LIKE "i s'${term}"
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
        OR \`conjunctivsing1\` LIKE "tg'i ${term}" OR \`conjunctivsing1\` LIKE "tg'i sa ${term}" OR \`conjunctivsing1\` LIKE "tg'i s'${term}"
        OR \`conjunctivsing2\` LIKE "tgi te ${term}" OR \`conjunctivsing2\` LIKE "tgi te ta ta ${term}" OR \`conjunctivsing2\` LIKE "tgi te t'${term}"
        OR \`conjunctivsing3\` LIKE "tg'el/ella ${term}" OR \`conjunctivsing3\` LIKE "tg'el/ella sa ${term}" OR \`conjunctivsing3\` LIKE "tg'el/ella s'${term}"
        OR \`conjunctivplural3\` LIKE "tg'i ${term}" OR \`conjunctivplural3\` LIKE "tg'i sa ${term}" OR \`conjunctivplural3\` LIKE "tg'i s'${term}"
        OR \`conjunctivplural1\` LIKE "tgi nous ${term}" OR \`conjunctivplural1\` LIKE "tgi nous ans ${term}"
        OR \`conjunctivplural2\` LIKE "tgi vous ${term}" OR \`conjunctivplural2\` LIKE "tgi vous az ${term}"
        OR \`conjunctivplural3\` LIKE "tg'els/ellas ${term}" OR \`conjunctivplural3\` LIKE "tg'els/ellas sa ${term}" OR \`conjunctivplural3\` LIKE "tg'els/ellas s'${term}"
        OR \`cundizionalsing1\` LIKE "ia ${term}" OR \`cundizionalsing1\` LIKE "ia ma ${term}" OR \`cundizionalsing1\` LIKE "ia m'${term}"
        OR \`cundizionalsing1\` LIKE "i ${term}" OR \`cundizionalsing1\` LIKE "i sa ${term}" OR \`cundizionalsing1\` LIKE "i s'${term}"
        OR \`cundizionalsing2\` LIKE "te ${term}" OR \`cundizionalsing2\` LIKE "te ta ${term}" OR \`cundizionalsing2\` LIKE "te t'${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}" OR \`cundizionalsing3\` LIKE "el/ella sa ${term}" OR \`cundizionalsing3\` LIKE "el/ella s'${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}" OR \`cundizionalsing3\` LIKE "i sa ${term}" OR \`cundizionalsing3\` LIKE "i s'${term}"
        OR \`cundizionalplural1\` LIKE "nous ${term}" OR \`cundizionalplural1\` LIKE "nous ans ${term}"
        OR \`cundizionalplural2\` LIKE "vous ${term}" OR \`cundizionalplural2\` LIKE "vous az ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}" OR \`cundizionalplural3\` LIKE "els/ellas sa ${term}" OR \`cundizionalplural3\` LIKE "els/ellas s'${term}"
        OR \`futursing1\` LIKE "ia ${term}" OR \`futursing1\` LIKE "ia ma ${term}" OR \`futursing1\` LIKE "ia m'${term}"
        OR \`futursing1\` LIKE "i ${term}" OR \`futursing1\` LIKE "i sa ${term}" OR \`futursing1\` LIKE "i s'${term}"
        OR \`futursing2\` LIKE "te ${term}" OR \`futursing2\` LIKE "te ta ${term}" OR \`futursing2\` LIKE "te t'${term}"
        OR \`futursing3\` LIKE "el/ella ${term}" OR \`futursing3\` LIKE "el/ella sa ${term}" OR \`futursing3\` LIKE "el/ella s'${term}"
        OR \`futursing3\` LIKE "i ${term}" OR \`futursing3\` LIKE "i sa ${term}" OR \`futursing3\` LIKE "i s'${term}"
        OR \`futurplural1\` LIKE "nous ${term}" OR \`futurplural1\` LIKE "nous ans ${term}"
        OR \`futurplural2\` LIKE "vous ${term}" OR \`futurplural2\` LIKE "vous az ${term}"
        OR \`futurplural3\` LIKE "els/ellas ${term}" OR \`futurplural3\` LIKE "els/ellas sa ${term}" OR \`futurplural3\` LIKE "els/ellas s'${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`preschentencliticsing1\` LIKE "${term}"
        OR \`preschentencliticsing2\` LIKE "${term}"
        OR \`preschentencliticsing3m\` LIKE "${term}"
        OR \`preschentencliticsing3f\` LIKE "${term}"
        OR \`preschentencliticplural1\` LIKE "${term}"
        OR \`preschentencliticplural2\` LIKE "${term}"
        OR \`preschentencliticplural3\` LIKE "${term}"
        OR \`imperfectencliticsing1\` LIKE "${term}"
        OR \`imperfectencliticsing2\` LIKE "${term}"
        OR \`imperfectencliticsing3m\` LIKE "${term}"
        OR \`imperfectencliticsing3f\` LIKE "${term}"
        OR \`imperfectencliticplural1\` LIKE "${term}"
        OR \`imperfectencliticplural2\` LIKE "${term}"
        OR \`imperfectencliticplural3\` LIKE "${term}"
        OR \`cundizionalencliticsing1\` LIKE "${term}"
        OR \`cundizionalencliticsing2\` LIKE "${term}"
        OR \`cundizionalencliticsing3m\` LIKE "${term}"
        OR \`cundizionalencliticsing3f\` LIKE "${term}"
        OR \`cundizionalencliticplural1\` LIKE "${term}"
        OR \`cundizionalencliticplural2\` LIKE "${term}"
        OR \`cundizionalencliticplural3\` LIKE "${term}"
        OR \`futurencliticsing1\` LIKE "${term}"
        OR \`futurencliticsing2\` LIKE "${term}"
        OR \`futurencliticsing3m\` LIKE "${term}"
        OR \`futurencliticsing3f\` LIKE "${term}"
        OR \`futurencliticplural1\` LIKE "${term}"
        OR \`futurencliticplural2\` LIKE "${term}"
        OR \`futurencliticplural3\` LIKE "${term}"
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
        OR \`preschentsing1\` LIKE "i ${term}"
        OR \`preschentsing2\` LIKE "tei ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentsing3\` LIKE "i ${term}"
        OR \`preschentplural1\` LIKE "nous ${term}"
        OR \`preschentplural2\` LIKE "vous ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "jou ${term}"
        OR \`imperfectsing1\` LIKE "i ${term}"
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
        OR \`conjunctivplural1\` LIKE "tg'i ${term}"
        OR \`conjunctivsing2\` LIKE "tgi tei ${term}"
        OR \`conjunctivsing3\` LIKE "tg'el/ella ${term}"
        OR \`conjunctivplural3\` LIKE "tg'i ${term}"
        OR \`conjunctivplural1\` LIKE "tgi nous ${term}"
        OR \`conjunctivplural2\` LIKE "tgi vous ${term}"
        OR \`conjunctivplural3\` LIKE "tg'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "jou ${term}"
        OR \`cundizionalsing1\` LIKE "i ${term}"
        OR \`cundizionalsing2\` LIKE "tei ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}"
        OR \`cundizionalplural1\` LIKE "nous ${term}"
        OR \`cundizionalplural2\` LIKE "vous ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`cundizionalindirectsing1\` LIKE "jou ${term}"
        OR \`cundizionalindirectsing1\` LIKE "i ${term}"
        OR \`cundizionalindirectsing2\` LIKE "tei ${term}"
        OR \`cundizionalindirectsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalindirectsing3\` LIKE "i ${term}"
        OR \`cundizionalindirectplural1\` LIKE "nous ${term}"
        OR \`cundizionalindirectplural2\` LIKE "vous ${term}"
        OR \`cundizionalindirectplural3\` LIKE "els/ellas ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "tg'jou ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "tg'i ${term}"
        OR \`conjunctivimperfectsing2\` LIKE "tgi tei ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "tg'el/ella ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "tg'i ${term}"
        OR \`conjunctivimperfectplural1\` LIKE "tgi nous ${term}"
        OR \`conjunctivimperfectplural2\` LIKE "tgi vous ${term}"
        OR \`conjunctivimperfectplural3\` LIKE "tg'els/ellas ${term}"
        OR \`futursing1\` LIKE "jou ${term}"
        OR \`futursing1\` LIKE "i ${term}"
        OR \`futursing2\` LIKE "tei ${term}"
        OR \`futursing3\` LIKE "el/ella ${term}"
        OR \`futursing3\` LIKE "i ${term}"
        OR \`futurplural1\` LIKE "nous ${term}"
        OR \`futurplural2\` LIKE "vous ${term}"
        OR \`futurplural3\` LIKE "els/ellas ${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`preschentencliticsing1\` LIKE "${term}"
        OR \`preschentencliticsing2\` LIKE "${term}"
        OR \`preschentencliticsing3m\` LIKE "${term}"
        OR \`preschentencliticsing3f\` LIKE "${term}"
        OR \`preschentencliticplural1\` LIKE "${term}"
        OR \`preschentencliticplural2\` LIKE "${term}"
        OR \`preschentencliticplural3\` LIKE "${term}"
        OR \`imperfectencliticsing1\` LIKE "${term}"
        OR \`imperfectencliticsing2\` LIKE "${term}"
        OR \`imperfectencliticsing3m\` LIKE "${term}"
        OR \`imperfectencliticsing3f\` LIKE "${term}"
        OR \`imperfectencliticplural1\` LIKE "${term}"
        OR \`imperfectencliticplural2\` LIKE "${term}"
        OR \`imperfectencliticplural3\` LIKE "${term}"
        OR \`cundizionalencliticsing1\` LIKE "${term}"
        OR \`cundizionalencliticsing2\` LIKE "${term}"
        OR \`cundizionalencliticsing3m\` LIKE "${term}"
        OR \`cundizionalencliticsing3f\` LIKE "${term}"
        OR \`cundizionalencliticplural1\` LIKE "${term}"
        OR \`cundizionalencliticplural2\` LIKE "${term}"
        OR \`cundizionalencliticplural3\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private getPuterVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "eau ${term}"
        OR \`preschentsing1\` LIKE "i ${term}"
        OR \`preschentsing2\` LIKE "tü ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentsing3\` LIKE "i ${term}"
        OR \`preschentplural1\` LIKE "nus ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "eau ${term}"
        OR \`imperfectsing1\` LIKE "i ${term}"
        OR \`imperfectsing2\` LIKE "tü ${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}"
        OR \`imperfectsing3\` LIKE "i ${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "ch'eau ${term}"
        OR \`conjunctivplural1\` LIKE "ch'i ${term}"
        OR \`conjunctivsing2\` LIKE "cha tü ${term}"
        OR \`conjunctivsing3\` LIKE "ch'el/ella ${term}"
        OR \`conjunctivplural3\` LIKE "ch'i ${term}"
        OR \`conjunctivplural1\` LIKE "cha nus ${term}"
        OR \`conjunctivplural2\` LIKE "cha vus ${term}"
        OR \`conjunctivplural3\` LIKE "ch'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "eau ${term}"
        OR \`cundizionalsing1\` LIKE "i ${term}"
        OR \`cundizionalsing2\` LIKE "tü ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}"
        OR \`cundizionalplural1\` LIKE "nus ${term}"
        OR \`cundizionalplural2\` LIKE "vus ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "ch'eau ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "ch'i ${term}"
        OR \`conjunctivimperfectsing2\` LIKE "cha tü ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "ch'el/ella ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "ch'i ${term}"
        OR \`conjunctivimperfectplural1\` LIKE "cha nus ${term}"
        OR \`conjunctivimperfectplural2\` LIKE "cha vus ${term}"
        OR \`conjunctivimperfectplural3\` LIKE "ch'els/ellas ${term}"
        OR \`futursing1\` LIKE "eau ${term}"
        OR \`futursing1\` LIKE "i ${term}"
        OR \`futursing2\` LIKE "tü ${term}"
        OR \`futursing3\` LIKE "el/ella ${term}"
        OR \`futursing3\` LIKE "i ${term}"
        OR \`futurplural1\` LIKE "nus ${term}"
        OR \`futurplural2\` LIKE "vus ${term}"
        OR \`futurplural3\` LIKE "els/ellas ${term}"
        OR \`futurdubitativsing1\` LIKE "eau ${term}"
        OR \`futurdubitativsing1\` LIKE "i ${term}"
        OR \`futurdubitativsing2\` LIKE "tü ${term}"
        OR \`futurdubitativsing3\` LIKE "el/ella ${term}"
        OR \`futurdubitativsing3\` LIKE "i ${term}"
        OR \`futurdubitativplural1\` LIKE "nus ${term}"
        OR \`futurdubitativplural2\` LIKE "vus ${term}"
        OR \`futurdubitativplural3\` LIKE "els/ellas ${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`imperativ3\` LIKE "${term}"
        OR \`imperativ4\` LIKE "${term}"
        OR \`imperativ5\` LIKE "${term}"
        OR \`imperativ6\` LIKE "${term}"
        OR \`preschentencliticsing1\` LIKE "${term}"
        OR \`preschentencliticsing2\` LIKE "${term}"
        OR \`preschentencliticsing3m\` LIKE "${term}"
        OR \`preschentencliticsing3f\` LIKE "${term}"
        OR \`preschentencliticplural1\` LIKE "${term}"
        OR \`preschentencliticplural2\` LIKE "${term}"
        OR \`preschentencliticplural3\` LIKE "${term}"
        OR \`imperfectencliticsing1\` LIKE "${term}"
        OR \`imperfectencliticsing2\` LIKE "${term}"
        OR \`imperfectencliticsing3m\` LIKE "${term}"
        OR \`imperfectencliticsing3f\` LIKE "${term}"
        OR \`imperfectencliticplural1\` LIKE "${term}"
        OR \`imperfectencliticplural2\` LIKE "${term}"
        OR \`imperfectencliticplural3\` LIKE "${term}"
        OR \`cundizionalencliticsing1\` LIKE "${term}"
        OR \`cundizionalencliticsing2\` LIKE "${term}"
        OR \`cundizionalencliticsing3m\` LIKE "${term}"
        OR \`cundizionalencliticsing3f\` LIKE "${term}"
        OR \`cundizionalencliticplural1\` LIKE "${term}"
        OR \`cundizionalencliticplural2\` LIKE "${term}"
        OR \`cundizionalencliticplural3\` LIKE "${term}"
        OR \`futurencliticsing1\` LIKE "${term}"
        OR \`futurencliticsing2\` LIKE "${term}"
        OR \`futurencliticsing3m\` LIKE "${term}"
        OR \`futurencliticsing3f\` LIKE "${term}"
        OR \`futurencliticplural1\` LIKE "${term}"
        OR \`futurencliticplural2\` LIKE "${term}"
        OR \`futurencliticplural3\` LIKE "${term}"
        OR \`futurdubitativencliticsing1\` LIKE "${term}"
        OR \`futurdubitativencliticsing2\` LIKE "${term}"
        OR \`futurdubitativencliticsing3m\` LIKE "${term}"
        OR \`futurdubitativencliticsing3f\` LIKE "${term}"
        OR \`futurdubitativencliticplural1\` LIKE "${term}"
        OR \`futurdubitativencliticplural2\` LIKE "${term}"
        OR \`futurdubitativencliticplural3\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private getValladerVerbQuery(searchMode: SearchMode = SearchMode.start, lemma: string): string {
    let query = '';

    if (this.searchInVerbs) {
      let term = this.getTerm(searchMode, lemma);
      term = term.replace(/"/g, '');

      query = `
        OR \`infinitiv\` LIKE "${term}"
        OR \`preschentsing1\` LIKE "eu ${term}"
        OR \`preschentsing1\` LIKE "i ${term}"
        OR \`preschentsing2\` LIKE "tü ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentsing3\` LIKE "i ${term}"
        OR \`preschentplural1\` LIKE "nus ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "eu ${term}"
        OR \`imperfectsing1\` LIKE "i ${term}"
        OR \`imperfectsing2\` LIKE "tü ${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}"
        OR \`imperfectsing3\` LIKE "i ${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "tg'eu ${term}"
        OR \`conjunctivplural1\` LIKE "tg'i ${term}"
        OR \`conjunctivsing2\` LIKE "tgi tü ${term}"
        OR \`conjunctivsing3\` LIKE "tg'el/ella ${term}"
        OR \`conjunctivplural3\` LIKE "tg'i ${term}"
        OR \`conjunctivplural1\` LIKE "tgi nus ${term}"
        OR \`conjunctivplural2\` LIKE "tgi vus ${term}"
        OR \`conjunctivplural3\` LIKE "tg'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "eu ${term}"
        OR \`cundizionalsing1\` LIKE "i ${term}"
        OR \`cundizionalsing2\` LIKE "tü ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalsing3\` LIKE "i ${term}"
        OR \`cundizionalplural1\` LIKE "nus ${term}"
        OR \`cundizionalplural2\` LIKE "vus ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "tg'eu ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "tg'i ${term}"
        OR \`conjunctivimperfectsing2\` LIKE "tgi tü ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "tg'el/ella ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "tg'i ${term}"
        OR \`conjunctivimperfectplural1\` LIKE "tgi nus ${term}"
        OR \`conjunctivimperfectplural2\` LIKE "tgi vus ${term}"
        OR \`conjunctivimperfectplural3\` LIKE "tg'els/ellas ${term}"
        OR \`futursing1\` LIKE "eu ${term}"
        OR \`futursing1\` LIKE "i ${term}"
        OR \`futursing2\` LIKE "tü ${term}"
        OR \`futursing3\` LIKE "el/ella ${term}"
        OR \`futursing3\` LIKE "i ${term}"
        OR \`futurplural1\` LIKE "nus ${term}"
        OR \`futurplural2\` LIKE "vus ${term}"
        OR \`futurplural3\` LIKE "els/ellas ${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`imperativ3\` LIKE "${term}"
        OR \`imperativ4\` LIKE "${term}"
        OR \`imperativ5\` LIKE "${term}"
        OR \`imperativ6\` LIKE "${term}"
        OR \`preschentencliticsing1\` LIKE "${term}"
        OR \`preschentencliticsing2\` LIKE "${term}"
        OR \`preschentencliticsing3m\` LIKE "${term}"
        OR \`preschentencliticsing3f\` LIKE "${term}"
        OR \`preschentencliticplural1\` LIKE "${term}"
        OR \`preschentencliticplural2\` LIKE "${term}"
        OR \`preschentencliticplural3\` LIKE "${term}"
        OR \`imperfectencliticsing1\` LIKE "${term}"
        OR \`imperfectencliticsing2\` LIKE "${term}"
        OR \`imperfectencliticsing3m\` LIKE "${term}"
        OR \`imperfectencliticsing3f\` LIKE "${term}"
        OR \`imperfectencliticplural1\` LIKE "${term}"
        OR \`imperfectencliticplural2\` LIKE "${term}"
        OR \`imperfectencliticplural3\` LIKE "${term}"
        OR \`cundizionalencliticsing1\` LIKE "${term}"
        OR \`cundizionalencliticsing2\` LIKE "${term}"
        OR \`cundizionalencliticsing3m\` LIKE "${term}"
        OR \`cundizionalencliticsing3f\` LIKE "${term}"
        OR \`cundizionalencliticplural1\` LIKE "${term}"
        OR \`cundizionalencliticplural2\` LIKE "${term}"
        OR \`cundizionalencliticplural3\` LIKE "${term}"
        OR \`futurencliticsing1\` LIKE "${term}"
        OR \`futurencliticsing2\` LIKE "${term}"
        OR \`futurencliticsing3m\` LIKE "${term}"
        OR \`futurencliticsing3f\` LIKE "${term}"
        OR \`futurencliticplural1\` LIKE "${term}"
        OR \`futurencliticplural2\` LIKE "${term}"
        OR \`futurencliticplural3\` LIKE "${term}"
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
        OR \`preschentsing1\` LIKE "jeu ${term}"
        OR \`preschentsing2\` LIKE "ti ${term}"
        OR \`preschentsing3\` LIKE "el/ella ${term}"
        OR \`preschentplural1\` LIKE "nus ${term}"
        OR \`preschentplural2\` LIKE "vus ${term}"
        OR \`preschentplural3\` LIKE "els/ellas ${term}"
        OR \`imperfectsing1\` LIKE "jeu ${term}"
        OR \`imperfectsing2\` LIKE "ti ${term}"
        OR \`imperfectsing3\` LIKE "el/ella ${term}"
        OR \`imperfectplural1\` LIKE "nus ${term}"
        OR \`imperfectplural2\` LIKE "vus ${term}"
        OR \`imperfectplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectfs\` LIKE "${term}"
        OR \`participperfectms\` LIKE "${term}"
        OR \`participperfectfp\` LIKE "${term}"
        OR \`participperfectmp\` LIKE "${term}"
        OR \`conjunctivsing1\` LIKE "che jeu ${term}"
        OR \`conjunctivsing2\` LIKE "che ti ${term}"
        OR \`conjunctivsing3\` LIKE "ch'el/ella ${term}"
        OR \`conjunctivplural1\` LIKE "che nus ${term}"
        OR \`conjunctivplural2\` LIKE "che vus ${term}"
        OR \`conjunctivplural3\` LIKE "ch'els/ellas ${term}"
        OR \`cundizionalsing1\` LIKE "jeu ${term}"
        OR \`cundizionalsing2\` LIKE "ti ${term}"
        OR \`cundizionalsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalplural1\` LIKE "nus ${term}"
        OR \`cundizionalplural2\` LIKE "vus ${term}"
        OR \`cundizionalplural3\` LIKE "els/ellas ${term}"
        OR \`cundizionalindirectsing1\` LIKE "jeu ${term}"
        OR \`cundizionalindirectsing2\` LIKE "ti ${term}"
        OR \`cundizionalindirectsing3\` LIKE "el/ella ${term}"
        OR \`cundizionalindirectplural1\` LIKE "nus ${term}"
        OR \`cundizionalindirectplural2\` LIKE "vus ${term}"
        OR \`cundizionalindirectplural3\` LIKE "els/ellas ${term}"
        OR \`conjunctivimperfectsing1\` LIKE "che jeu ${term}"
        OR \`conjunctivimperfectsing2\` LIKE "che ti ${term}"
        OR \`conjunctivimperfectsing3\` LIKE "ch'el/ella ${term}"
        OR \`conjunctivimperfectplural1\` LIKE "che nus ${term}"
        OR \`conjunctivimperfectplural2\` LIKE "che vus ${term}"
        OR \`conjunctivimperfectplural3\` LIKE "ch'els/ellas ${term}"
        OR \`futursing1\` LIKE "jeu ${term}"
        OR \`futursing2\` LIKE "ti ${term}"
        OR \`futursing3\` LIKE "el/ella ${term}"
        OR \`futurplural1\` LIKE "nus ${term}"
        OR \`futurplural2\` LIKE "vus ${term}"
        OR \`futurplural3\` LIKE "els/ellas ${term}"
        OR \`participperfectmspredicativ\` LIKE "${term}"
        OR \`imperativ1\` LIKE "${term}"
        OR \`imperativ2\` LIKE "${term}"
        OR \`gerundium\` LIKE "${term}"
      `;
    }

    return query;
  }

  private firstLetterUppercase(s) {
    if (!s) {
      return s;
    }
    return s.replace(/^.{1}/g, s[0].toUpperCase());
  }
}
