import React from 'react';
import {Modal, ScrollView, Text, TextInput, View} from 'react-native';
import IsFavoriteIcon from 'react-native-vector-icons/MaterialIcons';
import IsNotFavoriteIcon from 'react-native-vector-icons/MaterialIcons';
import ActiveIcon from 'react-native-vector-icons/FontAwesome';
import NotActiveIcon from 'react-native-vector-icons/FontAwesome';
import IconButton from './IconButton';
import SaveIcon from 'react-native-vector-icons/Entypo';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import globalStyle from '../globalStyleObject';
function Alarm({
  alarmLocation,
  setAlarmLocation,
  isEdit,
  saveLocation,
  closeEdit,
  onDelete,
  children,
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
    <ScrollView
      style={
        isEdit
          ? globalStyle.singleAlarmEditingBackgroundColor
          : globalStyle.singleAlarmBackground
      }>
      {isEdit ? (
        <Modal>
          <View
            style={[
              globalStyle.singleAlarmEditingBackgroundColor,
              {flexDirection: 'column', width: '100%', height: '100%'},
            ]}>
            {isEdit && (
              <IconButton
                icon={
                  <CloseIcon name="closecircle" size={20} color="#c6d9cd" />
                }
                onClick={closeEdit}
                style={{
                  alignSelf: 'flex-end',
                  padding: '2%',
                }}
              />
            )}
            <View style={{padding: '2%'}}>
              <Text style={[globalStyle.textTitle, {paddingBottom: '1%'}]}>
                Location Name {isEdit && `(Optional)`}
              </Text>
              {isEdit ? (
                <TextInput
                  style={globalStyle.inputText}
                  placeholder="Default : Home"
                  value={alarmLocation.title}
                  onChangeText={onTitleChange} // Use onChangeText instead of onChange
                  editable={isEdit}
                />
              ) : (
                <Text style={[globalStyle.textContent]}>
                  {alarmLocation.title}
                </Text>
              )}
            </View>
            <View style={{padding: '2%'}}>
              <Text style={[globalStyle.textTitle, {paddingBottom: '1%'}]}>
                Location Description {isEdit && `(Optional)`}
              </Text>

              {isEdit ? (
                <TextInput
                  style={globalStyle.inputText}
                  placeholder="Default : Where I live"
                  value={alarmLocation.description}
                  onChangeText={onDescriptionChange} // Use onChangeText instead of onChange
                  editable={isEdit}
                />
              ) : (
                <Text style={[globalStyle.textContent]}>
                  {alarmLocation.description}
                </Text>
              )}
            </View>
            <View style={{padding: '2%', flexDirection: 'row'}}>
              <Text style={globalStyle.textTitle}>
                Estimated Distance {`(KM)`}:{' '}
              </Text>
              <Text style={globalStyle.textContent}>
                {alarmLocation.estimatedDistance.toFixed(4)}
              </Text>
            </View>
            <View style={{padding: '2%', flexDirection: 'row'}}>
              <Text style={globalStyle.textTitle}>
                Estimated Time {`(Minutes)`}:{' '}
              </Text>
              <Text style={globalStyle.textContent}>
                {alarmLocation.estimatedTime.toFixed(4)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{padding: '2%'}}>
                <Text style={globalStyle.textTitle}>
                  {alarmLocation.isActive ? 'Activated' : 'Not Activated'}{' '}
                </Text>
                <IconButton
                  icon={
                    alarmLocation.isActive ? (
                      <ActiveIcon name="toggle-on" size={30} color="#c6d9cd" />
                    ) : (
                      <NotActiveIcon
                        name="toggle-off"
                        size={30}
                        color="#c6d9cd"
                      />
                    )
                  }
                  onClick={onActivate}
                  style={{}}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '2%',
                }}>
                {isEdit && (
                  <IconButton
                    icon={<SaveIcon name="save" size={30} color="#c6d9cd" />}
                    onClick={saveLocation}
                    style={{}}
                  />
                )}

                {onDelete && (
                  <IconButton
                    icon={<DeleteIcon name="delete" size={30} color="red" />}
                    onClick={() => onDelete(alarmLocation)}
                    style={{}}
                  />
                )}

                <View style={{padding: '2%'}}>
                  <IconButton
                    icon={
                      alarmLocation.isFavourite ? (
                        <IsFavoriteIcon name="favorite" size={30} color="red" />
                      ) : (
                        <IsNotFavoriteIcon
                          name="favorite-border"
                          size={30}
                          color="#c6d9cd"
                        />
                      )
                    }
                    onClick={onFavourite}
                    style={{}}
                  />
                </View>

                {children}
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <>
          {isEdit && (
            <IconButton
              icon={<CloseIcon name="closecircle" size={20} color="#c6d9cd" />}
              onClick={closeEdit}
              style={{
                alignSelf: 'flex-end',
                padding: '2%',
              }}
            />
          )}
          <View style={{padding: '2%'}}>
            <Text style={[globalStyle.textTitle, {paddingBottom: '1%'}]}>
              Location Name {isEdit && `(Optional)`}
            </Text>
            {isEdit ? (
              <TextInput
                style={globalStyle.inputText}
                placeholder="Default : Home"
                value={alarmLocation.title}
                onChangeText={onTitleChange} // Use onChangeText instead of onChange
                editable={isEdit}
              />
            ) : (
              <Text style={[globalStyle.textContent]}>
                {alarmLocation.title}
              </Text>
            )}
          </View>
          <View style={{padding: '2%'}}>
            <Text style={[globalStyle.textTitle, {paddingBottom: '1%'}]}>
              Location Description {isEdit && `(Optional)`}
            </Text>

            {isEdit ? (
              <TextInput
                style={globalStyle.inputText}
                placeholder="Default : Where I live"
                value={alarmLocation.description}
                onChangeText={onDescriptionChange} // Use onChangeText instead of onChange
                editable={isEdit}
              />
            ) : (
              <Text style={[globalStyle.textContent]}>
                {alarmLocation.description}
              </Text>
            )}
          </View>
          <View style={{padding: '2%', flexDirection: 'row'}}>
            <Text style={globalStyle.textTitle}>
              Estimated Distance {`(KM)`}:{' '}
            </Text>
            <Text style={globalStyle.textContent}>
              {alarmLocation.estimatedDistance.toFixed(4)}
            </Text>
          </View>
          <View style={{padding: '2%', flexDirection: 'row'}}>
            <Text style={globalStyle.textTitle}>
              Estimated Time {`(Minutes)`}:{' '}
            </Text>
            <Text style={globalStyle.textContent}>
              {alarmLocation.estimatedTime.toFixed(4)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{padding: '2%'}}>
              <Text style={globalStyle.textTitle}>
                {alarmLocation.isActive ? 'Activated' : 'Not Activated'}{' '}
              </Text>
              <IconButton
                icon={
                  alarmLocation.isActive ? (
                    <ActiveIcon name="toggle-on" size={30} color="#c6d9cd" />
                  ) : (
                    <NotActiveIcon
                      name="toggle-off"
                      size={30}
                      color="#c6d9cd"
                    />
                  )
                }
                onClick={onActivate}
                style={{}}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '2%',
              }}>
              {isEdit && (
                <IconButton
                  icon={<SaveIcon name="save" size={30} color="#c6d9cd" />}
                  onClick={saveLocation}
                  style={{}}
                />
              )}

              {onDelete && (
                <IconButton
                  icon={<DeleteIcon name="delete" size={30} color="red" />}
                  onClick={() => onDelete(alarmLocation)}
                  style={{}}
                />
              )}

              <View style={{padding: '2%'}}>
                <IconButton
                  icon={
                    alarmLocation.isFavourite ? (
                      <IsFavoriteIcon name="favorite" size={30} color="red" />
                    ) : (
                      <IsNotFavoriteIcon
                        name="favorite-border"
                        size={30}
                        color="#c6d9cd"
                      />
                    )
                  }
                  onClick={onFavourite}
                  style={{}}
                />
              </View>

              {children}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

export default Alarm;
