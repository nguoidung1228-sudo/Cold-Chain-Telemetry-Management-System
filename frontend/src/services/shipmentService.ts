import { getShipment, getShipments } from './mockAdapter'

export const shipmentService = { list: getShipments, get: getShipment }
