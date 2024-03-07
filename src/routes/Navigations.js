import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import "react-native-gesture-handler";

/***
 * Mobile Screens ree
 * start date 20-06-2019
 */
/***
 * Phase 2 Screens
 */
import Welcome from "../containers/startContainer";
import Login from "../containers/loginContainer";
import Register from "../containers/registerContainer";
import Confirm from "../containers/confirmContainer";
import Forgot from "../containers/forgotContainer";
import AnalysisTab from "../containers/analysisTabContainer";
import ResponseUi from "../containers/responseUiContainer";
import Plan from "../containers/planContainer";
import GettingStart from "../containers/gettingStartContainer";
import Stripe from "../containers/stripeContainer";
import Reset from "../containers/resetContainer";
import Document from "../containers/docContainer";
import NewConsult from "../containers/newConsultContainer";
import Consult from "../containers/consultContainer";
import ContactSupport from "../containers/contactContainer";
import Profile from "../containers/profileContainer";
import ApplePay from "../containers/applePayContainer";
import TV from "../containers/tvContainer";
import VideoTab from "../containers/videoTabContainer";
import Subscription from "../containers/appleSubscriptionContainer";
import Tos from "../containers/tosConatiner";
import Privacy from "../containers/privacyContainer";
import Player from "../containers/playerContainer";
import HairCareQuestionnaire from "../containers/HairCareQuestionnaireContainer";
import WebViewScreen from "../containers/webViewScreen";
import BookVirtualAppointment from "../containers/bookVirtualAppointmentContainer";
import BVCalendar from "../containers/BVCalendarContainer";
import BVUserInformation from "../containers/BVUserInformationContainer";
import BVPayment from "../containers/BVPayment";
import WebViewChat from "../containers/webviewchat";

import OrderHairKit from "../containers/OrderHairKitContainer";
import ZoomImage from "../containers/zoomImageContainer";

import Recommendations from "../containers/recommendationsContainer";
import ProductDetails from "../containers/productDetailsContainer";
import ArticleDetails from "../containers/articleDetailsContainer";
import RegimeDetails from "../containers/regimeDetailsContainer";
import IngredientDetails from "../containers/ingredientDetailsContainter";
import CreatePost from "../containers/createPostContainer";
import GroupPost from "../containers/groupPostContainer";
import CommunityGroups from "../containers/communityGroupContainer";
import PostComments from "../containers/postCommentsContainer";
import PostPlayer from "../containers/postPlayerContainer";
/**
 * Phase 1 screens
 */
import Home from "../containers/homeContainer";
import Cloud from "../containers/cloudContainer";
import Work from "../containers/workContainer";
import Camera from "../containers/cameraContainer";
import Analysis from "../containers/analysisContainer";
import Product from "../containers/productContainer";
import ComprehensiveAnalysis from "../containers/comprehensiveContainer";
import MyHairProfile from "../containers/viewHairContainer";
import DigitalHairAiResults from "../containers/digitalHairAiResultsContainer";
import QuestionnaireStep1 from "../containers/questionnaireStep1";
import QuestionnaireStep2 from "../containers/questionnaireStep2";
import QuestionnaireStep3 from "../containers/questionnaireStep3";
import QuestionnaireStep4 from "../containers/questionnaireStep4";
import HairDiary from "../containers/hairDiary";
import HairDiaryCalendar from "../containers/hairDiaryCalendar";
import HairDiaryRoutine from "../containers/hairDiaryRoutine";
import HairDiaryAdd from "../containers/hairDiaryAddContainer";
import NewProduct from "../containers/newProductConatiner";
// import LoadingAnim from "../components/common/LoadingAnim"
import HomeNew from "../containers/homeNewContainer";
import WelcomeStart from "../containers/welcomeStart";
import AllSet from "../containers/allSetContainer";
import Walkthrough from "../containers/walkthroughContainer";
import HairAnalysis from "../containers/hairAnalysisContainer";
import HairQuestions from "../containers/hairQuestionsContainer";
import SubscribeSignUp from "../containers/subscribeSignUpContainer";
import RecommendProduct from "../containers/recommendProductContainer";
import RecommendProductDetail from "../containers/recomendProductDetailContainer";
import Dashboard from "../containers/dashboardContainer";
import NewConsultBottom from "../components/Screens/newConsultBottom";
import CategoriesProductDetail from "../containers/productCategoriesDetailContainer";
import RequestNewRecommendations from "../containers/requestNewRecommendations";
import BVOrderKit from "../containers/BVOrderKitContainer";
import BVVideoPermission from "../containers/BVVideoPermissionContainer";
import BVVideoCall from "../containers/BVVideoCallContainer";
import BVJoin from "../containers/BVJoinContainer";
import PaymentWebView from "../components/Screens/BVPayment/PaymentWebView";
import HelpSupport from "../containers/help_supportContainer";
import HelpSupportDetails from "../containers/help_supportDetailsContainer";
export default Nagivations = createAppContainer(
  createStackNavigator(
    {
      WelcomeStart: { screen: WelcomeStart },
      Login: { screen: Login },
      Welcome: { screen: Welcome },
      Reset: { screen: Reset },

      ApplePay: { screen: ApplePay },
      Register: { screen: Register },
      Forgot: { screen: Forgot },
      Plan: { screen: Plan },

      GettingStart: { screen: GettingStart },
      ResponseUi: {
        screen: ResponseUi,
        navigationOptions: { headerShown: false },
      },
      AnalysisTab: { screen: AnalysisTab },
      QuestionnaireStep1: {
        screen: QuestionnaireStep1,
        navigationOptions: { headerShown: false },
      },
      QuestionnaireStep2: {
        screen: QuestionnaireStep2,
        navigationOptions: { headerShown: false },
      },
      QuestionnaireStep3: {
        screen: QuestionnaireStep3,
        navigationOptions: { headerShown: false },
      },
      QuestionnaireStep4: {
        screen: QuestionnaireStep4,
        navigationOptions: { headerShown: false },
      },
      MyHairProfile: {
        screen: MyHairProfile,
        navigationOptions: { headerShown: false },
      },
      DigitalHairAiResults: {
        screen: DigitalHairAiResults,
        navigationOptions: { headerShown: false },
      },
      HairDiary: {
        screen: HairDiary,
        navigationOptions: { headerShown: false },
      },
      HairDiaryCalendar: {
        screen: HairDiaryCalendar,
        navigationOptions: { headerShown: false },
      },
      HairDiaryRoutine: {
        screen: HairDiaryRoutine,
        navigationOptions: { headerShown: false },
      },
      HairDiaryAdd: {
        screen: HairDiaryAdd,
        navigationOptions: { headerShown: false },
      },
      Recommendations: { screen: Recommendations },
      ProductDetails: {
        screen: ProductDetails,
        navigationOptions: { headerShown: false },
      },
      ArticleDetails: {
        screen: ArticleDetails,
        navigationOptions: { headerShown: false },
      },
      RegimeDetails: {
        screen: RegimeDetails,
        navigationOptions: { headerShown: false },
      },
      IngredientDetails: {
        screen: IngredientDetails,
        navigationOptions: { headerShown: false },
      },
      CreatePost: { screen: CreatePost },
      GroupPost: { screen: GroupPost },
      CommunityGroups: {
        screen: CommunityGroups,
        navigationOptions: { headerShown: false },
      },
      PostComments: { screen: PostComments },
      PostPlayer: { screen: PostPlayer },

      NewConsult: { screen: NewConsult },
      Stripe: { screen: Stripe },
      ComprehensiveAnalysis: { screen: ComprehensiveAnalysis },
      Confirm: { screen: Confirm },
      Document: { screen: Document },
      Consult: { screen: Consult },
      Profile: { screen: Profile },
      HairCareQuestionnaire: { screen: HairCareQuestionnaire },
      WebViewScreen: { screen: WebViewScreen },
      OrderHairKit: { screen: OrderHairKit },
      RequestNewRecommendations: { screen: RequestNewRecommendations },
      ZoomImage: { screen: ZoomImage },
      TV: { screen: TV },
      VideoTab: { screen: VideoTab },
      Subscription: { screen: Subscription },
      Tos: { screen: Tos },
      Privacy: { screen: Privacy },
      Player: { screen: Player },

      Work: { screen: Work },
      NewProduct: { screen: NewProduct },
      Home: { screen: Home },
      Camera: { screen: Camera },
      Analysis: { screen: Analysis },
      Cloud: { screen: Cloud },
      Product: { screen: Product },
      ContactSupport: { screen: ContactSupport },
      BookVirtualAppointment: {
        screen: BookVirtualAppointment,
        // navigationOptions: { headerShown: false },
      },
      HelpSupport: {
        screen: HelpSupport,
        navigationOptions: { headerShown: false },
      },
      HelpSupportDetails: {
        screen: HelpSupportDetails,
        navigationOptions: { headerShown: false },
      },
      BVCalendar: {
        screen: BVCalendar,
        navigationOptions: { headerShown: false },
      },
      BVUserInformation: {
        screen: BVUserInformation,
        navigationOptions: { headerShown: false },
      },
      BVPayment: {
        screen: BVPayment,
        navigationOptions: { headerShown: false },
      },
      BVVideoCall: {
        screen: BVVideoCall,
        navigationOptions: { headerShown: false },
      },
      BVOrderKit: {
        screen: BVOrderKit,
        navigationOptions: { headerShown: false },
      },
      BVVideoPermission: {
        screen: BVVideoPermission,
        navigationOptions: { headerShown: false },
      },
      BVJoin: {
        screen: BVJoin,
        navigationOptions: { headerShown: false },
      },
      PaymentWebView: {
        screen: PaymentWebView,
        navigationOptions: { headerShown: false },
      },
      WebViewChat: {
        screen: WebViewChat,
        navigationOptions: { headerShown: false },
      },

      HomeNew: { screen: HomeNew },
      AllSet: { screen: AllSet },
      Walkthrough: { screen: Walkthrough },
      HairAnalysis: { screen: HairAnalysis },
      HairQuestions: { screen: HairQuestions },
      SubscribeSignUp: { screen: SubscribeSignUp },
      RecommendProduct: { screen: RecommendProduct },

      RecommendProductDetail: { screen: RecommendProductDetail },
      Dashboard: { screen: Dashboard },
      NewConsultBottom: { screen: NewConsultBottom },
      CategoriesProductDetail: { screen: CategoriesProductDetail },
    },
    {}
  )
);
