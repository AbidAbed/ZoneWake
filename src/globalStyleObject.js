import {StyleSheet} from 'react-native';

const globalStyle = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  textTitle: {
    color: 'white',
  },
  textContent: {
    color: '#c6d9cd',
  },
  background: {
    backgroundColor: '#242f3e',
    color: '#c6d9cd',
  },
  primaryButton: {
    backgroundColor: '#24507b',
    color: '#c6d9cd',
  },
  secondaryButton: {
    backgroundColor: '#d7e6f4',
    color: '#25323d',
  },
  inputText: {
    backgroundColor: '#1e4467',
    color: '#c6d9cd',
    paddingLeft: '2%',
    borderRadius: 10,
    borderColor: '#c6d9cd',
    borderWidth: 1,
    textAlign: 'left',
  },
  singleAlarmBackground: {
    backgroundColor: '#1e4467',
    color: '#c6d9cd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c6d9cd',
  },
  singleAlarmEditingBackgroundColor: {
    backgroundColor: '#1f3f56',
    color: '#c6d9cd',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#1e4467',
  },
  mapCustomStyle: [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}],
    },
  ],
  appNameHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-smallcaps',
    paddingLeft: '2%',
    paddingTop: '2%',
    // backgroundColor: '#24507b',
  },
});
export default globalStyle;
