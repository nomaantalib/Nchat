import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function CallScreen({ route, navigation }) {
  const { currentUser } = useAuth();
  const { roomId, isHost } = route.params;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Timer simulation for call display
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Remote Video Feed Background (Mocked) */}
      <View style={styles.remoteVideoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' }} 
          style={styles.videoFeed}
        />
        <View style={styles.overlayLayer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={endCall} style={styles.backButton}>
              <Ionicons name="chevron-down" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.roomInfo}>
              <Text style={styles.roomCode}>Room: {roomId}</Text>
              <Text style={styles.timer}>{formatTime(callDuration)}</Text>
            </View>
            <TouchableOpacity style={styles.flipCamera}>
              <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Local User Video PIP (Picture-in-Picture) */}
          {isVideoOn ? (
            <View style={styles.localVideoPip}>
               <Image source={{ uri: currentUser?.pic }} style={styles.videoFeed} />
               <View style={styles.localNameBadge}>
                  <Text style={styles.localNameText}>You</Text>
               </View>
            </View>
          ) : (
             <View style={[styles.localVideoPip, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={40} color="#666" />
             </View>
          )}

          {/* Controls Footer */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]} 
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Ionicons name={isVideoOn ? "videocam-off" : "videocam"} size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={endCall}>
              <Ionicons name="call" size={26} color="#fff" style={{ transform: [{ rotate: '135deg' }] }}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
  },
  videoFeed: {
    width: '100%',
    height: '100%',
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  roomInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roomCode: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timer: {
    color: '#ddd',
    fontSize: 12,
  },
  flipCamera: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 20,
  },
  localVideoPip: {
    width: width * 0.28,
    height: height * 0.20,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    position: 'absolute',
    bottom: 120,
    right: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#444',
  },
  localNameBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  localNameText: {
    color: '#fff',
    fontSize: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  controlButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  endCallButton: {
    backgroundColor: '#ff4b4b',
    borderColor: '#ff4b4b',
    marginLeft: 20,
  }
});
