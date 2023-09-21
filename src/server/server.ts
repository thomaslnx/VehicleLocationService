import express, { Response, Request } from 'express'

import { getVehicleLocation } from '../controllers/location-monitoring/getVehicleLocation.js'

const server = express()
const serverPort = 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.post('/send-current-location', async (req: Request, res: Response) => {
  // car's geographic data and id
  const { vehicleId, longitude, latitude } = req.body

  // const reportLocation = await vehicleReportLocation(vehicleId, longitude, latitude) // method to report location from vehicle

})

server.get('/get-one-vehicle-location', getVehicleLocation)

server.listen(serverPort, () => console.log(`Server 🚀 and listening on ${serverPort}`))