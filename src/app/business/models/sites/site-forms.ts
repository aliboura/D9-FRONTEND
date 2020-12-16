export class SiteForms {
  id: number;
  codeSite: string;
  fileName: string;
  fileType: string;
  observation: string;
  formsFile: string;
  decisionId: number;
  decisionLabel: string;


  constructor(codeSite?: string, fileName?: string, fileType?: string, observation?: string, formsFile?: string, decisionId?: number, decisionLabel?: string) {
    this.codeSite = codeSite;
    this.fileName = fileName;
    this.fileType = fileType;
    this.observation = observation;
    this.formsFile = formsFile;
    this.decisionId = decisionId;
    this.decisionLabel = decisionLabel;
  }
}
