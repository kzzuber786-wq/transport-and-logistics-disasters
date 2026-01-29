export type EmergencyType = 'food' | 'medical' | 'ambulance' | 'rescue' | 'shelter' | 'custom';

export type RequestStatus = 'pending' | 'acknowledged' | 'in-progress' | 'completed' | 'cancelled';

export type RequestPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export interface EmergencyRequest {
  id: string;
  type: EmergencyType;
  customMessage?: string;
  location: Location;
  status: RequestStatus;
  priority: RequestPriority;
  userName?: string;
  userContact?: string;
  timestamp: number;
  acknowledgedAt?: number;
  completedAt?: number;
  assignedTo?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  sender: 'user' | 'rescue';
  senderName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface Drone {
  id: string;
  name: string;
  location: Location;
  batteryLevel: number;
  coverageRadius: number;
  payloadCapacity: number;
  status: 'active' | 'charging' | 'deployed' | 'maintenance';
  assignedRequest?: string;
}

export interface RescueVehicle {
  id: string;
  name: string;
  type: 'ambulance' | 'truck' | 'boat' | 'helicopter';
  location: Location;
  status: 'available' | 'deployed' | 'returning';
  assignedRequest?: string;
  currentRoute?: Location[];
}

export interface DisasterZone {
  id: string;
  name: string;
  center: Location;
  radius: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'flood' | 'earthquake' | 'fire' | 'landslide' | 'cyclone' | 'other';
  createdAt: number;
}

export interface User {
  id: string;
  role: 'civilian' | 'admin' | 'ndrf' | 'medical' | 'logistics';
  name?: string;
  contact?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
  requestId?: string;
}
