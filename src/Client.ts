import { EventBus } from "./eventBus"
import { Master } from "./Master"
import { IClient } from "./types"
import { Channels, delay, getTimeForClient } from "./utils"

export class Client implements IClient {
  private master: null | Master = null
  constructor(private name: string) { 
    this.start()
  }
  public getName(): string {
    return this.name
  }
  private start(): void {
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
    this.master = master
  }
  public async clearMaster(): Promise<void> {
    this.master = null
    await delay(getTimeForClient())
    this.start()
  }
}