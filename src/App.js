import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import Favourites from './components/Favourites';
import Active from './components/Active';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from './components/IconButton';
import MapAlarm from './components/MapAlarm';
import AddIcon from 'react-native-vector-icons/Ionicons';
import {BackHandler} from 'react-native';
import {
  changePath,
  changeUserLocation,
  initialAlarms,
  popHistory,
  pushHistory,
  updateAlarm,
} from './store/StoreInterface';
import GetLocation from 'react-native-get-location';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import useIsPointInRange from './hooks/useIsPointInRange';
import useCalculateDistance from './hooks/useCalculateDistance';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Tab = createBottomTabNavigator();
const range = 100;
const speed = 2 * 0.001;
function App() {
  const {path, history} = useSelector(state => state.config);
  const alarms = useSelector(state => state.alarms);

  const dispatch = useDispatch();

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
    } catch (error) {
      //console.log(error);
    }
  }

  function backHandler() {
    dispatch(popHistory());
    dispatch(popHistory());

    if (history.length - 1 >= 0) {
      dispatch(changePath(history[history.length - 1]));
    }
    return true; // Indicate that we've handled the back button press
  }

  function handleNavigateToMap() {
    dispatch(changePath('/mapalarm'));
    dispatch(pushHistory('/mapalarm'));
  }

  async function locationDetector() {
    try {
      const userLocation = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      dispatch(
        changeUserLocation({
          longitude: userLocation.longitude,
          latitude: userLocation.latitude,
        }),
      );

      await AsyncStorage.setItem(
        'User-Location',
        JSON.stringify({
          longitude: userLocation.longitude,
          latitude: userLocation.latitude,
        }),
      );

      alarms.forEach(activeAlarm => {
        //lat1, lon1, lat2, lon2
        const updatedEstimatedDistance = useCalculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          activeAlarm.latitude,
          activeAlarm.longitude,
        );
        const updatedEstimatedTime = updatedEstimatedDistance / (speed * 60);
        if (activeAlarm.isActive) {
          if (
            useIsPointInRange(
              userLocation.longitude,
              userLocation.latitude,
              activeAlarm.longitude,
              activeAlarm.longitude,
              range,
            )
          ) {
            PushNotification.localNotification({
              channelId: 'Location-Alarmer',
              title: `${activeAlarm.title} IS REACHED`,
              message: `Estimated time (minutes): ${updatedEstimatedTime}, Estimated distance (KM): ${updatedEstimatedDistance}`,
            });
            dispatch(
              updateAlarm({...activeAlarm, isActive: false, isFavourite: true}),
            );
            AsyncStorage.setItem(
              JSON.stringify([
                ...alarms.filter(alarm => alarm.id !== activeAlarm.id),
                {...activeAlarm, isActive: false, isFavourite: true},
              ]),
            );
          } else {
            PushNotification.localNotification({
              id: activeAlarm.id,
              channelId: 'Location-Alarmer',
              title: `${activeAlarm.title} alarm`,
              message: `Estimated time (minutes): ${updatedEstimatedTime}, Estimated distance (KM): ${updatedEstimatedDistance}`,
            });
            //console.log('Triggering locationDetector');
          }
        }
      });
    } catch (error) {
      //console.log(error);
    }
  }

  useEffect(() => {
    getStorage();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    PushNotification.createChannel({
      channelId: 'Location-Alarmer', // (required)
      channelName: 'Locations-Alarms', // (required)
      channelDescription: 'Notification for Location Alarms', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, [history]);

  useEffect(() => {
    // Start a background task that runs every 10 seconds
    const intervalId = BackgroundTimer.setInterval(() => {
      if (alarms.length !== 0 && alarms.find(alarm => alarm.isActive))
        locationDetector();
    }, 10 * 1000); // 10 seconds

    // Clean up on component unmount
    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, []);

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
          <Tab.Screen name="Favourites">
            {() => (
              <>
                <Favourites />
                <IconButton
                  onClick={handleNavigateToMap}
                  icon={<AddIcon name="add-circle" color="red" size={40} />}
                />
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
