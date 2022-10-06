import { Client } from "./Client";
import { Master } from "./Master";
import { IBarberShop } from "./types";
import assert from "node:assert/strict" 

export class BarberShop implements IBarberShop {
  private clients: Client[] = []
  private masters: Master[] = []

  constructor(private mastersSize: number, private clientSize: number) {
    assert.ok(typeof mastersSize === "number" && mastersSize > 0, "Неправильный параметр masterSize в конструкторе BarberShop")
    assert.ok(typeof clientSize === "number" && clientSize > 0, "Неправильный параметр masterSize в конструкторе BarberShop")
  }
  start(): void {
    this.clients = Array.from({ length: this.clientSize }, (_, i) => new Client(`Клиент ${i + 1}`))
    assert.ok(this.clientSize === this.clients.length, "Неправильное число клиентов")
    assert.ok(this.clients.every((client) => client instanceof Client), "Неправильный класс у объекта клиента")
    this.masters = Array.from({ length: this.mastersSize }, (_, i) => new Master(`Мастер ${i+1}`))
    assert.ok(this.mastersSize === this.masters.length, "Неправильное число мастеров")
    assert.ok(this.masters.every((master) => master instanceof Master), "Неправильный класс у объекта мастера")
  }
}