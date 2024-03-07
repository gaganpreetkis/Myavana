import { connect } from 'react-redux';
import Login from '../components/Screens/login';
import { loginUserAction,paymentStatusAction,subscriptionPlanAction } from "../actions/userAction";

const mapStateToProps = (state) => {
    return {
        user:state.user.loginUserData,
        plans:state.user.plansData,
        paymentStatus:state.user.paymentCheckData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginUserAction : (data,func) => {
            dispatch(loginUserAction(data,func));
        },
        paymentStatusAction : (token,func) => {
            dispatch(paymentStatusAction(token,func))
        },
        subscriptionPlanAction: (token) => {
            dispatch(subscriptionPlanAction(token))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);