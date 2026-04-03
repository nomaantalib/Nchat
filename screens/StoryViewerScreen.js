import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// A timer-based Story Viewer that mimics WhatsApp full-screen stories
export default function StoryViewerScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { stories, user } = route.params;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, [currentIndex]);

  const startAnimation = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000, // 5 seconds per story
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        nextStory();
      }
    });
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      progressAnim.setValue(0);
      startAnimation();
    }
  };

  const handleTouch = (event) => {
    const x = event.nativeEvent.locationX;
    if (x < width / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Media */}
      <Image 
        source={{ uri: stories[currentIndex].mediaUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      {/* Invisible Touch Overlay */}
      <TouchableOpacity 
        style={StyleSheet.absoluteFillObject} 
        activeOpacity={1} 
        onPress={handleTouch}
      />

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {stories.map((s, index) => (
          <View key={index} style={styles.progressBarBackground}>
            <Animated.View style={[
              styles.progressBarForeground,
              {
                width: index === currentIndex 
                       ? progressAnim.interpolate({
                           inputRange: [0, 1],
                           outputRange: ['0%', '100%']
                         })
                       : index < currentIndex ? '100%' : '0%'
              }
            ]} />
          </View>
        ))}
      </View>

      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: user.pic }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.timeText}>
            {new Date(stories[currentIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
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
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    height: 3,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 65,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  backBtn: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  }
});
