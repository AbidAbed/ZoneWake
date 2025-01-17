import {useDispatch, useSelector} from 'react-redux';
import {addSingleAlarm, changePath, popHistory} from '../store/StoreInterface';
import {Modal, Text, TextInput, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useEffect, useState} from 'react';

import IconButton from './IconButton';
import ConfirmIcon from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Alarm from './Alarm';
import useCalculateDistance from '../hooks/useCalculateDistance';
import globalStyle from '../globalStyleObject';

function MapAlarm() {
  const dispatch = useDispatch();
  const {path, history, speed} = useSelector(state => state.config);
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
      (useCalculateDistance(
        user.latitude,
        user.longitude,
        user.latitude,
        user.longitude,
      ) *
        1000) /
      ((speed + 0.000001) * 60),
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
          (useCalculateDistance(
            alarmLocation.latitude,
            alarmLocation.longitude,
            user.latitude,
            user.longitude,
          ) *
            1000) /
          ((speed + 0.000001) * 60),
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
      //////console.log(err);
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
        (useCalculateDistance(
          coordinate.latitude,
          coordinate.longitude,
          user.latitude,
          user.longitude,
        ) *
          1000) /
        ((speed + 0.000001) * 60),
    });
  }

  return (
    <View style={{flex: 1}}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps provider
        customMapStyle={globalStyle.mapCustomStyle}
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
        icon={<ConfirmIcon name="checkcircle" color="#c6d9cd" size={30} />}
        onClick={handleConfirmLocation}
        style={{padding: '2%', alignSelf: 'flex-end'}}
      />
      {/* <Modal visible={confirmPressed}> */}
      {confirmPressed && (
        <View style={{flexDirection: 'column', width: '100%', height: '100%'}}>
          <Alarm
            alarmLocation={alarmLocation}
            setAlarmLocation={setAlarmLocation}
            isEdit={true}
            saveLocation={saveLocation}
            closeEdit={() => setConfirmPressed(false)}
          />
        </View>
      )}

      {/* </Modal> */}
    </View>
  );
}
export default MapAlarm;
