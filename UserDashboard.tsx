import React, { useEffect, useState } from 'react';
import {
  MapPin,
  MessageCircle,
  Bell,
  Package,
  Pill,
  Ambulance,
  AlertTriangle,
  Home,
  Send,
  X,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Map } from '@/components/Map';
import { EmergencyType } from '@/types';

export const UserDashboard: React.FC = () => {
  const {
    currentLocation,
    updateLocation,
    requests,
    addRequest,
    chatMessages,
    sendMessage,
    markMessagesAsRead,
    notifications,
    markNotificationAsRead,
    userName,
  } = useApp();

  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    updateLocation();
  }, []);

  const handleEmergencyRequest = (type: EmergencyType, message?: string) => {
    if (!currentLocation) {
      alert('Please enable location services');
      return;
    }

    addRequest({
      type,
      customMessage: message,
      location: currentLocation,
      status: 'pending',
      priority: type === 'ambulance' ? 'critical' : type === 'rescue' ? 'high' : 'medium',
      userName: userName || 'Anonymous',
    });

    setShowCustomInput(false);
    setCustomMessage('');
  };

  const emergencyButtons = [
    {
      type: 'food' as EmergencyType,
      icon: Package,
      label: 'Food & Water',
      color: 'from-green-500 to-green-600',
      emoji: '🍞',
    },
    {
      type: 'medical' as EmergencyType,
      icon: Pill,
      label: 'Medical Aid',
      color: 'from-blue-500 to-blue-600',
      emoji: '💊',
    },
    {
      type: 'ambulance' as EmergencyType,
      icon: Ambulance,
      label: 'Ambulance',
      color: 'from-red-500 to-red-600',
      emoji: '🚑',
    },
    {
      type: 'rescue' as EmergencyType,
      icon: AlertTriangle,
      label: 'Rescue',
      color: 'from-orange-500 to-orange-600',
      emoji: '🆘',
    },
    {
      type: 'shelter' as EmergencyType,
      icon: Home,
      label: 'Shelter',
      color: 'from-purple-500 to-purple-600',
      emoji: '🏠',
    },
  ];

  const userRequests = requests.filter((r) => r.userName === userName || r.userName === 'Anonymous');
  const activeRequest = userRequests.find((r) => r.status !== 'completed' && r.status !== 'cancelled');

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const requestMessages = selectedRequest
    ? chatMessages.filter((m) => m.requestId === selectedRequest)
    : [];
  const unreadMessages = requestMessages.filter((m) => m.sender === 'rescue' && !m.read).length;

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedRequest) return;
    sendMessage(selectedRequest, chatInput, 'user', userName || 'Anonymous');
    setChatInput('');
  };

  useEffect(() => {
    if (selectedRequest) {
      markMessagesAsRead(selectedRequest, 'user');
    }
  }, [selectedRequest, requestMessages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">SafeLink Emergency</h1>
            <p className="text-blue-100 text-sm">Help is on the way</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Location Card */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Your Location</p>
                <p className="font-semibold text-gray-900">
                  {currentLocation
                    ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                    : 'Detecting...'}
                </p>
              </div>
            </div>
            <button
              onClick={updateLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Active Request Status */}
        {activeRequest && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-md p-6 border-2 border-orange-200">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-gray-900">Active Request</h3>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">{activeRequest.type.toUpperCase()}</span> request is{' '}
                  {activeRequest.status === 'pending' ? 'pending' : 'being processed'}
                </p>
                {activeRequest.status === 'acknowledged' && (
                  <p className="text-green-700 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Rescue team is on the way!
                  </p>
                )}
                {activeRequest.status === 'in-progress' && (
                  <p className="text-blue-700 font-medium flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Help is approaching your location
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedRequest(activeRequest.id);
                  setShowChat(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Open Chat
              </button>
            </div>
          </div>
        )}

        {/* Emergency Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {emergencyButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => handleEmergencyRequest(btn.type)}
                className={`group relative overflow-hidden bg-gradient-to-br ${btn.color} rounded-xl p-6 text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                disabled={!!activeRequest}
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">{btn.emoji}</span>
                  <span className="font-bold text-center text-sm">{btn.label}</span>
                </div>
                {activeRequest && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <span className="text-xs">Request Active</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Message */}
          <div className="mt-4">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
                disabled={!!activeRequest}
              >
                + Custom Emergency Request
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Describe your emergency..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEmergencyRequest('custom', customMessage)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                    disabled={!customMessage.trim()}
                  >
                    Send Custom Request
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomMessage('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-96">
            {currentLocation && (
              <Map
                center={currentLocation}
                markers={[
                  {
                    location: currentLocation,
                    type: 'user',
                    label: 'You are here',
                  },
                ]}
                requests={userRequests}
              />
            )}
          </div>
        </div>

        {/* Request History */}
        {userRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request History</h2>
            <div className="space-y-3">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        req.status === 'completed'
                          ? 'bg-green-500'
                          : req.status === 'in-progress'
                          ? 'bg-blue-500 animate-pulse'
                          : req.status === 'acknowledged'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <div>
                      <p className="font-semibold text-gray-900">{req.type.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(req.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : req.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : req.status === 'acknowledged'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold">Chat with Rescue Team</h3>
            <button onClick={() => setShowChat(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Request Selector */}
          {userRequests.length > 0 && (
            <div className="p-3 bg-gray-50 border-b">
              <select
                value={selectedRequest || ''}
                onChange={(e) => setSelectedRequest(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="">Select a request</option>
                {userRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.type.toUpperCase()} - {req.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {requestMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation with the rescue team</p>
              </div>
            ) : (
              requestMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
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
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedRequest}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || !selectedRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Sidebar */}
      {showNotifications && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    notif.read ? 'bg-gray-50' : 'bg-blue-50 border-2 border-blue-200'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{notif.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
