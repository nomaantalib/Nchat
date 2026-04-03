import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Alert, Share, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');
const ENDPOINT = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function CallScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { roomId, isHost } = route.params || {};

  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isFrontCam, setIsFrontCam] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize Signaling
    socket.current = io(ENDPOINT);
    socket.current.emit('join chat', roomId);
    socket.current.on('connected', () => setIsConnected(true));

    const interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => {
      clearInterval(interval);
      socket.current.disconnect();
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const endCall = () => {
    Alert.alert('End Meeting', 'Are you sure you want to leave?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End', style: 'destructive', onPress: () => navigation.goBack() }
    ]);
  };

  const shareMeeting = async () => {
    const link = `https://nchat.app/join/${roomId}`;
    await Share.share({
      message: `Join my private NChat meeting!\nCode: ${roomId}\nLink: ${link}`,
      title: 'NChat Meeting Invitation'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0A0E14' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.roomBadge}>
          <Text style={styles.roomCode}>{roomId}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#FF9800' }]} />
          <Text style={styles.meetingTime}>{isConnected ? formatTime(duration) : 'Connecting...'}</Text>
        </View>
        <TouchableOpacity style={styles.topAction} onPress={() => setIsFrontCam(!isFrontCam)}>
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Video View (Placeholder) */}
      <View style={styles.mainVideo}>
        <View style={styles.participantInitial}>
          <Text style={styles.initialText}>{currentUser?.name?.charAt(0)}</Text>
        </View>
        {isCamOff && (
          <View style={styles.camOffOverlay}>
            <Ionicons name="videocam-off" size={60} color="rgba(255,255,255,0.4)" />
            <Text style={styles.camOffText}>Camera is OFF</Text>
          </View>
        )}
      </View>

      {/* Control Bar */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <TouchableOpacity 
            style={[styles.btn, isMuted && styles.btnActive]} 
            onPress={() => setIsMuted(!isMuted)}
          >
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={26} color="#fff" />
            <Text style={styles.btnLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, isCamOff && styles.btnActive]} 
            onPress={() => setIsCamOff(!isCamOff)}
          >
            <Ionicons name={isCamOff ? 'videocam-off' : 'videocam'} size={26} color="#fff" />
            <Text style={styles.btnLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.hangupBtn, { backgroundColor: '#FF3B30' }]} onPress={endCall}>
            <Ionicons name="close" size={36} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, !isSpeakerOn && styles.btnActive]} 
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
            <Text style={styles.btnLabel}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btn} 
            onPress={shareMeeting}
          >
            <Ionicons name="share-social-outline" size={24} color="#fff" />
            <Text style={styles.btnLabel}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    position: 'absolute', top: Platform.OS === 'ios' ? 60 : 30,
    left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, alignItems: 'center'
  },
  roomBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  roomCode: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  meetingTime: { color: '#fff', fontSize: 16, fontWeight: '700' },
  topAction: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  mainVideo: { flex: 1, backgroundColor: '#1A1D23', justifyContent: 'center', alignItems: 'center' },
  participantInitial: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  initialText: { color: '#fff', fontSize: 48, fontWeight: '800' },
  camOffOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  camOffText: { color: 'rgba(255,255,255,0.6)', marginTop: 15, fontWeight: '700' },
  controlsContainer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  controlRow: { 
    flexDirection: 'row', backgroundColor: 'rgba(20,24,30,0.92)', 
    padding: 10, borderRadius: 40, gap: 8, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10
  },
  btn: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  hangupBtn: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  btnActive: { backgroundColor: '#FF3B30' },
  btnLabel: { color: '#fff', fontSize: 10, marginTop: 4, fontWeight: '600' }
});
