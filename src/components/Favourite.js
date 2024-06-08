import {useDispatch, useSelector} from 'react-redux';
import AlarmsList from './AlarmsList';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {changePath, pushHistory} from '../store/StoreInterface';

function Favourite() {
  const dispatch = useDispatch();
  const alarms = useSelector(state => state.alarms);

  const favouriteAlarms = alarms.filter(alarm => alarm.isFavourite);

  useFocusEffect(
    useCallback(() => {
      dispatch(changePath('/favourites'));
      dispatch(pushHistory('/favourites'));
    }, []),
  );
  return (
    <AlarmsList alarmsList={favouriteAlarms} itemsName="Favourite Alarms" />
  );
}
export default Favourite;
