import {useDispatch, useSelector} from 'react-redux';
import AlarmsList from './AlarmsList';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {changePath, pushHistory} from '../store/StoreInterface';

function Active() {
  const dispatch = useDispatch();
  const alarms = useSelector(state => state.alarms);

  const activeAlarms = alarms.filter(alarm => alarm.isActive);

  useFocusEffect(
    useCallback(() => {
      dispatch(changePath('/active'));
      dispatch(pushHistory('/active'));
    }, []),
  );
  return <AlarmsList alarmsList={activeAlarms} itemsName="Active Alarms" />;
}
export default Active;
