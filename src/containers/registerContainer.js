import { connect } from 'react-redux';
import Register from '../components/Screens/register';
import { register } from "../actions/userAction";

const mapStateToProps = (state) => {
    return {
        registerData:state.user.registerData,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        register : (data) => {
            dispatch(register(data));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Register);