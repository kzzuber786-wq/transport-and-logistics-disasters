import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EmergencyRequest,
  ChatMessage,
  Notification,
  Location,
  Drone,
  RescueVehicle,
  DisasterZone,
} from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { getCurrentLocation, generateRoute } from '@/utils/geolocation';

interface AppContextType {
  // User state
  userRole: 'civilian' | 'rescue' | null;
  userId: string;
  userName: string;
  setUserRole: (role: 'civilian' | 'rescue') => void;
  setUserName: (name: string) => void;

  // Location
  currentLocation: Location | null;
  updateLocation: () => Promise<void>;

  // Requests
  requests: EmergencyRequest[];
  addRequest: (request: Omit<EmergencyRequest, 'id' | 'timestamp'>) => void;
  updateRequestStatus: (id: string, status: EmergencyRequest['status']) => void;
  acknowledgeRequest: (id: string, assignedTo: string) => void;
  completeRequest: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (requestId: string, message: string, sender: 'user' | 'rescue', senderName: string) => void;
  markMessagesAsRead: (requestId: string, sender: 'user' | 'rescue') => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Drones & Vehicles (simulated)
  drones: Drone[];
  vehicles: RescueVehicle[];
  deployVehicle: (vehicleId: string, requestId: string) => void;

  // Disaster zones
  disasterZones: DisasterZone[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<'civilian' | 'rescue' | null>(
    storage.get(STORAGE_KEYS.USER_ROLE, null)
  );
  const [userId] = useState<string>(
    storage.get(STORAGE_KEYS.USER_ID, `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  );
  const [userName, setUserNameState] = useState<string>(
    storage.get(STORAGE_KEYS.USER_NAME, '')
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(
    storage.get(STORAGE_KEYS.LAST_LOCATION, null)
  );
  const [requests, setRequests] = useState<EmergencyRequest[]>(
    storage.get(STORAGE_KEYS.REQUESTS, [])
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    storage.get(STORAGE_KEYS.CHAT_MESSAGES, [])
  );
  const [notifications, setNotifications] = useState<Notification[]>(
    storage.get(STORAGE_KEYS.NOTIFICATIONS, [])
  );

  // Initialize simulated drones
  const [drones] = useState<Drone[]>([
    {
      id: 'drone_1',
      name: 'Rescue Drone Alpha',
      location: { lat: 28.6139, lng: 77.2090, timestamp: Date.now() },
      batteryLevel: 85,
      coverageRadius: 2,
      payloadCapacity: 5,
      status: 'active',
    },
    {
      id: 'drone_2',
      name: 'Rescue Drone Beta',
      location: { lat: 28.6239, lng: 77.2190, timestamp: Date.now() },
      batteryLevel: 92,
      coverageRadius: 2,
      payloadCapacity: 5,
      status: 'active',
    },
  ]);

  const [vehicles, setVehicles] = useState<RescueVehicle[]>([
    {
      id: 'vehicle_1',
      name: 'Ambulance Unit 1',
      type: 'ambulance',
      location: { lat: 28.6139, lng: 77.2090, timestamp: Date.now() },
      status: 'available',
    },
    {
      id: 'vehicle_2',
      name: 'Supply Truck 1',
      type: 'truck',
      location: { lat: 28.6139, lng: 77.2090, timestamp: Date.now() },
      status: 'available',
    },
  ]);

  const [disasterZones] = useState<DisasterZone[]>([
    {
      id: 'zone_1',
      name: 'Central Delhi Flood Zone',
      center: { lat: 28.6139, lng: 77.2090, timestamp: Date.now() },
      radius: 5,
      severity: 'high',
      type: 'flood',
      createdAt: Date.now(),
    },
  ]);

  // Persist data
  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_ID, userId);
  }, [userId]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_NAME, userName);
  }, [userName]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.REQUESTS, requests);
  }, [requests]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    if (currentLocation) {
      storage.set(STORAGE_KEYS.LAST_LOCATION, currentLocation);
    }
  }, [currentLocation]);

  const setUserRole = (role: 'civilian' | 'rescue') => {
    setUserRoleState(role);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  const updateLocation = async () => {
    const location = await getCurrentLocation();
    setCurrentLocation(location);
  };

  const addRequest = (request: Omit<EmergencyRequest, 'id' | 'timestamp'>) => {
    const newRequest: EmergencyRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setRequests((prev) => [newRequest, ...prev]);

    // Auto-notify rescue team
    if (userRole === 'civilian') {
      addNotification({
        title: '🆘 SOS Sent',
        message: `Your ${request.type} request has been sent to rescue teams`,
        type: 'success',
      });
    }
  };

  const updateRequestStatus = (id: string, status: EmergencyRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const acknowledgeRequest = (id: string, assignedTo: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: 'acknowledged', acknowledgedAt: Date.now(), assignedTo }
          : req
      )
    );

    addNotification({
      title: '✅ Request Acknowledged',
      message: `Rescue team is responding to your request`,
      type: 'success',
      requestId: id,
    });
  };

  const completeRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'completed', completedAt: Date.now() } : req
      )
    );

    addNotification({
      title: '✓ Help Delivered',
      message: 'Assistance has been successfully delivered',
      type: 'success',
      requestId: id,
    });
  };

  const sendMessage = (
    requestId: string,
    message: string,
    sender: 'user' | 'rescue',
    senderName: string
  ) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId,
      sender,
      senderName,
      message,
      timestamp: Date.now(),
      read: false,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const markMessagesAsRead = (requestId: string, sender: 'user' | 'rescue') => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.requestId === requestId && msg.sender !== sender ? { ...msg, read: true } : msg
      )
    );
  };

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const deployVehicle = (vehicleId: string, requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const route = generateRoute(vehicle.location, request.location);

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: 'deployed', assignedRequest: requestId, currentRoute: route }
          : v
      )
    );

    updateRequestStatus(requestId, 'in-progress');

    addNotification({
      title: '🚁 Help is on the way!',
      message: `${vehicle.name} has been deployed to your location`,
      type: 'info',
      requestId,
    });

    // Simulate completion after delay
    setTimeout(() => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, status: 'available', assignedRequest: undefined, currentRoute: undefined }
            : v
        )
      );
      completeRequest(requestId);
    }, 10000); // 10 seconds for demo
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        userId,
        userName,
        setUserRole,
        setUserName,
        currentLocation,
        updateLocation,
        requests,
        addRequest,
        updateRequestStatus,
        acknowledgeRequest,
        completeRequest,
        chatMessages,
        sendMessage,
        markMessagesAsRead,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        drones,
        vehicles,
        deployVehicle,
        disasterZones,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
