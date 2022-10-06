import { Client } from "./Client";
import { EventBus } from "./eventBus";
import { IMaster } from "./types";
import { Channels, delay, getTimeForClient } from "./utils";
import assert from "node:assert/strict" 

export class Master implements IMaster {
  private client: null | Client = null
  constructor(private name: string) {
    assert.ok(typeof name === "string" && name.trim() !== "", "Неправильный параметр name в конструкторе Master")
    this.subscribe()
    if (EventBus.channels[Channels.WaitMaster]?.length) {
      this.publish()
    }
  }
  private publish(): void {
    EventBus.publish(Channels.WaitMaster, this, 1)
  }
  private subscribe(withLog: boolean = false): void {
    assert.equal(this.client, null, "Не должно быть клиента на момент метода subscribe класса Master")
    EventBus.subscribe<Client>(Channels.WaitClient, (client) => {
      withLog && console.log(this.name + " дождался клиента: " + client.getName())
      this.setClient(client)
      assert.equal(this.client, client, "Неправильное присвоение клиента в методе subscribe класса Master")
    })
  }
  public setClient(client: Client): void {
    assert.ok(client !== null && client instanceof Client, "Неправильный параметр в методе setClient класса Master")
    this.client = client
    assert.equal(client, this.client, "Неправильное присвоение клиента в методе setClient класса Master")
    this.client.setMaster(this)
    assert.equal(this, this.client.getMaster(), "Неправильное присвоение мастера клиенту в методе setClient класса Master")
    this.make()
  }
  public clearClient(): void {
    this.client?.clearMaster()
    this.client = null
    assert.equal(null, this.client, "Неправильное присвоение клиента в методе clearClient класса Master")
  }
  private async make(): Promise<void> {
    assert.ok(this.client !== null, "На момент методе make класса Master у мастера должен быть клиент")
    if (!this.client) {
      return
    }
    const time = getTimeForClient()
    console.log(`${this.name} начал стричь клиента: ${this.client?.getName()} (${time/1000}сек)`)
    await delay(time)
    console.log(this.name + " закончил стричь клиента: " + this.client?.getName())
    this.clearClient()
    this.subscribe(true)
    assert.equal(this.client, null, "После окончания стрижки клиента у мастера быть не должно в методе make класса Mater")
    if (!!EventBus.channels[Channels.WaitMaster]?.length) {
      this.publish()
    } else {
      console.log(this.name + " свободен")
    }
  }
}