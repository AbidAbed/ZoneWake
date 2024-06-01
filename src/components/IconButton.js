import {Text, TouchableOpacity} from 'react-native';
import globalStyle from '../globalStyleObject';
function IconButton({icon, onClick, style}) {
  return (
    <TouchableOpacity style={style || globalStyle.iconButton} onPress={onClick}>
      <Text>{icon}</Text>
    </TouchableOpacity>
  );
}
export default IconButton;
