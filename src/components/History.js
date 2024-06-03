import {useDispatch, useSelector} from 'react-redux';
import AlarmsList from './AlarmsList';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {changePath, pushHistory} from '../store/StoreInterface';

function History() {
  const dispatch = useDispatch();
  const alarms = useSelector(state => state.alarms);

  useFocusEffect(
    useCallback(() => {
      dispatch(changePath('/history'));
      dispatch(pushHistory('/history'));
    }, []),
  );
  return <AlarmsList alarmsList={alarms} />;
}
export default History;
