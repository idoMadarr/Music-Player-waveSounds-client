import React, {useState, useEffect, Fragment} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useAppDispatch} from '../redux/hooks';
import {fetchAlbum} from '../redux/actions/deezerActions';
import Colors from '../assets/design/palette.json';
import {AlbumTrack, AlbumType} from '../types/album';
import {FloatingPlayerInstance} from '../models/FloatingPlayerInstance';
import {initSoundTrack} from '../utils/soundTracker';

// Components
import AlbumHeader from '../components/AlbumPartials/AlbumHeader';
import AlbumTracks from '../components/AlbumPartials/AlbumTracks';
import StatusBarElement from '../components/resuable/StatusBarElement';
// import ClockLoader from '../components/ClockLoader';

type RootStackParamList = {
  album: any;
};

type AlbumScreenType = NativeStackScreenProps<RootStackParamList, 'album'>;

const AlbumScreen: React.FC<AlbumScreenType> = ({navigation, route}) => {
  const {albumId} = route.params as any;

  const [currentAlbum, setCurrentAlbum] = useState<AlbumType | null>(null);
  const [indexIndicator, setIndexIndicator] = useState(0);
  const dispatch = useAppDispatch();
  const progress = useSharedValue(0);

  useEffect(() => {
    initClockLoader();
    initAlbum();
  }, []);

  const initAlbum = async () => {
    const albumData = await dispatch(fetchAlbum(albumId));

    setCurrentAlbum(albumData);
  };

  const onPlay = (item: AlbumTrack, index: number) => {
    setIndexIndicator(index);
    const createFloatingTrack = new FloatingPlayerInstance(
      item.title,
      item.artist,
      item.image,
    );
    initSoundTrack(item.preview, currentAlbum?.tracks, createFloatingTrack);
  };

  const pressBack = () => navigation.goBack();

  const initClockLoader = () => {
    progress.value = withRepeat(
      withTiming(4 * Math.PI, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors['gradient-mid']}
      />
      <LinearGradient
        style={styles.screen}
        colors={[
          Colors['gradient-mid'],
          Colors['gradient-start'],
          Colors['gradient-end'],
        ]}>
        {!currentAlbum ? (
          <View style={styles.loadingContainer}>
            {/* <ClockLoader progress={progress} /> */}
          </View>
        ) : (
          <Fragment>
            <AlbumHeader
              title={currentAlbum.title}
              label={currentAlbum.label}
              imageCover={currentAlbum.image}
              name={currentAlbum.artist}
              releaseDate={currentAlbum.releaseDate}
              pressBack={pressBack}
            />
            <AlbumTracks
              tracks={currentAlbum.tracks}
              onPlay={onPlay}
              indexIndicator={indexIndicator}
            />
          </Fragment>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlbumScreen;
