export const MASTERS_COUNT = 5
export const CLIENT_COUNT = 7

// 20 - 60 секунд
export const getTimeForClient = () => {
  return( Math.floor(Math.random() * 40) + 20) * 1000
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export enum Channels {
  WaitClient = "WaitClient",
  WaitMaster = "WaitMaster",
}