import {Injectable} from "@angular/core";
import {Share} from '@capacitor/share';
import {CanvasTextWrapper} from "canvas-wrapper";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class ImageCreatorUtil {

  private canShare = false;

  private rm: string;
  private de: string;
  private text: string;

  private isSursilvan = false;

  private bgImage: HTMLImageElement;
  private logoImage: HTMLImageElement;

  constructor(
    private translateService: TranslateService,
  ) {
    Share.canShare().then(result => {
      this.canShare = result.value;
    });
    this.bgImage = this.loadImage("/assets/share/share.png");
    this.logoImage = this.loadImage("/assets/share/logo-share.png");
    this.logoImage.width = 130;
  }
  public async createImage(rm: string, de: string) {
    this.rm = rm;
    this.de = de;
    this.isSursilvan = false;

    const ctxBg = this.getBgCanvasContext();

    this.addRomanshCanvas(ctxBg);
    this.generateGermanCanvas(ctxBg);

    await this.shareImage(ctxBg.canvas);
  }

  public async createImageSursilvan(text: string) {
    this.text = text;
    this.isSursilvan = true;

    this.text = this.truncate(this.text, 1500);

    const ctxBg = this.getBgCanvasContext();

    this.addSursilvanCanvas(ctxBg);

    await this.shareImage(ctxBg.canvas);
  }

  private loadImage(src: string): HTMLImageElement {
    const image = new Image();
    image.src = src;
    return image;
  }

  private getBgCanvasContext(): CanvasRenderingContext2D {
    const canvasBg = document.createElement('canvas') as HTMLCanvasElement | null;
    canvasBg.width = 800;
    canvasBg.height = 1000;
    const ctxBg = canvasBg.getContext('2d');

    ctxBg.drawImage(this.bgImage,0,0);
    ctxBg.drawImage(this.logoImage,30,810);

    ctxBg.font = '40px "Fira Sans", sans-serif';
    ctxBg.fillStyle = '#fff';
    // console.log(ctxBg.measureText("www.dicziunari.ch"));
    ctxBg.fillText("www.dicziunari.ch", 452, 967);

    return ctxBg;
  }

  private getTextCanvas(text: string, big: boolean = false): HTMLCanvasElement {
    const canvasText = document.createElement('canvas') as HTMLCanvasElement | null;
    if (big) {
      canvasText.width = 740;
      canvasText.height = 740;
    } else {
      canvasText.width = 740;
      canvasText.height = 330;
    }
    const ctx = canvasText.getContext('2d');
    ctx.fillStyle = '#fff';

    CanvasTextWrapper(canvasText, text,{
      font: "70px -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Roboto, sans-serif",
      textAlign: 'left',
      verticalAlign: 'top',
      sizeToFill: true,
      maxFontSizeToFill: 100,
      strokeText: false
    });

    return canvasText;
  }

  private addRomanshCanvas(ctxBg: CanvasRenderingContext2D) {
    const canvas = this.getTextCanvas(this.rm);
    ctxBg.drawImage(canvas, 30, 30);
  }

  private generateGermanCanvas(ctxBg: CanvasRenderingContext2D) {
    const canvas = this.getTextCanvas(this.de);
    ctxBg.drawImage(canvas, 30, 400);
  }

  private addSursilvanCanvas(ctxBg: CanvasRenderingContext2D) {
    const canvas = this.getTextCanvas(this.text, true);
    ctxBg.drawImage(canvas, 30, 30);
  }

  private async shareImage(canvasBg: HTMLCanvasElement) {
    const dataUrl = canvasBg.toDataURL();
    const fileName = 'dicziunari_' + new Date().getTime() + '.png';

    if (this.canShare) {
      const data = dataUrl.split(',')[1];

      await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Cache,
      });

      const pathResult = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache
      });

      const options = {
        title: '',
        files: [pathResult.uri],
        dialogTitle: this.translateService.instant('SHARE.DIALOG_TITLE')
      };

      if (this.isSursilvan) {
        options.title = '🇷 ' + this.truncate(this.text, 100);
      } else {
        options.title = '🇷 ' + this.truncate(this.rm, 50) + ' 🇩 ' + this.truncate(this.de, 50);
      }

      Share.share(options).then((result) => {
        console.log(result);
      });
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    }
  }

  private truncate(input: string, length: number): string {
    if (input.length > length) {
      return input.substring(0, length) + " [\u2026]";
    }

    return input;
  }
}
