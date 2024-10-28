
export interface IUserData {
  rowNum: string
  cntcStrtDt: string
  entrNo: string
  encEntrNo: string
  entrStusNm: string
  cucoChrrNm: string
  brno: string
  lastLoginDttm: string
  userLginIp: string
  cucoChrrHpno: string
  cucoEmalAddr: string
  bizEmpNm: string
  bizEmpHpno: string
  bizEmpEmalAddr: string
}


export interface IUserParams {
  entrNo?: string
  brno?: string
  cucoChrrNm?: string
  lastLoginDttmStart: string
  lastLoginDttmEnd: string
  perPageNum: number
  page: number
}

export interface IUserDetailData {
  [key: string]: string
  entrNo: string
  cucoChrrNm: string
  brno: string
  connectDate: string
  connectIP: string
  cucoChrrHpno: string
  cucoEmalAddr: string
  bizEmpEmno: string
  bizEmpNm: string
  bizEmpHpno: string
  bizEmpEmalAddr: string
  cucoNm: string
  cucoEmalDomain: string
  bizEmpEmalDomain: string
}