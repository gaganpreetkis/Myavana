import { connect } from 'react-redux';
import Forgot from '../components/Screens/forgot';

const mapStateToProps = (state) => {
    return {
        user:state.user
    }
};

export default connect(mapStateToProps,null)(Forgot);