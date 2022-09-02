import {Platform, Dimensions} from 'react-native';
import helpers from '../../helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const {width, height} = Dimensions.get('window');

export default {
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerList: {flex: 1, flexDirection: 'column'},
  bluetoothStatusContainer: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: 'white',
    paddingHorizontal: 14,
    marginBottom: 20,
  }),
  bluetoothInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFC806',
    marginBottom: 20,
  },
  sectionTitle: {fontWeight: 'bold', fontSize: 18, marginBottom: 12},
  printerInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E9493F',
    marginBottom: 20,
  },
};
