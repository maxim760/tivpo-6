import { Client } from "./Client";
import { Master } from "./Master";
import { IBarberShop } from "./types";

export class BarberShop implements IBarberShop {
  private clients: Client[] = []
  private masters: Master[] = []

  constructor(private mastersSize: number, private clientSize: number) {}
  start(): void {
    this.clients = Array.from({length: this.clientSize}, (_, i) => new Client(`Клиент ${i+1}`))
    this.masters = Array.from({ length: this.mastersSize }, (_, i) => new Master(`Мастер ${i+1}`))
  }
}