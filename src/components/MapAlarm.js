import {useDispatch, useSelector} from 'react-redux';
import {addSingleAlarm, changePath, popHistory} from '../store/StoreInterface';
import {Modal, Text, TextInput, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useEffect, useState} from 'react';

import IconButton from './IconButton';
import ConfirmIcon from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SingleAlarm from './SingleAlarm';
import useCalculateDistance from '../hooks/useCalculateDistance';

const speed = 2 * 0.001;
function MapAlarm() {
  const dispatch = useDispatch();
  const {path, history} = useSelector(state => state.config);
  const user = useSelector(state => state.user);
  const alarms = useSelector(state => state.alarms);

  const [alarmLocation, setAlarmLocation] = useState({
    latitude: user.latitude,
    longitude: user.longitude,
    title: 'Home',
    description: 'Where i live',
    isFavourite: false,
    isActive: true,
    estimatedDistance: useCalculateDistance(
      user.latitude,
      user.longitude,
      user.latitude,
      user.longitude,
    ),
    estimatedTime:
      useCalculateDistance(
        user.latitude,
        user.longitude,
        user.latitude,
        user.longitude,
      ) /
      (speed * 60),
  });

  const [confirmPressed, setConfirmPressed] = useState(false);

  function handleConfirmLocation() {
    setConfirmPressed(true);
  }

  async function saveLocation() {
    try {
      const alarmLocationObject = {
        ...alarmLocation,
        id: alarms.length,
        estimatedDistance: useCalculateDistance(
          alarmLocation.latitude,
          alarmLocation.longitude,
          user.latitude,
          user.longitude,
        ),
        estimatedTime:
          useCalculateDistance(
            alarmLocation.latitude,
            alarmLocation.longitude,
            user.latitude,
            user.longitude,
          ) /
          (speed * 60),
      };

      if (alarmLocation.title === '') {
        alarmLocationObject.title = 'Home';
      }

      if (alarmLocation.description === '') {
        alarmLocationObject.description = 'Where i live';
      }

      dispatch(addSingleAlarm({...alarmLocationObject}));

      await AsyncStorage.setItem(
        'Alarms',
        JSON.stringify([...alarms, {...alarmLocationObject}]),
      );

      setConfirmPressed(false);
      dispatch(popHistory());
      dispatch(popHistory());

      dispatch(changePath('/active'));
    } catch (err) {
      //console.log(err);
    }
  }

  function onLocationChange(event) {
    const {coordinate, position} = event.nativeEvent;
    setAlarmLocation({
      ...alarmLocation,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      estimatedDistance: useCalculateDistance(
        coordinate.latitude,
        coordinate.longitude,
        user.latitude,
        user.longitude,
      ),
      estimatedTime:
        useCalculateDistance(
          coordinate.latitude,
          coordinate.longitude,
          user.latitude,
          user.longitude,
        ) /
        (speed * 60),
    });
  }

  return (
    <View style={{flex: 1}}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps provider
        style={{flex: 1}}
        region={{
          latitude: user.latitude,
          longitude: user.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        userLocationUpdateInterval={1000}
        onPress={onLocationChange}>
        <Marker
          draggable
          key="User-Location"
          coordinate={{
            latitude: alarmLocation.latitude,
            longitude: alarmLocation.longitude,
          }}
          title={'Alarm Location'}
          description={'Where the alarm will trigger'}
        />
      </MapView>
      <IconButton
        icon={<ConfirmIcon name="checkcircle" color="green" size={40} />}
        onClick={handleConfirmLocation}
      />
      <Modal visible={confirmPressed}>
        <View style={{flexDirection: 'column'}}>
          <SingleAlarm
            alarmLocation={alarmLocation}
            setAlarmLocation={setAlarmLocation}
            isEdit={true}
            saveLocation={saveLocation}
            closeEdit={() => setConfirmPressed(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
export default MapAlarm;
