import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ThemedText} from './base';

interface FastImageProps {
  url: string;
  style: StyleProp<ImageStyle>;
  resize?: 'cover' | 'contain' | 'stretch';
}

const DangoImage: FC<FastImageProps> = (props) => {
  const {url, style, resize} = props;
  const [loadingVisible, setLoadingVisisble] = useState<boolean>(true);
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <View style={[style]}>
      <FastImage
        style={styles.image.base}
        source={{uri: url, cache: FastImage.cacheControl.web, }}
        resizeMode={resize ?? 'cover'}
        onLoad={() => {
          setLoadingVisisble(false)
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }).start();
        }}
      />
      {loadingVisible ? (
        <Animated.View style={[styles.image.floatingView, {opacity}]}>
          <View style={styles.image.loadingView}>
            <ActivityIndicator />
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
};

interface AvatarProps {
  url?: string | number;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
}

export const Avatars: FC<AvatarProps> = (props): JSX.Element => {
  const {url, size, borderWidth, borderColor} = props;
  return (
    <View
      style={{
        borderRadius: (size ?? 24) / 2,
        height: size ?? 24,
        width: size ?? 24,
        overflow: 'hidden',
        borderWidth,
        borderColor,
      }}>
      {url ? (
        typeof url === 'string' && url.startsWith('http') ? (
          <DangoImage url={url} style={{height: '100%', width: '100%'}} />
        ) : (
          <View
            style={{
              backgroundColor: 'grey',
              height: '100%',
              width: '100%',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <ThemedText
              style={{textAlign: 'center', fontWeight: '500', fontSize: 15}}>
              {url.toString()}
            </ThemedText>
          </View>
        )
      ) : (
        <Image
          source={require('../../assets/images/icon_round.png')}
          style={{height: '100%', width: '100%'}}
        />
      )}
    </View>
  );
};

const styles = {
  image: StyleSheet.create({
    base: {
      height: '100%',
      width: '100%',
    },
    floatingView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
};

export default DangoImage;
