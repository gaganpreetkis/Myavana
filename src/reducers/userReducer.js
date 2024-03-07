import { LOGIN, HAIR_OUTPUT, HAIR_PRODUCTS, REGISTER_USER, CONFIRM_CODE, LOGIN_USER, PAYMENT_STATUS, SUBSCRIPTION_PLAN, PAYMENT, LOGOUT_TYPE, CREATE_TICKET, GET_TICKET_LISTING, GET_SINGLE_TICKET_LISTING, PLAN_NAME } from '../actions/actionTypes';


const initialState = {
    loginData: {},
    hairData: {},
    products: [],
    registerData: {},
    confirmCodeData: null,
    loginUserData: {},
    paymentCheckData: false,
    plansData: [],
    checkoutResponse: '',
    confirmedTicket: 'false',
    ticketListing: [],
    singleTicketList: [],
    subscriptionPlan: ''
};

export default user = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                loginData: action.payload
            }
        }
        case HAIR_OUTPUT:
            return {
                ...state,
                hairData: action.payload
            }
        case HAIR_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        case REGISTER_USER:
            return {
                ...state,
                registerData: action.payload
            }
        case CONFIRM_CODE:
            return {
                ...state,
                confirmCodeData: action.payload
            }
        case LOGIN_USER:
            return {
                ...state,
                loginUserData: action.payload
            }
        case PAYMENT_STATUS:
            return {
                ...state,
                paymentCheckData: action.payload
            }
        case SUBSCRIPTION_PLAN:
            return {
                ...state,
                plansData: action.payload
            }
        case PAYMENT:
            return {
                ...state,
                checkoutResponse: action.payload
            }
        case LOGOUT_TYPE:
            return {
                loginData: {},
                hairData: {},
                products: [],
                registerData: {},
                confirmCodeData: null,
                loginUserData: {},
                paymentCheckData: false,
                plansData: [],
                ticketListing: [],
                singleTicketList: [],
                checkoutResponse: ''
            }
        case CREATE_TICKET:
            return {
                ...state,
                confirmedTicket: action.payload
            }
        case GET_TICKET_LISTING:
            return {
                ...state,
                ticketListing: action.payload
            }
        case GET_SINGLE_TICKET_LISTING:
            return {
                ...state,
                singleTicketList: action.payload
            }
        case PLAN_NAME:
            return {
                ...state,
                subscriptionPlan: action.payload
            }
        default:
            return state
    }
}