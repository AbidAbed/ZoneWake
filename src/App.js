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
  View,
  Text,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

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
import globalStyle from './globalStyleObject';
import AlarmIcon from 'react-native-vector-icons/Ionicons';
import FavouriteIcon from 'react-native-vector-icons/Fontisto';
import HistoryIcon from 'react-native-vector-icons/FontAwesome';
import MapIcon from 'react-native-vector-icons/Entypo';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Tab = createBottomTabNavigator();

function App() {
  const {path, range, speed, history} = useSelector(state => state.config);
  const user = useSelector(state => state.user);

  ////console.log(user);
  const alarms = useSelector(state => state.alarms);
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);

  const mapRef = useRef(null);

  function locationDetector(event) {
    try {
      const position = event.nativeEvent.coordinate;
      // const {coordinate, altitude, speed} = event.nativeEvent;
      const speed = event.nativeEvent.coordinate.speed;

      //console.log(speed);
      dispatch(
        changeUserLocation({
          longitude: position.longitude,
          latitude: position.latitude,
        }),
      );

      AsyncStorage.setItem(
        'User-Location',
        JSON.stringify({
          longitude: position.longitude,
          latitude: position.latitude,
        }),
      );

      alarms.forEach(async activeAlarm => {
        const updatedEstimatedDistance = useCalculateDistance(
          position.latitude,
          position.longitude,
          activeAlarm.latitude,
          activeAlarm.longitude,
        );
        const updatedEstimatedTime =
          (updatedEstimatedDistance * 1000) / ((speed + 0.000001) * 60);
        if (activeAlarm.isActive) {
          if (
            useIsPointInRange(
              position.longitude,
              position.latitude,
              activeAlarm.longitude,
              activeAlarm.latitude,
              range,
            )
          ) {
            PushNotification.localNotification({
              channelId: 'Zone Wake',
              title: `${activeAlarm.title} IS REACHED`,
              message: `Estimated time (minutes): ${updatedEstimatedTime.toFixed(
                4,
              )}, Estimated distance (KM): ${updatedEstimatedDistance.toFixed(
                4,
              )}`,
            });
            dispatch(
              updateAlarm({
                ...activeAlarm,
                estimatedTime: updatedEstimatedTime,
                estimatedDistance: updatedEstimatedDistance,
                isActive: false,
              }),
            );
            await AsyncStorage.setItem(
              'Alarms',
              JSON.stringify([
                ...alarms.filter(alarm => alarm.id !== activeAlarm.id),
                {
                  ...activeAlarm,
                  isActive: false,
                  estimatedTime: updatedEstimatedTime,
                  estimatedDistance: updatedEstimatedDistance,
                },
              ]),
            );
          } else {
            await AsyncStorage.setItem(
              'Alarms',
              JSON.stringify([
                ...alarms.filter(alarm => alarm.id !== activeAlarm.id),
                {
                  ...activeAlarm,
                  estimatedTime: updatedEstimatedTime,
                  estimatedDistance: updatedEstimatedDistance,
                },
              ]),
            );
            dispatch(
              updateAlarm({
                ...activeAlarm,
                estimatedTime: updatedEstimatedTime,
                estimatedDistance: updatedEstimatedDistance,
              }),
            );
            // PushNotification.localNotification({
            //   id: activeAlarm.id,
            //   channelId: 'Zone Wake',
            //   title: `${activeAlarm.title} alarm`,
            //   message: `Estimated time (minutes): ${updatedEstimatedTime.toFixed(
            //     4,
            //   )}, Estimated distance (KM): ${updatedEstimatedDistance.toFixed(
            //     4,
            //   )}`,
            // });
          }
        }
      });
    } catch (error) {
      ////console.log('Location detection error:', error);
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
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        ////console.log('All permissions granted');
      } else {
        ////console.log('Some permissions not granted');
      }
    } catch (err) {
      console.warn('Error requesting permissions:', err);
    }
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
      ////console.log(error);
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissions();
    }
    // Create notification channel for alarms
    PushNotification.createChannel({
      channelId: 'Zone Wake',
      channelName: 'Zone Wake',
      channelDescription: 'Notification for Zone Wake',
      importance: 4,
      vibrate: true,
    });
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
    if (isLoaded) AsyncStorage.setItem('Alarms', JSON.stringify(alarms));
  }, [alarms]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        backBehavior="history"
        sceneContainerStyle={globalStyle.background}
        screenOptions={{
          header: () => (
            <View
              style={{
                flexDirection: 'row',
                padding: '2%',
                backgroundColor: '#24507b',
              }}>
              <Text style={[globalStyle.appNameHeader, {color: '#242f3e'}]}>
                Z
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                o
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                n
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                e
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                {' '}
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: '#242f3e'}]}>
                W
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                a
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                k
              </Text>
              <Text style={[globalStyle.appNameHeader, {color: 'white'}]}>
                e
              </Text>
            </View>
          ),
          // headerStyle: {
          //   backgroundColor: '#24507b', // Change this to your desired header background color
          // },
          // headerTintColor: '#c6d9cd', // Change this to your desired header text color
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
          tabBarStyle: {
            backgroundColor: '#24507b', // Change this to your desired tab bar background color
          },
          tabBarActiveTintColor: '#c6d9cd', // Change this to your desired active tab icon color
          tabBarInactiveTintColor: '#dcdcdc', // Change this to your desired inactive tab icon color}}
        }}>
        {path !== '/mapalarm' && (
          <Tab.Screen
            name="Active"
            options={{
              tabBarIcon: () => (
                <AlarmIcon
                  name="alarm"
                  size={path === '/active' ? 30 : 20}
                  color={path === '/active' ? '#c6d9cd' : '#dcdcdc'}
                />
              ),
            }}>
            {() => (
              <>
                <View style={{flex: 1.2}}>
                  <Active />
                </View>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor: '#1e4467',
                    padding: '3%',
                  }}>
                  <MapView
                    onUserLocationChange={locationDetector}
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE} // Use Google Maps provider
                    style={{flex: 1}}
                    customMapStyle={globalStyle.mapCustomStyle}
                    region={{
                      latitude: user.latitude,
                      longitude: user.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    userLocationUpdateInterval={100000 / 2}>
                    {alarms.map(alarm => {
                      if (alarm.isActive) {
                        return (
                          <Marker
                            draggable
                            key={alarm.id}
                            coordinate={{
                              latitude: alarm.latitude,
                              longitude: alarm.longitude,
                            }}
                            title={alarm.title}
                            description={alarm.description}
                          />
                        );
                      }
                    })}
                  </MapView>
                  <IconButton
                    onClick={handleNavigateToMap}
                    icon={
                      <AddIcon name="add-circle" color="#c6d9cd" size={40} />
                    }
                  />
                </View>
              </>
            )}
          </Tab.Screen>
        )}

        {path !== '/mapalarm' && (
          <Tab.Screen
            name="Favourite"
            options={{
              tabBarIcon: () => (
                <FavouriteIcon
                  name="favorite"
                  size={path === '/favourites' ? 30 : 20}
                  color={path === '/favourites' ? '#c6d9cd' : '#dcdcdc'}
                />
              ),
            }}>
            {() => (
              <>
                <Favourite />
                <IconButton
                  onClick={handleNavigateToMap}
                  icon={<AddIcon name="add-circle" color="#c6d9cd" size={40} />}
                />
              </>
            )}
          </Tab.Screen>
        )}

        {path !== '/mapalarm' && (
          <Tab.Screen
            name="History"
            options={{
              tabBarIcon: () => (
                <HistoryIcon
                  name="history"
                  size={path === '/history' ? 30 : 20}
                  color={path === '/history' ? '#c6d9cd' : '#dcdcdc'}
                />
              ),
            }}>
            {() => (
              <>
                <History />
              </>
            )}
          </Tab.Screen>
        )}

        {path === '/mapalarm' && (
          <Tab.Screen
            name="Choose location"
            options={{
              tabBarIcon: () => (
                <MapIcon
                  name="map"
                  size={path === '/mapalarm' ? 30 : 20}
                  color={path === '/mapalarm' ? '#c6d9cd' : '#dcdcdc'}
                />
              ),
            }}>
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
