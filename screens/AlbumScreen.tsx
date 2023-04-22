import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppSelector} from '../redux/hooks';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../assets/design/palette.json';
import {TrackType, AlbumType} from '../types/Types';
import {FloatingPlayerInstance} from '../models/FloatingPlayerInstance';
import {initSoundTrack} from '../utils/soundTracker';

// Components
import AlbumHeader from '../components/AlbumPartials/AlbumHeader';
import AlbumTracks from '../components/AlbumPartials/AlbumTracks';
import StatusBarElement from '../components/resuable/StatusBarElement';

type RootStackParamList = {
  album: any;
};

type AlbumScreenType = NativeStackScreenProps<RootStackParamList, 'album'>;

const AlbumScreen: React.FC<AlbumScreenType> = ({navigation, route}) => {
  const albumData = route.params!.albumData as AlbumType;

  const currentIndexTrack = useAppSelector(
    state => state.deezerSlice.currentIndexTrack,
  );

  const onPlay = (item: TrackType) => {
    const createFloatingTrack = new FloatingPlayerInstance(
      item.id,
      item.title,
      item.artist,
      item.image,
      item.preview!,
    );
    initSoundTrack(item.preview!, albumData?.tracks, createFloatingTrack);
  };

  const pressBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors['gradient-start']}
      />
      <LinearGradient
        colors={[
          Colors['gradient-start'],
          Colors['gradient-end'],
          Colors['gradient-mid'],
        ]}>
        <AlbumHeader
          title={albumData.title}
          label={albumData.label}
          imageCover={albumData.image}
          name={albumData.artist}
          releaseDate={albumData.releaseDate}
          pressBack={pressBack}
        />
        <AlbumTracks
          tracks={albumData.tracks}
          onPlay={onPlay}
          indexIndicator={currentIndexTrack}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default AlbumScreen;
