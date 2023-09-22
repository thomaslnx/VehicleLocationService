import express from 'express'

import { getVehicleLocation, reportCurrentLocation, listAllVehiclesInsideRadius } from '../controllers/location-monitoring/getVehicleLocation.js'

const server = express()
const serverPort = 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.get('/list-vehicles-in-radius', listAllVehiclesInsideRadius)

server.post('/report-current-location', reportCurrentLocation)

server.get('/get-one-vehicle-location', getVehicleLocation)

server.listen(serverPort, () => console.log(`Server 🚀 and listening on ${serverPort}`))