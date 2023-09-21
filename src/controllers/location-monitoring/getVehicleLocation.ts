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