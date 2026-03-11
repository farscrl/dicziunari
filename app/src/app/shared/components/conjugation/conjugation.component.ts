import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { Dictionary } from '../../../../data/search';
import { Pronouns } from '../../../../data/pronouns';
import { ActivatedRoute } from '@angular/router';
import { ConjugationPersonalComponent } from '../conjugation-personal/conjugation-personal.component';
import { ConjugationImpersonalComponent } from '../conjugation-impersonal/conjugation-impersonal.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss'],
  imports: [ConjugationPersonalComponent, ConjugationImpersonalComponent, TranslatePipe],
})
export class ConjugationComponent implements OnInit, OnChanges {
  private route = inject(ActivatedRoute);

  @Input()
  public lemma;

  @Input()
  public dictionary: Dictionary;

  public pronouns = new Pronouns();

  public searchString?: string;

  readonly Dictionary = Dictionary;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchString = params.searchString;
      // console.log(this.searchString);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.lemma || !changes.lemma.currentValue) {
      return;
    }
    if (this.lemma.inflectiontype === 'VERB') {
      this.definePronouns();
    }
  }

  private definePronouns() {
    switch (this.dictionary) {
      case Dictionary.rumgrischun:
        const ppRumGrConj = ['che jau ', 'che ti ', "ch'el/ella ", 'che nus ', 'che vus ', "ch'els/ellas ", "ch'i ", "ch'igl"];
        const ppRumGr = ['jau ', 'ti ', 'el/ella ', 'nus ', 'vus ', 'els/ellas ', 'i ', 'igl ', '']; // 1sg, 2sg, 3sg, 1pl, 2pl, 3pl, inpers, inpersVowel, Vallder2pl
        const ppRumGrRefl = ['ma ', 'ta ', 'sa ', 'ans ', 'as ', 'sa ', '', ''];
        const ppRumGrReflVowel = ["m'", "t'", "s'", 'ans ', 'as ', "s'", '', ''];
        this.extractPronouns(ppRumGrConj, ppRumGr, ppRumGrRefl, ppRumGrReflVowel);
        break;
      case Dictionary.sutsilv:
        const ppSutsilvConj = ['ca jou ', 'ca tei ', "c'el/ella ", 'ca nus ', 'ca vus ', "c'els/ellas ", "c'i ", "c'igl"];
        const ppSutsilv = ['jou ', 'tei ', 'el/ella ', 'nus ', 'vus ', 'els/ellas ', 'i ', 'igl ', ''];
        const ppSutsilvRefl = ['ma ', 'ta ', 'sa ', 'ans ', 'as ', 'sa ', '', ''];
        const ppSutsilvReflVowel = ["m'", "t'", "s'", 'ans ', 'as ', "s'", '', ''];
        this.extractPronouns(ppSutsilvConj, ppSutsilv, ppSutsilvRefl, ppSutsilvReflVowel);
        break;
      case Dictionary.surm:
        const ppSurmConj = ["tg'ia ", 'tgi te ', "tg'el/ella ", 'tgi nous ', 'tgi vous ', "tg'els/ellas ", "tg'i ", "tg'igl"];
        const ppSurm = ['ia ', 'te ', 'el/ella ', 'nous ', 'vous ', 'els/ellas ', 'i ', 'igl ', ''];
        const ppSurmRefl = ['ma ', 'ta ', 'sa ', 'ans ', 'az ', 'sa ', '', ''];
        const ppSurmReflVowel = ["m'", "t'", "s'", 'ans ', 'az ', "s'", '', ''];
        this.extractPronouns(ppSurmConj, ppSurm, ppSurmRefl, ppSurmReflVowel);
        break;
      case Dictionary.puter:
        const ppPuterConj = ["ch'eau ", 'cha tü ', "ch'el/ella ", 'cha nus ', 'cha vus ', "ch'els/ellas ", "ch'que ", 'cha que'];
        const ppPuter = ['eau ', 'tü ', 'el/ella ', 'nus ', 'vus ', 'els/ellas ', 'a/que ', 'a/que ', ''];
        const ppPuterRefl = ['am ', 'at ', 'as ', 'ans ', 'as ', 'as ', '', ''];
        const ppPuterReflVowel = ["m'", "t'", "s'", 'ans ', "s'", "s'", '', ''];
        this.extractPronouns(ppPuterConj, ppPuter, ppPuterRefl, ppPuterReflVowel);
        break;
      case Dictionary.vall:
        const ppVallConj = ["ch'eu ", 'cha tü ', "ch'el/ella ", 'cha nus ', 'cha vus ', "ch'els/ellas ", "ch'i ", "ch'igl"];
        const ppVall = ['eu ', 'tü ', 'el/ella ', 'nus ', 'vus ', 'els/ellas ', 'i ', 'igl ', 'vo '];
        const ppVallRefl = ['am ', 'at ', 'as ', 'ans ', 'as ', 'as ', '', ''];
        const ppVallReflVowel = ["m'", "t'", "s'", 'ans ', "s'", "s'", '', ''];
        this.extractPronouns(ppVallConj, ppVall, ppVallRefl, ppVallReflVowel);
        break;
      case Dictionary.sursilv:
        const ppSursilvanConj = ['che jeu ', 'che ti ', "ch'el/ella ", 'che nus ', 'che vus ', "ch'els/ellas ", '', ''];
        const ppSursilvan = ['jeu ', 'ti ', 'el/ella ', 'nus ', 'vus ', 'els/ellas ', '', '', ''];
        const ppSursilvanRefl = ['ma ', 'ta ', 'sa ', 'ans ', 'as ', 'sa ', '', ''];
        const ppSursilvanReflVowel = ["m'", "t'", "s'", 'ans ', 'as ', "s'", '', ''];
        this.extractPronouns(ppSursilvanConj, ppSursilvan, ppSursilvanRefl, ppSursilvanReflVowel);
        break;
      default:
      // do nothing
    }
  }

  private extractPronouns(ppConj: string[], pp: string[], ppRefl: string[], ppReflVowel: string[]) {
    [this.lemma['preschentsing1'], this.pronouns.preschentsing1] = this.extractPrefixes(this.lemma['preschentsing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['imperfectsing1'], this.pronouns.imperfectsing1] = this.extractPrefixes(this.lemma['imperfectsing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['conjunctivsing1'], this.pronouns.conjunctivsing1] = this.extractPrefixes(this.lemma['conjunctivsing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['cundizionalsing1'], this.pronouns.cundizionalsing1] = this.extractPrefixes(this.lemma['cundizionalsing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['futursing1'], this.pronouns.futursing1] = this.extractPrefixes(this.lemma['futursing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);

    [this.lemma['preschentsing2'], this.pronouns.preschentsing2] = this.extractPrefixes(this.lemma['preschentsing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);
    [this.lemma['imperfectsing2'], this.pronouns.imperfectsing2] = this.extractPrefixes(this.lemma['imperfectsing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);
    [this.lemma['conjunctivsing2'], this.pronouns.conjunctivsing2] = this.extractPrefixes(this.lemma['conjunctivsing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);
    [this.lemma['cundizionalsing2'], this.pronouns.cundizionalsing2] = this.extractPrefixes(this.lemma['cundizionalsing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);
    [this.lemma['futursing2'], this.pronouns.futursing2] = this.extractPrefixes(this.lemma['futursing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);

    [this.lemma['preschentsing3'], this.pronouns.preschentsing3] = this.extractPrefixes(this.lemma['preschentsing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['imperfectsing3'], this.pronouns.imperfectsing3] = this.extractPrefixes(this.lemma['imperfectsing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['conjunctivsing3'], this.pronouns.conjunctivsing3] = this.extractPrefixes(this.lemma['conjunctivsing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['cundizionalsing3'], this.pronouns.cundizionalsing3] = this.extractPrefixes(this.lemma['cundizionalsing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['futursing3'], this.pronouns.futursing3] = this.extractPrefixes(this.lemma['futursing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);

    [this.lemma['preschentplural1'], this.pronouns.preschentplural1] = this.extractPrefixes(this.lemma['preschentplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);
    [this.lemma['imperfectplural1'], this.pronouns.imperfectplural1] = this.extractPrefixes(this.lemma['imperfectplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);
    [this.lemma['conjunctivplural1'], this.pronouns.conjunctivplural1] = this.extractPrefixes(this.lemma['conjunctivplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);
    [this.lemma['cundizionalplural1'], this.pronouns.cundizionalplural1] = this.extractPrefixes(this.lemma['cundizionalplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);
    [this.lemma['futurplural1'], this.pronouns.futurplural1] = this.extractPrefixes(this.lemma['futurplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);

    [this.lemma['preschentplural2'], this.pronouns.preschentplural2] = this.extractPrefixes(this.lemma['preschentplural2'], [
      ppConj[4],
      pp[4],
      pp[8],
      ppRefl[4],
      ppReflVowel[4],
    ]);
    [this.lemma['imperfectplural2'], this.pronouns.imperfectplural2] = this.extractPrefixes(this.lemma['imperfectplural2'], [
      ppConj[4],
      pp[4],
      ppRefl[4],
      ppReflVowel[4],
    ]);
    [this.lemma['conjunctivplural2'], this.pronouns.conjunctivplural2] = this.extractPrefixes(this.lemma['conjunctivplural2'], [
      ppConj[4],
      pp[4],
      ppRefl[4],
      ppReflVowel[4],
    ]);
    [this.lemma['cundizionalplural2'], this.pronouns.cundizionalplural2] = this.extractPrefixes(this.lemma['cundizionalplural2'], [
      ppConj[4],
      pp[4],
      ppRefl[4],
      ppReflVowel[4],
    ]);
    [this.lemma['futurplural2'], this.pronouns.futurplural2] = this.extractPrefixes(this.lemma['futurplural2'], [
      ppConj[4],
      pp[4],
      ppRefl[4],
      ppReflVowel[4],
    ]);

    [this.lemma['preschentplural3'], this.pronouns.preschentplural3] = this.extractPrefixes(this.lemma['preschentplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);
    [this.lemma['imperfectplural3'], this.pronouns.imperfectplural3] = this.extractPrefixes(this.lemma['imperfectplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);
    [this.lemma['conjunctivplural3'], this.pronouns.conjunctivplural3] = this.extractPrefixes(this.lemma['conjunctivplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);
    [this.lemma['cundizionalplural3'], this.pronouns.cundizionalplural3] = this.extractPrefixes(this.lemma['cundizionalplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);
    [this.lemma['futurplural3'], this.pronouns.futurplural3] = this.extractPrefixes(this.lemma['futurplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);

    // conjunctiv imperfect — same pronoun patterns as conjunctiv
    [this.lemma['conjunctivimperfectsing1'], this.pronouns.conjunctivimperfectsing1] = this.extractPrefixes(
      this.lemma['conjunctivimperfectsing1'],
      [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]],
    );
    [this.lemma['conjunctivimperfectsing2'], this.pronouns.conjunctivimperfectsing2] = this.extractPrefixes(
      this.lemma['conjunctivimperfectsing2'],
      [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]],
    );
    [this.lemma['conjunctivimperfectsing3'], this.pronouns.conjunctivimperfectsing3] = this.extractPrefixes(
      this.lemma['conjunctivimperfectsing3'],
      [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]],
    );
    [this.lemma['conjunctivimperfectplural1'], this.pronouns.conjunctivimperfectplural1] = this.extractPrefixes(
      this.lemma['conjunctivimperfectplural1'],
      [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]],
    );
    [this.lemma['conjunctivimperfectplural2'], this.pronouns.conjunctivimperfectplural2] = this.extractPrefixes(
      this.lemma['conjunctivimperfectplural2'],
      [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]],
    );
    [this.lemma['conjunctivimperfectplural3'], this.pronouns.conjunctivimperfectplural3] = this.extractPrefixes(
      this.lemma['conjunctivimperfectplural3'],
      [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]],
    );

    // cundizional indirect — same pronoun patterns as cundizional
    [this.lemma['cundizionalindirectsing1'], this.pronouns.cundizionalindirectsing1] = this.extractPrefixes(
      this.lemma['cundizionalindirectsing1'],
      [ppConj[0], pp[0], ppRefl[0], ppReflVowel[0], ppConj[6], pp[6], ppConj[7], pp[7]],
    );
    [this.lemma['cundizionalindirectsing2'], this.pronouns.cundizionalindirectsing2] = this.extractPrefixes(
      this.lemma['cundizionalindirectsing2'],
      [ppConj[1], pp[1], ppRefl[1], ppReflVowel[1]],
    );
    [this.lemma['cundizionalindirectsing3'], this.pronouns.cundizionalindirectsing3] = this.extractPrefixes(
      this.lemma['cundizionalindirectsing3'],
      [ppConj[2], pp[2], ppRefl[2], ppReflVowel[2], ppConj[6], pp[6], ppConj[7], pp[7]],
    );
    [this.lemma['cundizionalindirectplural1'], this.pronouns.cundizionalindirectplural1] = this.extractPrefixes(
      this.lemma['cundizionalindirectplural1'],
      [ppConj[3], pp[3], ppRefl[3], ppReflVowel[3]],
    );
    [this.lemma['cundizionalindirectplural2'], this.pronouns.cundizionalindirectplural2] = this.extractPrefixes(
      this.lemma['cundizionalindirectplural2'],
      [ppConj[4], pp[4], ppRefl[4], ppReflVowel[4]],
    );
    [this.lemma['cundizionalindirectplural3'], this.pronouns.cundizionalindirectplural3] = this.extractPrefixes(
      this.lemma['cundizionalindirectplural3'],
      [ppConj[5], pp[5], ppRefl[5], ppReflVowel[5]],
    );

    // futur dubitativ — same pronoun patterns as futur
    [this.lemma['futurdubitativsing1'], this.pronouns.futurdubitativsing1] = this.extractPrefixes(this.lemma['futurdubitativsing1'], [
      ppConj[0],
      pp[0],
      ppRefl[0],
      ppReflVowel[0],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['futurdubitativsing2'], this.pronouns.futurdubitativsing2] = this.extractPrefixes(this.lemma['futurdubitativsing2'], [
      ppConj[1],
      pp[1],
      ppRefl[1],
      ppReflVowel[1],
    ]);
    [this.lemma['futurdubitativsing3'], this.pronouns.futurdubitativsing3] = this.extractPrefixes(this.lemma['futurdubitativsing3'], [
      ppConj[2],
      pp[2],
      ppRefl[2],
      ppReflVowel[2],
      ppConj[6],
      pp[6],
      ppConj[7],
      pp[7],
    ]);
    [this.lemma['futurdubitativplural1'], this.pronouns.futurdubitativplural1] = this.extractPrefixes(this.lemma['futurdubitativplural1'], [
      ppConj[3],
      pp[3],
      ppRefl[3],
      ppReflVowel[3],
    ]);
    [this.lemma['futurdubitativplural2'], this.pronouns.futurdubitativplural2] = this.extractPrefixes(this.lemma['futurdubitativplural2'], [
      ppConj[4],
      pp[4],
      ppRefl[4],
      ppReflVowel[4],
    ]);
    [this.lemma['futurdubitativplural3'], this.pronouns.futurdubitativplural3] = this.extractPrefixes(this.lemma['futurdubitativplural3'], [
      ppConj[5],
      pp[5],
      ppRefl[5],
      ppReflVowel[5],
    ]);
  }

  public enclSing3(m: string, f: string): string {
    if (!m) return f ?? '';
    if (!f || f === m) return m;
    return m + '\n' + f;
  }

  private extractPrefixes(lemma: string, prefixCandidates: string[]): string[] {
    if (!lemma) return ['', ''];
    const lines = lemma.split(/\r?\n/);
    let prefixes: string[] = [];
    let forms: string[] = [];

    lines.forEach((line, index) => {
      const prefix: string[] = [];
      prefixCandidates.forEach((candidate) => {
        if (line.startsWith(candidate)) {
          prefix.push(candidate);
          line = line.replace(candidate, '');
        }
      });
      forms.push(line);
      prefixes.push(prefix.join(' '));
    });

    return [forms.join('\n'), prefixes.join('\n')];
  }
}
