import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function StatusScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [groupedStatuses, setGroupedStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    try {
      const response = await api.get('/status');
      setGroupedStatuses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleUploadStatus = async () => {
    // Dummy random image generator for mock upload
    const randomSeed = Math.floor(Math.random() * 1000);
    const mockImage = `https://picsum.photos/seed/${randomSeed}/800/1200`;
    try {
      await api.post('/status', { mediaUrl: mockImage, mediaType: 'image' });
      fetchStatuses();
    } catch (error) {
      console.error('Error uploading status', error);
    }
  };

  const renderStatusThumb = ({ item }) => (
    <TouchableOpacity 
      style={styles.statusThumbContainer}
      onPress={() => navigation.navigate('StoryViewer', { stories: item.stories, user: item.user })}
    >
      <View style={[styles.imageRing, { borderColor: theme.primary }]}>
        <Image source={{ uri: item.user.pic }} style={styles.thumbImage} />
      </View>
      <Text style={[styles.thumbName, { color: theme.textDark }]} numberOfLines={1}>
        {item.user._id === currentUser._id ? 'My Status' : item.user.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Horizontal List Requirement */}
      <View style={[styles.horizontalWrapper, { backgroundColor: theme.headerBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.textDark }]}>Recent Updates</Text>
        
        {loading ? (
           <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {/* My Status Add Button */}
            <TouchableOpacity style={styles.statusThumbContainer} onPress={handleUploadStatus}>
              <View style={styles.addStatusRing}>
                <Image source={{ uri: currentUser?.pic }} style={styles.thumbImage} />
                <View style={[styles.addIconBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
              </View>
              <Text style={[styles.thumbName, { color: theme.textDark }]}>Add Status</Text>
            </TouchableOpacity>

            {groupedStatuses.map((item, index) => (
              <React.Fragment key={index}>
                 {renderStatusThumb({ item })}
              </React.Fragment>
            ))}
          </ScrollView>
        )}
      </View>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="images-outline" size={60} color={theme.textLight} />
        <Text style={{ color: theme.textLight, marginTop: 10 }}>Your statuses are end-to-end encrypted</Text>
      </View>

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={handleUploadStatus}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalWrapper: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingLeft: 10,
  },
  statusThumbContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 60,
  },
  imageRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStatusRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  thumbName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
