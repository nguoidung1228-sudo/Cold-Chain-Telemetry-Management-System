import { getDevice, getDevices } from './mockAdapter'

export const deviceService = { list: getDevices, get: getDevice }
