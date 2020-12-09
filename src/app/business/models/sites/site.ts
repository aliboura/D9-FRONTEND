export class Site {
  id: number;
  codeSite: string;
  dateD1: Date;
  nomSite: string;
  numSite: string;
  prioriteRadio: string;
  regionId: string;
  serviceDemandeur: string;
  audited: boolean;
  closed: boolean;
  userV1: string;
  userOMV1: string;
  userV1Date: Date;
  userV2: string;
  userOMV2: string;
  userV2Date: Date;
  powerSupplyConform: boolean;
  typeSiteId: string;
  typeSiteLib: string;
  wilayaId: number;
  wilayaLabel: string;

  constructor(siteId?: number,
              siteCode?: string,
              dateD1?: Date,
              typeSiteId?: string,
              siteName?: string,
              regionId?: string,
              wilayaId?: number,
              wilayaLabel?: string,
              siteUserV1?: string,
              siteUserV2?: string) {
    this.id = siteId;
    this.codeSite = siteCode;
    this.dateD1 = dateD1;
    this.typeSiteId = typeSiteId;
    this.nomSite = siteName;
    this.regionId = regionId;
    this.wilayaId = wilayaId;
    this.wilayaLabel = wilayaLabel;
    this.userV1 = siteUserV1 || "";
    this.userV2 = siteUserV2 || "";
  }
}
