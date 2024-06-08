import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  changePath,
  deleteAlarm,
  pushHistory,
  updateAlarm,
} from '../store/StoreInterface';
import {FlatList, Text, View} from 'react-native';
import Alarm from './Alarm';
import EditIcon from 'react-native-vector-icons/AntDesign';
import IconButton from './IconButton';

function AlarmsList({alarmsList, itemsName}) {
  const dispatch = useDispatch();

  const [alarms, setAlarms] = useState(
    [...alarmsList].reduce((prevalarm, alarm) => {
      return {
        ...prevalarm,
        [alarm.id]: {...alarm, isEdit: false},
      };
    }, {}),
  );

  const handleInactiveNonFavoriteAlarm = useCallback(
    item => {
      dispatch(deleteAlarm({...item}));
    },
    [dispatch, alarmsList],
  );

  function changeEdit(item, isEdit) {
    setAlarms({
      ...alarms,
      [item.id]: {...alarms[item.id], ...item, isEdit: isEdit},
    });
  }

  function saveItemUpdated(item) {
    dispatch(updateAlarm({...item}));
    changeEdit(item, false);
  }

  function updateItem(item) {
    setAlarms({
      ...alarms,
      [item.id]: {
        ...item,
        isEdit: true,
      },
    });
  }

  useEffect(() => {
    setAlarms(
      [...alarmsList].reduce((prevalarm, alarm) => {
        return {
          ...prevalarm,
          [alarm.id]: {...alarm, isEdit: false},
        };
      }, {}),
    );
  }, [alarmsList]);

  function renderItem({item}) {
    return (
      <View style={{padding: '5%'}}>
        <Alarm
          alarmLocation={item}
          setAlarmLocation={updateItem}
          isEdit={alarms[item.id]?.isEdit}
          closeEdit={() =>
            changeEdit(
              alarmsList.find(alarm => alarm.id === item.id),
              false,
            )
          }
          saveLocation={() => saveItemUpdated(item, false)}
          key={item.id}
          onDelete={handleInactiveNonFavoriteAlarm}>
          {!alarms[item.id]?.isEdit && (
            <IconButton
              icon={<EditIcon name="edit" size={30} color="#c6d9cd" />}
              onClick={() => changeEdit(item, true)}
              style={{}}
            />
          )}
        </Alarm>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      {Object.entries(alarms).length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
            }}>
            {itemsName} is empty , press + sign to add {itemsName}
          </Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(alarms).map(alarm => alarm[1])}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
export default AlarmsList;
