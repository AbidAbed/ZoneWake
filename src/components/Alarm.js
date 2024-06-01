import React from 'react';
import {Text, TextInput, View} from 'react-native';
import IsFavoriteIcon from 'react-native-vector-icons/MaterialIcons';
import IsNotFavoriteIcon from 'react-native-vector-icons/MaterialIcons';
import ActiveIcon from 'react-native-vector-icons/FontAwesome';
import NotActiveIcon from 'react-native-vector-icons/FontAwesome';
import IconButton from './IconButton';
import SaveIcon from 'react-native-vector-icons/Entypo';
import CloseIcon from 'react-native-vector-icons/AntDesign';

function SingleAlarm({
  alarmLocation,
  setAlarmLocation,
  isEdit,
  saveLocation,
  closeEdit,
}) {
  function onFavourite() {
    setAlarmLocation({
      ...alarmLocation,
      isFavourite: !alarmLocation.isFavourite,
    });
  }

  function onTitleChange(text) {
    setAlarmLocation({...alarmLocation, title: text});
  }

  function onDescriptionChange(text) {
    setAlarmLocation({...alarmLocation, description: text});
  }

  function onActivate() {
    setAlarmLocation({
      ...alarmLocation,
      isActive: !alarmLocation.isActive,
    });
  }

  return (
    <>
      <View>
        <Text>Location Name {isEdit && `(Optional)`}</Text>
        <TextInput
          placeholder="Default : Home"
          value={alarmLocation.title}
          onChangeText={onTitleChange} // Use onChangeText instead of onChange
          editable={isEdit}
        />
      </View>

      <View>
        <Text>Location Description {isEdit && `(Optional)`}</Text>
        <TextInput
          placeholder="Default : Where I live"
          value={alarmLocation.description}
          onChangeText={onDescriptionChange} // Use onChangeText instead of onChange
          editable={isEdit}
        />
      </View>

      <View>
        <Text>{alarmLocation.isActive ? 'Activated' : 'Not Activated'} </Text>
        <IconButton
          icon={
            alarmLocation.isActive ? (
              <ActiveIcon name="toggle-on" size={30} color="red" />
            ) : (
              <NotActiveIcon name="toggle-off" size={30} color="gray" />
            )
          }
          onClick={onActivate}
          style={{}}
        />
      </View>

      <View>
        <IconButton
          icon={
            alarmLocation.isFavourite ? (
              <IsFavoriteIcon name="favorite" size={30} color="red" />
            ) : (
              <IsNotFavoriteIcon
                name="favorite-border"
                size={30}
                color="gray"
              />
            )
          }
          onClick={onFavourite}
          style={{}}
        />
      </View>
      <View>
        <Text>Estimated Distance {`(KM)`}: </Text>
        <Text>{alarmLocation.estimatedDistance.toFixed(4)}</Text>
      </View>
      <View>
        <Text>Estimated Time {`(Minutes)`}: </Text>
        <Text>{alarmLocation.estimatedTime.toFixed(4)}</Text>
      </View>
      {isEdit && (
        <>
          <IconButton
            icon={<SaveIcon name="save" size={30} color="green" />}
            onClick={saveLocation}
            style={{}}
          />

          <IconButton
            icon={<CloseIcon name="closecircle" size={30} color="gray" />}
            onClick={closeEdit}
            style={{position: 'absolute', top: 0, right: 0}}
          />
        </>
      )}
    </>
  );
}

export default SingleAlarm;
