import express, { Response, Request } from 'express'

import { getVehicleLocation, reportCurrentLocation } from '../controllers/location-monitoring/getVehicleLocation.js'

const server = express()
const serverPort = 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.post('/report-current-location', reportCurrentLocation)

server.get('/get-one-vehicle-location', getVehicleLocation)

server.listen(serverPort, () => console.log(`Server 🚀 and listening on ${serverPort}`))