import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BackHandler,
  PermissionsAndroid,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import PushNotification from 'react-native-push-notification';
import AddIcon from 'react-native-vector-icons/Ionicons';
import {
  changePath,
  changeUserLocation,
  initialAlarms,
  popHistory,
  pushHistory,
  updateAlarm,
} from './store/StoreInterface';

import Favourite from './components/Favourite';
import Active from './components/Active';
import IconButton from './components/IconButton';
import MapAlarm from './components/MapAlarm';

import useIsPointInRange from './hooks/useIsPointInRange';
import useCalculateDistance from './hooks/useCalculateDistance';
import History from './components/History';

const Tab = createBottomTabNavigator();

function App() {
  const {path, range, speed, history} = useSelector(state => state.config);
  const alarms = useSelector(state => state.alarms);
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);

  function promptEnableLocation() {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Enable Location Services',
        'This app requires location services to function properly. Please enable location services in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
        {cancelable: false},
      );
    } else if (Platform.OS === 'ios') {
      Alert.alert(
        'Enable Location Services',
        'This app requires location services to function properly. Please enable location services in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }

  function locationDetector(position) {
    try {
      dispatch(
        changeUserLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        }),
      );

      AsyncStorage.setItem(
        'User-Location',
        JSON.stringify({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        }),
      );

      alarms.forEach(async activeAlarm => {
        const updatedEstimatedDistance = useCalculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          activeAlarm.latitude,
          activeAlarm.longitude,
        );
        const updatedEstimatedTime =
          updatedEstimatedDistance / ((position.coords.speed + 1) * 60);
        if (activeAlarm.isActive) {
          if (
            useIsPointInRange(
              position.coords.longitude,
              position.coords.latitude,
              activeAlarm.longitude,
              activeAlarm.latitude,
              range,
            )
          ) {
            console.log('Running alarm reached:', activeAlarm);
            PushNotification.localNotification({
              channelId: 'Zone Wake',
              title: `${activeAlarm.title} IS REACHED`,
              message: `Estimated time (minutes): ${updatedEstimatedTime}, Estimated distance (KM): ${updatedEstimatedDistance}`,
            });
            dispatch(
              updateAlarm({
                ...activeAlarm,
                isActive: false,
                isFavourite: true,
              }),
            );
            await AsyncStorage.setItem(
              'Alarms',
              JSON.stringify([
                ...alarms.filter(alarm => alarm.id !== activeAlarm.id),
                {
                  ...activeAlarm,
                  isActive: false,
                  isFavourite: true,
                },
              ]),
            );
          } else {
            console.log('Running active alarm:', activeAlarm);
            PushNotification.localNotification({
              id: activeAlarm.id,
              channelId: 'Zone Wake',
              title: `${activeAlarm.title} alarm`,
              message: `Estimated time (minutes): ${updatedEstimatedTime}, Estimated distance (KM): ${updatedEstimatedDistance}`,
            });
          }
        }
      });
    } catch (error) {
      console.log('Location detection error:', error);
    }
  }

  function handleNavigateToMap() {
    dispatch(changePath('/mapalarm'));
    dispatch(pushHistory('/mapalarm'));
  }

  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('All permissions granted');
      } else {
        console.log('Some permissions not granted');
      }
    } catch (err) {
      console.warn('Error requesting permissions:', err);
    }
  }

  async function updateLocalStorage(alarms) {
    try {
      await AsyncStorage.setItem('Alarms', JSON.stringify(alarms));
    } catch (err) {}
  }

  async function getStorage() {
    try {
      const alarmsString = await AsyncStorage.getItem('Alarms');
      const userLocationString = await AsyncStorage.getItem('User-Location');

      if (alarmsString !== null) {
        dispatch(initialAlarms(JSON.parse(alarmsString)));
      }

      if (userLocationString !== null) {
        dispatch(changeUserLocation(JSON.parse(userLocationString)));
      }
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissions();
    }
    getStorage();
  }, []);

  useEffect(() => {
    // Cleanup function for back button press
    const backHandler = () => {
      dispatch(popHistory());
      dispatch(popHistory());

      if (history.length - 1 >= 0) {
        dispatch(changePath(history[history.length - 1]));
      }
      return true; // Indicate that we've handled the back button press
    };

    BackHandler.addEventListener('hardwareBackPress', backHandler);

    // Cleanup function for removing event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, [history]);

  useEffect(() => {
    if (isLoaded) updateLocalStorage(alarms);

    // Create notification channel for alarms
    PushNotification.createChannel({
      channelId: 'Zone Wake',
      channelName: 'Zone Wake',
      channelDescription: 'Notification for Zone Wake',
      importance: 4,
      vibrate: true,
    });
    Geolocation.setRNConfiguration({
      authorizationLevel: 'auto', // Request "auto" location permission
      skipPermissionRequests: false, // Prompt for permission if not granted
      enableBackgroundLocationUpdates: true,
      locationProvider: 'auto',
    });

    const watchId = Geolocation.watchPosition(
      position => {
        console.log('New position:', position);
        if (alarms.length !== 0 && alarms.find(alarm => alarm.isActive)) {
          locationDetector(position);
        }
      },
      error => {
        console.log('Geolocation error:', error);
        promptEnableLocation();
      },
      {
        distanceFilter: 1, // Minimum distance (in meters) to update the location
        interval: 900000, // Update interval (in milliseconds), which is 15 minutes
        fastestInterval: 300000, // Fastest update interval (in milliseconds)
        accuracy: {
          android: 'highAccuracy',
          ios: 'best',
        },
        showsBackgroundLocationIndicator: true,
        pausesLocationUpdatesAutomatically: false,
        activityType: 'fitness', // Specify the activity type (e.g., 'fitness' or 'other')
        useSignificantChanges: false,
        deferredUpdatesInterval: 0,
        deferredUpdatesDistance: 0,
        foregroundService: {
          notificationTitle: 'Tracking your location',
          notificationBody: 'Enable location tracking to continue', // Add a notification body
        },
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [alarms]);

  return (
    <NavigationContainer>
      <Tab.Navigator backBehavior="history">
        {path !== '/mapalarm' && (
          <Tab.Screen name="Active">
            {() => (
              <>
                <Active />
                <IconButton
                  onClick={handleNavigateToMap}
                  icon={<AddIcon name="add-circle" color="green" size={40} />}
                />
              </>
            )}
          </Tab.Screen>
        )}

        {path !== '/mapalarm' && (
          <Tab.Screen name="Favourite">
            {() => (
              <>
                <Favourite />
                <IconButton
                  onClick={handleNavigateToMap}
                  icon={<AddIcon name="add-circle" color="red" size={40} />}
                />
              </>
            )}
          </Tab.Screen>
        )}

        {path !== '/mapalarm' && (
          <Tab.Screen name="History">
            {() => (
              <>
                <History />
              </>
            )}
          </Tab.Screen>
        )}
        {path === '/mapalarm' && (
          <Tab.Screen name="Choose location">
            {() => (
              <>
                <MapAlarm />
              </>
            )}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
