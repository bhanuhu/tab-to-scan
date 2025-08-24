import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const ImageGrid = ({
  images = [],
  onAddImage,
  onImagePress,
  onRemoveImage,
  maxImages = 9,
  loading = false,
  error = null,
}) => {
  const handleAddImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your media library to upload images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        onAddImage(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const renderImage = (image, index) => (
    <TouchableOpacity
      key={image.uri || index}
      style={styles.imageContainer}
      onPress={() => onImagePress?.(image, index)}
      onLongPress={() => onRemoveImage?.(index)}
    >
      <Image
        source={{ uri: image.uri || image.localUri }}
        style={styles.image}
        resizeMode="cover"
        onError={() => {
          console.log('Error loading image:', image.uri || image.localUri);
          onRemoveImage?.(index);
        }}
      />
      {image.uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {images.map((img, index) => renderImage(img, index))}
        {images.length < maxImages && (
          <TouchableOpacity
            style={[styles.imageContainer, styles.addButton]}
            onPress={handleAddImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1abc9c" />
            ) : (
              <Text style={styles.plusText}>+</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: '2%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  plusText: {
    fontSize: 32,
    color: '#888',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ImageGrid;
