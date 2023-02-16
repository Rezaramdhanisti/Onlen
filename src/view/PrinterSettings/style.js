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
    paddingTop: 16,
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
  containerList: {flex: 1, flexDirection: 'column'},
  bluetoothStatusContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
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
    fontSize: helpers.scaling.moderateScale(14),
    color: '#E9493F',
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: helpers.scaling.moderateScale(14),
    marginBottom: 12,
    color: '#565454',
  },
  printerInfo: {
    textAlign: 'center',
    fontSize: helpers.scaling.moderateScale(14),
    color: '#E9493F',
    marginBottom: 20,
  },
  textHeader: {
    fontSize: helpers.scaling.moderateScale(16),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textTitleWithEmail: {
    fontSize: helpers.scaling.moderateScale(16),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textSubtitle: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
    marginTop: hp(2),
  },
  textToggle: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textToggleDesc: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    letterSpacing: 0.34,
  },
  textPrinterStatus: color => ({
    fontSize: helpers.scaling.moderateScale(14),
    color: color,
    letterSpacing: 0.34,
  }),
};
