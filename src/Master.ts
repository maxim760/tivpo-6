import { Client } from "./Client";
import { EventBus } from "./eventBus";
import { IMaster } from "./types";
import { Channels, delay, getTimeForClient } from "./utils";

export class Master implements IMaster {
  private client: null | Client = null
  constructor(private name: string) {
    this.subscribe()
    if (EventBus.channels[Channels.WaitMaster]?.length) {
      this.publish()
    }
  }
  private publish(): void {
    EventBus.publish(Channels.WaitMaster, this, 1)
  }
  private subscribe(withLog: boolean = false): void {
    EventBus.subscribe<Client>(Channels.WaitClient, (client) => {
      withLog && console.log(this.name + " дождался клиента: " + client.getName())
      this.setClient(client)
    })
  }
  public setClient(client: Client): void {
    this.client = client
    this.client.setMaster(this)
    this.make()
  }
  public clearClient(): void {
    this.client?.clearMaster()
    this.client = null
  }
  private async make(): Promise<void> {
    if (!this.client) {
      return
    }
    const time = getTimeForClient()
    console.log(`${this.name} начал стричь клиента: ${this.client?.getName()} (${time/1000}сек)`)
    await delay(time)
    console.log(this.name + " закончил стричь клиента: " + this.client?.getName())
    this.subscribe(true)
    this.clearClient()
    if (!!EventBus.channels[Channels.WaitMaster]?.length) {
      this.publish()
    } else {
      console.log(this.name + " свободен")
    }
  }
}