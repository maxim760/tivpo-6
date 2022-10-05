type IListener = (data: unknown) => void
type IChannels = Record<string, IListener[]>
type SubscribeFn = <T,>(name: string, listener: (data: T) => void) => void
type PublishFn = <T,>(name: string, data: T, count?: number) => void
type IEventBus = {
  channels: IChannels,
  subscribe: SubscribeFn,
  publish: PublishFn,
}
export const EventBus: IEventBus = {
  channels: {},
  subscribe(channelName, listener) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = []
    }
    this.channels[channelName].push(listener as IListener)
  },
  
  publish(channelName, data, count) {
    const channel = this.channels[channelName]
    if (!channel || !channel.length) {
      return
    }
    count = count ? Math.min(count, channel.length) : channel.length
    channel.slice(0, count).forEach(listener => listener(data))
    this.channels[channelName] = channel.slice(count)
  }
}