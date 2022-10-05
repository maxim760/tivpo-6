import { Client } from "./Client";
import { Master } from "./Master";

export interface IMaster {
  setClient(client: Client): void,
  clearClient(): void,
}

export type IClient = {
  getName(): string,
  setMaster(master: Master): void,
  clearMaster(): Promise<void>
}

export type IBarberShop = {
  start(): void,
}