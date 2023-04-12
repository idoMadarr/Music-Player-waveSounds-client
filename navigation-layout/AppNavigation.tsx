import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import Sound from 'react-native-sound';
import soundTracker from '../utils/soundTracker';
import {
  setCurrentIndexTrack,
  setCurrentTrack,
  setFloatingPlayer,
  updateCurrentIndexTrack,
} from '../redux/slices/deezerSlice';
import {FloatingPlayerInstance} from '../models/FloatingPlayerInstance';
import {Modalize} from 'react-native-modalize';

// Screens
import {AuthStack} from './StackNavigation';
import DrawerNavigation from './DrawerNavigation';
import LoadingScreen from '../screens/LoadingScreen';
import FloatingPlayer from '../components/FloatingPlayer';
import ModalElement from '../components/resuable/ModalElement';
import ModalPlayer from '../components/ModalPlayer';
import OverlaySpinner from '../components/OverlaySpinner';

const END_REACH = 30;

const AppNavigation: React.FC = () => {
  const AppNavigator = createNativeStackNavigator();

  const [playerStatus, setPlayerStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const modalizeRef = useRef<Modalize>();

  const currentTrack = useAppSelector(state => state.deezerSlice.currentTrack);
  const currentIndexTrack = useAppSelector(
    state => state.deezerSlice.currentIndexTrack,
  );
  const loading = useAppSelector(state => state.authSlice.loading);
  const isAuth = useAppSelector(state => state.authSlice.isAuth);
  const modalContext = useAppSelector(state => state.deezerSlice.modalContext);
  const floatingPlayer = useAppSelector(
    state => state.deezerSlice.floatingPlayer,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentTrack) {
      soundTracker(currentTrack);
      setTimeLeft(0);
    }
  }, [currentTrack]);

  useEffect(() => {
    const clacTime = () => {
      if (!playerStatus) {
        return clearInterval(timer);
      }

      if (timeLeft >= END_REACH) {
        return onTrackNavigate(1);
      }

      setTimeLeft(prevState => prevState + 1);
    };

    const timer = setInterval(clacTime, 1000);

    return () => clearInterval(timer);
  }, [playerStatus, timeLeft]);

  const onTrackNavigate = (action: number) => {
    let nextTrack = modalContext[currentIndexTrack + action] as any;
    if (!nextTrack) {
      nextTrack = modalContext[0];
      dispatch(setCurrentIndexTrack(0));
    } else {
      dispatch(updateCurrentIndexTrack(action));
    }

    const createFloatingTrack = new FloatingPlayerInstance(
      nextTrack.id,
      nextTrack.title,
      nextTrack.artist,
      nextTrack.image,
      nextTrack.preview,
    );

    const loadNextTrack = new Sound(nextTrack.preview, '', async () => {
      if (currentTrack) {
        // @ts-ignore:
        currentTrack.stop(() => {
          currentTrack.release();
          dispatch(setFloatingPlayer(createFloatingTrack));
          dispatch(setCurrentTrack(loadNextTrack));
          setPlayerStatus(true);
          setTimeLeft(0);
        });
      } else {
        dispatch(setFloatingPlayer(createFloatingTrack));
        dispatch(setCurrentTrack(loadNextTrack));
        setPlayerStatus(true);
        setTimeLeft(0);
      }
    });
  };

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  return (
    <NavigationContainer>
      <AppNavigator.Navigator screenOptions={{headerShown: false}}>
        <AppNavigator.Screen name={'loading'} component={LoadingScreen} />
        {isAuth ? (
          <AppNavigator.Group>
            <AppNavigator.Screen name={'app'} component={DrawerNavigation} />
          </AppNavigator.Group>
        ) : (
          <AppNavigator.Group>
            <AppNavigator.Screen name={'auth'} component={AuthStack} />
          </AppNavigator.Group>
        )}
      </AppNavigator.Navigator>
      {loading && <OverlaySpinner />}
      {floatingPlayer && (
        <FloatingPlayer
          playerStatus={playerStatus}
          setPlayerStatus={setPlayerStatus}
          setTimeLeft={setTimeLeft}
          openModal={openModal}
        />
      )}
      <ModalElement modalizeRef={modalizeRef}>
        <ModalPlayer
          playerStatus={playerStatus}
          setPlayerStatus={setPlayerStatus}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTrackNavigate={onTrackNavigate}
          closeModal={closeModal}
        />
      </ModalElement>
    </NavigationContainer>
  );
};

export default AppNavigation;
