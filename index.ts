import { BarberShop } from "./src/BarberShop"
import { CLIENT_COUNT, MASTERS_COUNT } from "./src/utils"

const barberShop = new BarberShop(MASTERS_COUNT, CLIENT_COUNT)
barberShop.start()
