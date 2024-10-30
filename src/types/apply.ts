
export interface IApplyData {
  icspRqstDt: string
  cucoChrrNm: string
  cucoChrrHpno: string
  svcNm: string
  entrNo: string
  brno: string
  cucoNm: string
  sbscUpldSpedVlue: number
  sbscDownSpedVlue: number
  icspRqstUpldSped: number
  icspRqstDownSped: number
  icspRqstPrssFnshYn: string
  sbscSpedRorgYn: string
}

export interface IApplyParams {
  entrNo?: string
  brno?: string
  icspRqstStartDt: string
  icspRqstEndDt: string
  page?: number
  perPageNum?: number
  exelDownRsnKdCd?: string

}