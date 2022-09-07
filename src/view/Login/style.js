import {Platform, Dimensions} from 'react-native';
import helpers from '../../helpers';
const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default {
  shell: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: hp('30%'),
  },
  imageLogo: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    height: height,
    paddingTop: height * 0.1,
    alignItems: 'center',
  },
  containerWithEmail: {
    flex: 1,
    height: height,
    alignItems: 'center',
  },
  textTitleWithEmail: {
    fontSize: helpers.scaling.moderateScale(28),
    color: '#565454',
    letterSpacing: 0.34,
    alignItems: 'center',
    fontWeight: 'bold',
    marginTop: 18,
  },
  textTitle: {
    fontSize: helpers.scaling.moderateScale(20),
    color: '#565454',
    letterSpacing: 0.34,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },
  icon: {
    width: helpers.scaling.moderateScale(24),
    height: helpers.scaling.moderateScale(24),
  },
  textHaveAccount: {
    fontSize: helpers.scaling.moderateScale(16),
    color: '#565454',
    letterSpacing: 0.34,
    alignItems: 'center',
    marginTop: helpers.scaling.moderateScale(25),
  },
  textSignUp: {
    fontSize: helpers.scaling.moderateScale(16),
    color: '#ff3e6c',
    letterSpacing: 0.34,
    alignItems: 'center',
    fontWeight: 'bold',
    marginTop: helpers.scaling.moderateScale(25),
  },
  text: {
    fontSize: helpers.scaling.moderateScale(16),
    paddingLeft: 10,
    color: '#565454',
    marginLeft: 10,
  },
  inputEmail: {
    width: 296,
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    margin: 10,
    height: 56,
  },
  submitButton: {
    borderRadius: 4,
    shadowColor: Platform.OS === 'ios' ? '#000' : null,
    shadowOffset: Platform.OS === 'ios' ? {width: 0, height: 5} : null,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : null,
    shadowRadius: Platform.OS === 'ios' ? 1 : null,
    shadowColor: '#000',
    elevation: Platform.OS === 'ios' ? 3 : 4,
    width: width * 0.8,
    height: helpers.scaling.moderateScale(56),
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft: 15,
    alignItems: 'center',
    marginBottom: helpers.scaling.moderateScale(16),
  },
  input: {
    marginLeft: 16,
    fontSize: 16,
    height: 50,
    width: '87%',
    color: '#565454',
  },
  textSubTitleGrey: {
    fontSize: 12,
    color: '#565454',
  },
  textForgotPass: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#9FA2B4',
    letterSpacing: 0.34,
  },

  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  containerTextTerm: {
    position: 'absolute',
    bottom: 40,
    width: width * 0.9,
  },
  textTerm: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    textAlign: 'center',
  },
  textTermServices: {
    fontSize: helpers.scaling.moderateScale(14),
    color: '#565454',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
};
