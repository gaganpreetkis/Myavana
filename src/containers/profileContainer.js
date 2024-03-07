import { connect } from 'react-redux';
import Profile from '../components/Screens/profile';
import { logoutAction} from "../actions/userAction";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
    return {
        user: state.user.loginUserData,
        subscriptionPlan: state.user.subscriptionPlan
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutAction: bindActionCreators(logoutAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);