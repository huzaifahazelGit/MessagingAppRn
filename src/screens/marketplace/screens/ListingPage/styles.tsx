import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '../../../../constants/utils';

const getStyles = () =>
  StyleSheet.create({
    conatiner: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 20,
      backgroundColor: "#231F29"
    },
    scrollContiner: {
      flexGrow: 1,
      paddingBottom: 20
    },
    image: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.5,
      borderRadius: 20,
      borderColor: "white",
      borderWidth: 1,
      resizeMode: "cover",
      marginBottom: 10,
    },
    imageCreator: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.45,

      marginBottom: 10,
    },
    textItem: {
      fontSize: 16,
      paddingBottom: 15,
      paddingLeft: 10,
    },
    textItemInstant: {
      fontSize: 14,
      paddingBottom: 15,
      color: "#A4A3A7",
      textAlign: "center",
    },
    textItemEth: {
      fontSize: 16,
      paddingBottom: 15,
      paddingLeft: 10,
      color: "#D886FF",
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 10,
      backgroundColor: "#D887FF",
      // marginLeft:10,
      borderWidth: 1,
      borderColor: "white",
    },
    dot1: {
      width: 12,
      height: 12,
      borderRadius: 10,
      backgroundColor: "balck",
      borderWidth: 1,
      borderColor: "white",
    },
    lineView: {
      borderBottomWidth: 2,
      borderColor: "white",
      paddingTop: 20,
    },
    btnView: {
      width: 125,
      height: 37,
      borderRadius: 50,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "white",
    },
    imageLike: {
      width: 22,
      height: 22,
      tintColor: "white",
      position: "absolute",
      top: 10,
      resizeMode: "contain",
      alignSelf: "flex-end",
      right: 10,
    },
    popularText: {
      fontSize: 20,
      paddingRight: 10,
    },
    container: {
      flex: 1,
      backgroundColor: "#231F29",
      paddingHorizontal: 15,
    },
    tabView: {
      paddingTop: 5,
    },
    topView: {
      paddingVertical: 40,
    },
    imageContainer: {
      marginRight: 10,
    },
    imageArrow: {
      width: 22,
      height: 22,
      tintColor: "white",
      position: 'relative',
      top: 2,
    },
    imageItem: {
      width: 242,
      height: 307,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'white'
    },
    button: {
      borderRadius: 80,
      justifyContent: "center",
      height: 50,
    },
    text: {
      color: '#221F29', // default text color
      fontSize: 20,
      fontWeight: 'bold',
    },
    small_contentView: {
      position: "absolute",
      left: 10,
      bottom: 20,
      flexDirection: 'row'
    },
    small_leftTitleView: {
      flexDirection: "column",
      width: "95%",
    },
    small_leftAddedTitleView: {
      flexDirection: "column",
      width: "65%",
    },
    small_rigthTitleView: {
      fontSize: 11,
      position: "relative",
      top: 20,
      left: 3,
      width: "30%",
    },
    scrollViewAllContent: {
      paddingTop: 20,
    },
    small_image: {
      width: 146,
      height: 184,
      marginRight: 10,
      borderRadius: 10,
    },
    small_imageView: {
      borderRadius: 10,
      resizeMode: 'cover',
      borderWidth: 2,
      borderColor: 'white',
    },
    imageLikeView: {
      position: "absolute",
      alignSelf: "flex-end",
    },
    similarView: {
      paddingTop: 10
    },
    sameFeatureView: {
      paddingTop: 30
    },
    productTitleView: {
      flexDirection: "row",
      paddingTop: 5
    },
    productTitleInnerView: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
    },
    loaderView: {
      position: 'absolute',
      zIndex: 99,
      top: 240,
      alignSelf: "center"
    },
    commerciallView:{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 15,
      paddingBottom:20
    }
  });

export default getStyles;
