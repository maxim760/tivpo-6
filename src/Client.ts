import { EventBus } from "./eventBus"
import { Master } from "./Master"
import { IClient } from "./types"
import { Channels, delay, getTimeForClient } from "./utils"
import assert from "node:assert/strict" 

export class Client implements IClient {
  private master: null | Master = null
  constructor(private name: string) { 
    assert.ok(typeof name === "string" && name.trim() !== "", "Неправильный параметр name в конструкторе Client")
    this.start()
  }
  public getName(): string {
    const res = this.name
    assert.ok(typeof res === "string" && res.trim() !== "", "Неправильный ответ в методе getName класса Client")
    return res
  }
  public getMaster(): null | Master {
    const res = this.master
    assert.ok(res === null || res instanceof Master, "Неправильный ответ в методе getMaster класса Client")
    return res
  }
  private start(): void {
    assert.equal(null, this.master, "Мастера не должно быть у клиента на момент метода start в классе Client")
    if (EventBus.channels[Channels.WaitClient]?.length) {
      EventBus.publish(Channels.WaitClient, this, 1)
    } else {
      this.subscribe()
    }
  }
  private subscribe(): void {
    EventBus.subscribe<Master>(Channels.WaitMaster, () => {
      EventBus.publish(Channels.WaitClient, this, 1)
    })
  }
  public setMaster(master: Master): void {
    assert.ok(master !== null && master instanceof Master, "Неправильный параметр в методе setMaster класса Client")
    this.master = master
    assert.equal(master, this.master, "Неправильное присвоение мастера в методе setMaster класса Client")
  }
  public async clearMaster(): Promise<void> {
    this.master = null
    assert.equal(null, this.master, "Неправильное присвоение мастера в методе clearMaster класса Client")
    await delay(getTimeForClient())
    this.start()
  }
}