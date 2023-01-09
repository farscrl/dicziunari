import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfigService } from "../../../services/config.service";
import { Dictionary } from "../../../../data/search";
import { Pronouns } from "../../../../data/pronouns";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss'],
})
export class ConjugationComponent implements OnInit, OnChanges {
  @Input()
  public lemma;

  @Input()
  public dictionary: Dictionary;

  public pronouns = new Pronouns();

  public searchString? :string;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchString = params.searchString;
      console.log(this.searchString);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.lemma || ! changes.lemma.currentValue) {
      return;
    }
    this.definePronouns();
  }

  private updateSursilvanLemma(lemma: any): any {
    this.pronouns.preschentsing1 = 'jeu ';
    this.pronouns.preschentsing2 = 'ti ';
    this.pronouns.preschentsing3 = 'el/ella ';
    this.pronouns.preschentplural1 = 'nus ';
    this.pronouns.preschentplural2 = 'vus ';
    this.pronouns.preschentplural3 = 'els/ellas ';

    this.pronouns.imperfectsing1 = 'jeu ';
    this.pronouns.imperfectsing2 = 'ti ';
    this.pronouns.imperfectsing3 = 'el/ella ';
    this.pronouns.imperfectplural1 = 'nus ';
    this.pronouns.imperfectplural2 = 'vus ';
    this.pronouns.imperfectplural3 = 'els/ellas ';

    this.pronouns.conjunctivsing1 = 'che jeu ';
    this.pronouns.conjunctivsing2 = 'che ti ';
    this.pronouns.conjunctivsing3 = 'che el/ella ';
    this.pronouns.conjunctivplural1 = 'che nus ';
    this.pronouns.conjunctivplural2 = 'che vus ';
    this.pronouns.conjunctivplural3 = 'che els/ellas ';

    this.pronouns.cundizionalsing1 = 'jeu ';
    this.pronouns.cundizionalsing2 = 'ti ';
    this.pronouns.cundizionalsing3 = 'el/ella ';
    this.pronouns.cundizionalplural1 = 'nus ';
    this.pronouns.cundizionalplural2 = 'vus ';
    this.pronouns.cundizionalplural3 = 'els/ellas ';

    this.pronouns.futursing1 = 'jeu ';
    this.pronouns.futursing2 = 'ti ';
    this.pronouns.futursing3 = 'el/ella ';
    this.pronouns.futurplural1 = 'nus ';
    this.pronouns.futurplural2 = 'vus ';
    this.pronouns.futurplural3 = 'els/ellas ';

    const infinitiv = this.lemma['infinitiv'];

    this.lemma['futursing1'] = this.startsWithVowel(infinitiv) ? 'vegnel ad ' + infinitiv : 'vegnel a ' + infinitiv;
    this.lemma['futursing2'] = this.startsWithVowel(infinitiv) ? 'vegns ad ' + infinitiv : 'vegns a ' + infinitiv;
    this.lemma['futursing3'] = this.startsWithVowel(infinitiv) ? 'vegn ad ' + infinitiv : 'vegn a ' + infinitiv;
    this.lemma['futurplural1'] = this.startsWithVowel(infinitiv) ? 'vegnin ad ' + infinitiv : 'vegnin a ' + infinitiv;
    this.lemma['futurplural2'] = this.startsWithVowel(infinitiv) ? 'vegnis ad ' + infinitiv : 'vegnis a ' + infinitiv;
    this.lemma['futurplural3'] = this.startsWithVowel(infinitiv) ? 'vegnan ad ' + infinitiv : 'vegnan a ' + infinitiv;

    this.lemma['participperfectms'] = this.addPrefix(this.lemma['participperfectms'], '', '');
    this.lemma['participperfectmp'] = this.addPrefix(this.lemma['participperfectmp'], '', '');
    this.lemma['participperfectfs'] = this.addPrefix(this.lemma['participperfectfs'], '', '');
    this.lemma['participperfectfp'] = this.addPrefix(this.lemma['participperfectfp'], '', '');

    this.lemma['gerundium'] = this.addPrefix(this.lemma['gerundium'], '', '');

    this.lemma['imperativ1'] = this.addPrefix(this.lemma['imperativ1'], '', '!');
    this.lemma['imperativ2'] = this.addPrefix(this.lemma['imperativ2'], '', '!');
  }

  private definePronouns() {
    switch (this.dictionary) {
      case Dictionary.rumgrischun:
        const ppRumGrConj = ["che jau ", "che ti ", "ch'el/ella ", "che nus ", "che vus ", "ch'els/ellas ", "ch'i ", "ch'igl"];
        const ppRumGr = ["jau ", "ti ", "el/ella ", "nus ", "vus ", "els/ellas ", "i ", "igl "];
        const ppRumGrRefl = ["ma ", "ta ", "sa ", "ans ", "as ", "sa ", "", ""];
        const ppRumGrReflVowel = ["m'", "t'", "s'", "ans ", "as ", "s'", "", ""];
        this.extractPronouns(ppRumGrConj, ppRumGr, ppRumGrRefl, ppRumGrReflVowel);
        break;
      case Dictionary.sutsilv:
        const ppSutsilvConj = ["ca jou ", "ca tei ", "c'el/ella ", "ca nus ", "ca vus ", "c'els/ellas ", "c'i ", "c'igl"];
        const ppSutsilv = ["jou ", "tei ", "el/ella ", "nus ", "vus ", "els/ellas ", "i ", "igl "];
        const ppSutsilvRefl = ["ma ", "ta ", "sa ", "ans ", "as ", "sa ", "", ""];
        const ppSutsilvReflVowel = ["m'", "t'", "s'", "ans ", "as ", "s'", "", ""];
        this.extractPronouns(ppSutsilvConj, ppSutsilv, ppSutsilvRefl, ppSutsilvReflVowel);
        break;
      case Dictionary.surm:
        const ppSurmConj = ["tg'ia ", "tgi te ", "tg'el/ella ", "tgi nous ", "tgi vous ", "tg'els/ellas ", "tg'i ", "tg'igl"];
        const ppSurm = ["ia ", "te ", "el/ella ", "nous ", "vous ", "els/ellas ", "i ", "igl "];
        const ppSurmRefl = ["ma ", "ta ", "sa ", "ans ", "az ", "sa ", "", ""];
        const ppSurmReflVowel = ["m'", "t'", "s'", "ans ", "az ", "s'", "", ""];
        this.extractPronouns(ppSurmConj, ppSurm, ppSurmRefl, ppSurmReflVowel);
        break;
      case Dictionary.sursilv:
        this.updateSursilvanLemma(this.lemma.currentValue);
        break;
      case Dictionary.puter:
      case Dictionary.vall:
      default:
        // do nothing
    }
  }

  private extractPronouns(ppConj: string[], pp: string[], ppRefl: string[], ppReflVowel: string[]) {
    [this.lemma['preschentsing1'], this.pronouns.preschentsing1] = this.extractPrefixes(this.lemma['preschentsing1'], [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['imperfectsing1'], this.pronouns.imperfectsing1] = this.extractPrefixes(this.lemma['imperfectsing1'], [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['conjunctivsing1'], this.pronouns.conjunctivsing1] = this.extractPrefixes(this.lemma['conjunctivsing1'], [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['cundizionalsing1'], this.pronouns.cundizionalsing1] = this.extractPrefixes(this.lemma['cundizionalsing1'], [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['futursing1'], this.pronouns.futursing1] = this.extractPrefixes(this.lemma['futursing1'], [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.lemma['preschentsing2'], this.pronouns.preschentsing2] = this.extractPrefixes(this.lemma['preschentsing2'], [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemma['imperfectsing2'], this.pronouns.imperfectsing2] = this.extractPrefixes(this.lemma['imperfectsing2'], [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemma['conjunctivsing2'], this.pronouns.conjunctivsing2] = this.extractPrefixes(this.lemma['conjunctivsing2'], [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemma['cundizionalsing2'], this.pronouns.cundizionalsing2] = this.extractPrefixes(this.lemma['cundizionalsing2'], [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);
    [this.lemma['futursing2'], this.pronouns.futursing2] = this.extractPrefixes(this.lemma['futursing2'], [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]]);

    [this.lemma['preschentsing3'], this.pronouns.preschentsing3] = this.extractPrefixes(this.lemma['preschentsing3'], [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['imperfectsing3'], this.pronouns.imperfectsing3] = this.extractPrefixes(this.lemma['imperfectsing3'], [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['conjunctivsing3'], this.pronouns.conjunctivsing3] = this.extractPrefixes(this.lemma['conjunctivsing3'], [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['cundizionalsing3'], this.pronouns.cundizionalsing3] = this.extractPrefixes(this.lemma['cundizionalsing3'], [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);
    [this.lemma['futursing3'], this.pronouns.futursing3] = this.extractPrefixes(this.lemma['futursing3'], [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]]);

    [this.lemma['preschentplural1'], this.pronouns.preschentplural1] = this.extractPrefixes(this.lemma['preschentplural1'], [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemma['imperfectplural1'], this.pronouns.imperfectplural1] = this.extractPrefixes(this.lemma['imperfectplural1'], [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemma['conjunctivplural1'], this.pronouns.conjunctivplural1] = this.extractPrefixes(this.lemma['conjunctivplural1'], [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemma['cundizionalplural1'], this.pronouns.cundizionalplural1] = this.extractPrefixes(this.lemma['cundizionalplural1'], [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);
    [this.lemma['futurplural1'], this.pronouns.futurplural1] = this.extractPrefixes(this.lemma['futurplural1'], [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]]);

    [this.lemma['preschentplural2'], this.pronouns.preschentplural2] = this.extractPrefixes(this.lemma['preschentplural2'], [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemma['imperfectplural2'], this.pronouns.imperfectplural2] = this.extractPrefixes(this.lemma['imperfectplural2'], [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemma['conjunctivplural2'], this.pronouns.conjunctivplural2] = this.extractPrefixes(this.lemma['conjunctivplural2'], [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemma['cundizionalplural2'], this.pronouns.cundizionalplural2] = this.extractPrefixes(this.lemma['cundizionalplural2'], [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);
    [this.lemma['futurplural2'], this.pronouns.futurplural2] = this.extractPrefixes(this.lemma['futurplural2'], [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]]);

    [this.lemma['preschentplural3'], this.pronouns.preschentplural3] = this.extractPrefixes(this.lemma['preschentplural3'], [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemma['imperfectplural3'], this.pronouns.imperfectplural3] = this.extractPrefixes(this.lemma['imperfectplural3'], [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemma['conjunctivplural3'], this.pronouns.conjunctivplural3] = this.extractPrefixes(this.lemma['conjunctivplural3'], [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemma['cundizionalplural3'], this.pronouns.cundizionalplural3] = this.extractPrefixes(this.lemma['cundizionalplural3'], [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
    [this.lemma['futurplural3'], this.pronouns.futurplural3] = this.extractPrefixes(this.lemma['futurplural3'], [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]]);
  }

  private extractPrefixes(lemma: string, prefixCandidates: string[]): string[] {
    let prefix = "";
    prefixCandidates.forEach(candidate => {
      if (lemma.startsWith(candidate)) {
        prefix += candidate;
        lemma = lemma.replace(candidate, "");
      }
    });

    return [lemma, prefix];
  }

  private addPrefix(value: string, prefix: string, suffix: string): string {
    const elements = value.split(/[\n|,]/);
    elements.forEach((e, idx) => {
      elements[idx] = prefix + e + suffix;
    });
    return elements.join(', ');
  }

  private startsWithVowel(word: string) {
    const vowelRegex = '^[aieouhAIEOUH].*'
    return word.match(vowelRegex)
  }

  get isSursilvan() {
    return this.dictionary === Dictionary.sursilv;
  }
}
