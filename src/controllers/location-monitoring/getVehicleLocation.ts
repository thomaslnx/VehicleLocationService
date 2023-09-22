import { Response, Request } from 'express'

import { vehicleData } from '../../vehicle-data/vehicleIdAndPaths.js'

type VehicleProps = {
  currentPosition: number
  vehicleId: string
  path: number[][]
}

class Vehicle {
  currentPosition: number
  vehicleId: string
  path: number[][]
  
  constructor(currentPosition: number, path: number[][], vehicleId: string) {
    this.currentPosition = Math.floor(Math.random() * (40 - currentPosition)) + currentPosition
    this.vehicleId = vehicleId
    this.path = path
  }
}

export const reportCurrentLocation = (req: Request, res: Response) => {
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