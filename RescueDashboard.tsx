import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  X,
  Filter,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Map } from '@/components/Map';

export const RescueDashboard: React.FC = () => {
  const {
    requests,
    acknowledgeRequest,
    completeRequest,
    chatMessages,
    sendMessage,
    markMessagesAsRead,
    vehicles,
    deployVehicle,
    drones,
    currentLocation,
    updateLocation,
    userName,
  } = useApp();

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'acknowledged' | 'in-progress'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'high'>('all');

  useEffect(() => {
    updateLocation();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || req.priority === filterPriority;
    return statusMatch && priorityMatch && req.status !== 'completed';
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  const handleAcknowledge = (requestId: string) => {
    acknowledgeRequest(requestId, userName || 'Rescue Team');
  };

  const handleDeploy = (requestId: string) => {
    const availableVehicle = vehicles.find((v) => v.status === 'available');
    if (availableVehicle) {
      deployVehicle(availableVehicle.id, requestId);
    } else {
      alert('No vehicles available at the moment');
    }
  };

  const handleComplete = (requestId: string) => {
    completeRequest(requestId);
    setSelectedRequest(null);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedRequest) return;
    sendMessage(selectedRequest, chatInput, 'rescue', userName || 'Rescue Team');
    setChatInput('');
  };

  const requestMessages = selectedRequest
    ? chatMessages.filter((m) => m.requestId === selectedRequest)
    : [];

  useEffect(() => {
    if (selectedRequest) {
      markMessagesAsRead(selectedRequest, 'rescue');
    }
  }, [selectedRequest, requestMessages.length]);

  const getRequestById = (id: string) => requests.find((r) => r.id === id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'acknowledged':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🚨 Rescue Command Center</h1>
              <p className="text-red-100 text-sm">Real-time Emergency Response Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-red-100">Logged in as</p>
                <p className="font-semibold">{userName || 'Rescue Operator'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Requests</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending</p>
                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">In Progress</p>
                <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
              </div>
              <Activity className="w-10 h-10 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-700 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-300" />
              <span className="text-white font-semibold">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Priority</option>
            </select>

            <div className="ml-auto text-slate-300 text-sm">
              Showing {sortedRequests.length} requests
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Requests List */}
          <div className="bg-slate-700 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-800 p-4 border-b border-slate-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Emergency Requests
              </h2>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {sortedRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>No active requests</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {sortedRequests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request.id)}
                      className={`p-4 bg-slate-800 rounded-lg cursor-pointer transition-all hover:bg-slate-750 border-2 ${
                        selectedRequest === request.id
                          ? 'border-blue-500 shadow-lg'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(request.status)} animate-pulse`}></div>
                          <h3 className="font-bold text-white text-lg">
                            {request.type.toUpperCase()}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>

                      {request.customMessage && (
                        <p className="text-slate-300 text-sm mb-3 p-2 bg-slate-900 rounded">
                          "{request.customMessage}"
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {request.location.lat.toFixed(4)}, {request.location.lng.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(request.timestamp).toLocaleString()}</span>
                        </div>
                        {request.userName && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{request.userName}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        {request.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledge(request.id);
                            }}
                            className="flex-1 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                          >
                            Acknowledge
                          </button>
                        )}
                        {request.status === 'acknowledged' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeploy(request.id);
                            }}
                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                          >
                            Deploy Team
                          </button>
                        )}
                        {request.status === 'in-progress' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComplete(request.id);
                            }}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request.id);
                            setShowChat(true);
                          }}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-slate-700 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-800 p-4 border-b border-slate-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Live Map
              </h2>
            </div>
            <div className="h-[600px]">
              {currentLocation && (
                <Map
                  center={currentLocation}
                  markers={[
                    {
                      location: currentLocation,
                      type: 'base',
                      label: 'Base Station',
                    },
                  ]}
                  requests={requests}
                  vehicles={vehicles}
                  showRoute={true}
                  zoom={12}
                />
              )}
            </div>
          </div>
        </div>

        {/* Resources Status */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vehicles */}
          <div className="bg-slate-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🚁 Rescue Vehicles</h3>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{vehicle.name}</p>
                    <p className="text-sm text-slate-400 capitalize">
                      {vehicle.status}
                      {vehicle.assignedRequest && ' - On Mission'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      vehicle.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Drones */}
          <div className="bg-slate-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🛸 Network Drones</h3>
            <div className="space-y-3">
              {drones.map((drone) => (
                <div
                  key={drone.id}
                  className="p-4 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-white">{drone.name}</p>
                    <span className="text-sm text-slate-400 capitalize">{drone.status}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Battery</span>
                      <span className="font-semibold">{drone.batteryLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          drone.batteryLevel > 50 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${drone.batteryLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
          <div className="bg-red-600 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold">Chat with Civilian</h3>
            <button onClick={() => setShowChat(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {selectedRequest && (
            <div className="p-3 bg-gray-100 border-b">
              <div className="text-sm">
                <span className="font-semibold">Request: </span>
                <span>{getRequestById(selectedRequest)?.type.toUpperCase()}</span>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {requestMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No messages yet</p>
              </div>
            ) : (
              requestMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'rescue' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'rescue'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={!selectedRequest}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || !selectedRequest}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
