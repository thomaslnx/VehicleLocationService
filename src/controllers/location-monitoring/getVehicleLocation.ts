import { Response, Request } from 'express'
import geolib from 'geolib'

import { vehicleData } from '../../vehicle-data/vehicleIdAndPaths.js'

type VehicleProps = {
  currentPosition: number
  vehicleId: string
  path: number[][]
}

// Is a good practice states that this class must be in its own file to be available to all application.
// For sake of simplicity I left it here. ;-)
class Vehicle {
  currentPosition: number
  vehicleId: string
  path: number[][]
  
  constructor(currentPosition: number, path: number[][], vehicleId: string) {
    // generate a pseudo-random range of numbers, so every time one vehicle instance was created
    // the currentPosition will be in a different position of the array making this way a dummy change
    // of location from that vehicle, pretending as it is in moving
    this.currentPosition = Math.floor(Math.random() * (7 - currentPosition)) + currentPosition
    this.vehicleId = vehicleId
    this.path = path
  }
}

export const listAllVehiclesInsideRadius = async (req: Request, res: Response) => {
  const { latitude, longitude, radius } = req.body

  // create new instances of vehicles
  // const vehicles = vehicleData.map(vehicle => {
  //   return new Vehicle(vehicle.currentPosition, vehicle.path, vehicle.vehicleId)
  // })

  /**
   * Note: I used this fixed array of vehicles instead of the list of locations from the vehicle's class because
   * from one vehicle to another I used geo locations pretty distant from each other.
   * So for test purposes, this arrangement shows itself more faster and practical,
   * and I do not want to get late with the delivery of my code, so I chose that path.
   *
   * I hope you can understand.
   */
  const vehicles = [
    {
      vehicleId: 'vehicle1',
      lat: -9.564515,
      lon: -48.412329
    },
    {
      vehicleId: 'vehicle2',
      lat: -9.563387,
      lon: -48.411962
    },
    {
      vehicleId: 'vehicle3',
      lat: -9.653436,
      lon: -48.405602
    },
  ]

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Invalid body parameters'})
  }

  const vehiclesInsideRadius = vehicles.filter(vehicle => {
      return geolib.isPointWithinRadius({lat: vehicle.lat, lon: vehicle.lon}, {latitude: latitude, longitude: longitude}, radius)
    })

  return res.json(vehiclesInsideRadius)
}

export const reportCurrentLocation = async (req: Request, res: Response) => {
  const { vehicleId, latitude, longitude } = req.body
  if (!vehicleId || !latitude || !longitude) {
    return res.status(400).json({ error: "Request data invalid!"})
  }

  let vehicles = vehicleData.map(vehicle => {
    return new Vehicle(vehicle.currentPosition, vehicle.path, vehicle.vehicleId)
  })

  // check if vehicle reporting current location already exists on database

  const filteredVehicle = vehicles.filter(vehicle => vehicle.vehicleId === vehicleId)
  if (filteredVehicle.length !== 0) {
    filteredVehicle[0].path.push([latitude, longitude])
    filteredVehicle[0].currentPosition = filteredVehicle[0].path.length
    const currentPosition = filteredVehicle[0].path.length

    return res.json({
      vehicleId: filteredVehicle[0].vehicleId,
      currentPosition: filteredVehicle[0].path[currentPosition - 1]
    })
  } else { // If the vehicle doesn't exist at database it's created and add to it
    const path = [latitude, longitude]
    const newVehicle = new Vehicle([path].length - 1, [path], vehicleId)
    vehicles.push(newVehicle)
    const currentPosition = [path].length - 1

    return res.json({
      vehicleId: newVehicle.vehicleId,
      currentPosition: newVehicle.path[currentPosition]
    })
  }
}

export const getVehicleLocation = async (req: Request, res: Response) => {
  // how this instance is created locally if one new vehicle were created at above method
  // he will not be available in vehicles object here.
  try {
    const vehicles = vehicleData.map(vehicle => {
      return new Vehicle(vehicle.currentPosition, vehicle.path, vehicle.vehicleId)
    })
  
    const { vehicleId } = req.body
    let searchedVehicle: VehicleProps | undefined;
    
    vehicles.map(vehicle => {
      if (vehicle.vehicleId === vehicleId) {
        searchedVehicle = vehicle
        return searchedVehicle
      }
    })

    if (searchedVehicle !== undefined) {
      return res.json({
        vehicle: searchedVehicle.vehicleId,
        currentPosition: searchedVehicle.path[searchedVehicle.currentPosition]
    })
    }  else {
      return res.status(400).json({message: 'vehicle not found'})
    }
  
  } catch (error) {
    console.log(error)
  }

}