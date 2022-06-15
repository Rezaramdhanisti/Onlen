import {Platform, Dimensions} from 'react-native';
import helpers from '../../helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const {width, height} = Dimensions.get('window');

export default {
  shell: {
    flex: 1,
    backgroundColor: '#f9fafc',
    paddingTop: Platform.OS === 'ios' ? hp('8%') : hp('2%'),
  },
  containerWithEmail: {
    flex: 1,
    height: height,
    paddingHorizontal: wp(5),
  },
  textTitleWithEmail: {
    fontSize: helpers.scaling.moderateScale(20),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textSales: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    marginTop: hp(0.5),
    letterSpacing: 0.34,
    fontWeight: '400',
  },
  textMenu: {
    fontSize: helpers.scaling.moderateScale(13),
    color: '#565454',
    marginTop: hp(0.8),
    letterSpacing: 0.34,
    fontWeight: '500',
  },
  containerSales: {
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 4,
    paddingVertical: 10,
    width: wp(36),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginTop: hp(1.5),
  },
  textSalesValue: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#ff3e6c',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textCurrency: {
    fontSize: helpers.scaling.moderateScale(12),
    color: '#ff3e6c',
    letterSpacing: 0.34,
    marginBottom: 8,
    marginRight: 5,
  },
  textSalesValueWhite: {
    fontSize: helpers.scaling.moderateScale(22),
    color: 'white',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textCurrencyWhite: {
    fontSize: helpers.scaling.moderateScale(12),
    color: 'white',
    letterSpacing: 0.34,
    marginRight: 5,
  },
  textSalesValueWhiteSmall: {
    fontSize: helpers.scaling.moderateScale(10),
    color: 'white',
    letterSpacing: 0.34,
    fontWeight: 'bold',
  },
  textCurrencyWhiteSmall: {
    fontSize: helpers.scaling.moderateScale(8),
    color: 'white',
    letterSpacing: 0.34,
    marginRight: 5,
  },
  textTotalSalesSmall: {
    fontSize: helpers.scaling.moderateScale(11),
    color: 'white',
    marginTop: hp(0.5),
    letterSpacing: 0.34,
    fontWeight: '400',
  },
  textTotalSales: {
    fontSize: helpers.scaling.moderateScale(14),
    color: 'white',
    marginTop: hp(0.5),
    letterSpacing: 0.34,
    fontWeight: '400',
  },
  textTitleInfo: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    letterSpacing: 0.34,
    fontWeight: 'bold',
    marginTop: hp(3),
  },
};
