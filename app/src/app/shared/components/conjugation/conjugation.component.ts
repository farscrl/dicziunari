import { Component, Input, SimpleChanges } from '@angular/core';
import { ConfigService } from "../../../services/config.service";

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss'],
})
export class ConjugationComponent {
  @Input()
  public lemma;

  constructor(private configService: ConfigService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.lemma || ! changes.lemma.currentValue) {
      return;
    }
    if (this.configService.getSelectedDictionary() === 'sursilv') {
      this.lemma = this.updateSursilvanLemma(changes.lemma.currentValue);
    }
  }

  private updateSursilvanLemma(lemma: any): any {
    const infinitiv = lemma['infinitiv'];

    lemma['preschentsing1'] = this.addPrefix(lemma['preschentsing1'], 'jeu ', '');
    lemma['preschentsing2'] = this.addPrefix(lemma['preschentsing2'], 'ti ', '');
    lemma['preschentsing3'] = this.addPrefix(lemma['preschentsing3'], 'el/ella ', '');
    lemma['preschentplural1'] = this.addPrefix(lemma['preschentplural1'], 'nus ', '');
    lemma['preschentplural2'] = this.addPrefix(lemma['preschentplural2'], 'vus ', '');
    lemma['preschentplural3'] = this.addPrefix(lemma['preschentplural3'], 'els/ellas ', '');

    lemma['imperfectsing1'] = this.addPrefix(lemma['imperfectsing1'], 'jeu ', '');
    lemma['imperfectsing2'] = this.addPrefix(lemma['imperfectsing2'], 'ti ', '');
    lemma['imperfectsing3'] = this.addPrefix(lemma['imperfectsing3'], 'el/ella ', '');
    lemma['imperfectplural1'] = this.addPrefix(lemma['imperfectplural1'], 'nus ', '');
    lemma['imperfectplural2'] = this.addPrefix(lemma['imperfectplural2'], 'vus ', '');
    lemma['imperfectplural3'] = this.addPrefix(lemma['imperfectplural3'], 'els/ellas ', '');

    lemma['conjunctivsing1'] = this.addPrefix(lemma['conjunctivsing1'], 'che jeu ', '');
    lemma['conjunctivsing2'] = this.addPrefix(lemma['conjunctivsing2'], 'che ti ', '');
    lemma['conjunctivsing3'] = this.addPrefix(lemma['conjunctivsing3'], 'che el/ella ', '');
    lemma['conjunctivplural1'] = this.addPrefix(lemma['conjunctivplural1'], 'che nus ', '');
    lemma['conjunctivplural2'] = this.addPrefix(lemma['conjunctivplural2'], 'che vus ', '');
    lemma['conjunctivplural3'] = this.addPrefix(lemma['conjunctivplural3'], 'che els/ellas ', '');

    lemma['cundizionalsing1'] = this.addPrefix(lemma['cundizionalsing1'], 'jeu ', '');
    lemma['cundizionalsing2'] = this.addPrefix(lemma['cundizionalsing2'], 'ti ', '');
    lemma['cundizionalsing3'] = this.addPrefix(lemma['cundizionalsing3'], 'el/ella ', '');
    lemma['cundizionalplural1'] = this.addPrefix(lemma['cundizionalplural1'], 'nus ', '');
    lemma['cundizionalplural2'] = this.addPrefix(lemma['cundizionalplural2'], 'vus ', '');
    lemma['cundizionalplural3'] = this.addPrefix(lemma['cundizionalplural3'], 'els/ellas ', '');

    lemma['futursing1'] = this.startsWithVowel(infinitiv) ? 'jeu vegnel ad ' + infinitiv : 'jeu vegnel a ' + infinitiv;
    lemma['futursing2'] = this.startsWithVowel(infinitiv) ? 'ti vegns ad ' + infinitiv : 'ti vegns a ' + infinitiv;
    lemma['futursing3'] = this.startsWithVowel(infinitiv) ? 'el/ella vegn ad ' + infinitiv : 'el/ella vegn a ' + infinitiv;
    lemma['futurplural1'] = this.startsWithVowel(infinitiv) ? 'nus vegnin ad ' + infinitiv : 'nus vegnin a ' + infinitiv;
    lemma['futurplural2'] = this.startsWithVowel(infinitiv) ? 'vus vegnis ad ' + infinitiv : 'vus vegnis a ' + infinitiv;
    lemma['futurplural3'] = this.startsWithVowel(infinitiv) ? 'els/ellas vegnan ad ' + infinitiv : 'els/ellas vegnan a ' + infinitiv;

    lemma['participperfectms'] = this.addPrefix(lemma['participperfectms'], '', '');
    lemma['participperfectmp'] = this.addPrefix(lemma['participperfectmp'], '', '');
    lemma['participperfectfs'] = this.addPrefix(lemma['participperfectfs'], '', '');
    lemma['participperfectfp'] = this.addPrefix(lemma['participperfectfp'], '', '');

    lemma['gerundium'] = this.addPrefix(lemma['gerundium'], '', '');

    lemma['imperativ1'] = this.addPrefix(lemma['imperativ1'], '', '!');
    lemma['imperativ2'] = this.addPrefix(lemma['imperativ2'], '', '!');

    return lemma;
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
}
