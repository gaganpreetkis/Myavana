import {
  LOGIN,
  HAIR_OUTPUT,
  HAIR_PRODUCTS,
  REGISTER_USER,
  CONFIRM_CODE,
  LOGIN_USER,
  PAYMENT_STATUS,
  SUBSCRIPTION_PLAN,
  PAYMENT,
  LOGOUT_TYPE,
  CREATE_TICKET,
  GET_TICKET_LISTING,
  GET_SINGLE_TICKET_LISTING,
  PLAN_NAME,
} from "./actionTypes";
import { baseUrlLive, baseUrlStaging } from "../constants/url";
import { Alert } from "react-native";

export const login = (user) => {
  return {
    type: LOGIN,
    payload: user,
  };
};

/**
 * Phase 2 Login Action
 *
 */
export const loginUser = (data) => {
  return {
    type: LOGIN_USER,
    payload: data,
  };
};

export const register = (data) => {
  return {
    type: REGISTER_USER,
    payload: data,
  };
};
export const confirmCode = (userData) => {
  return {
    type: CONFIRM_CODE,
    payload: userData,
  };
};

/**
 * payemt status checker
 *
 */

export const paymentStatus = (data) => {
  return {
    type: PAYMENT_STATUS,
    payload: data,
  };
};

/**
 *
 * Credit payment action
 */

export const creditPayment = (data) => {
  return {
    type: PAYMENT,
    payload: data,
  };
};

export const hairOutput = (data) => {
  return {
    type: HAIR_OUTPUT,
    payload: data,
  };
};

export const hairProducts = (data) => {
  return {
    type: HAIR_PRODUCTS,
    payload: data,
  };
};

export const confirmCodeAction = (data, callback) => (dispatch, getState) => {
  let statusCode;
  fetch(`${baseUrlLive}Account/activateuser`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((responseJson) => {
      if (statusCode === 200) {
        dispatch(confirmCode(true));
        dispatch(loginUser(responseJson.value));
        callback();
      } else if (statusCode === 400) {
        dispatch(confirmCode(false));
        callback();
      } else if (statusCode === 401) {
        dispatch(loginUser({}));
      }
    })
    .catch((err) => {
      dispatch({
        type: CONFIRM_CODE,
        payload: false,
      });
      callback();
    });
};

export const loginUserAction = (data, callback) => (dispatch) => {
  let statusCode;
  fetch(`${baseUrlLive}Account/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((responseJson) => {
      console.log("loginUserAction: " + JSON.stringify(responseJson));
      if (statusCode === 200) {
        dispatch(loginUser(responseJson.value));
        callback();
      } else if (statusCode === 400) {
        dispatch(loginUser(responseJson.value));
        callback();
      } else if (statusCode === 401) {
        dispatch(loginUser({}));
        callback();
      }
    })
    .catch((err) => {
      dispatch(
        loginUser({
          loginFail: "loginFail",
        })
      );
      callback();
    });
};

/**
 *
 * payment status check Action
 */

export const paymentStatusAction = (token, callback) => (dispatch) => {
  fetch(`${baseUrlLive}Payments/GetPaymentStatus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      // Alert.alert("PaymentStatus: " + JSON.stringify(responseJson));
      console.log("PaymentStatus: " + JSON.stringify(responseJson));
      if (responseJson.statusCode === 200) {
        // true means user has done its payment
        dispatch(paymentStatus(responseJson.value));
        callback();
      } else if (responseJson.statusCode === 400) {
        dispatch(paymentStatus(responseJson.value));
        callback();
      } else if (responseJson.statusCode === 401) {
        dispatch(loginUser({}));
        dispatch(paymentStatus(null));
        callback();
      }
    })
    .catch((err) => {
      dispatch(loginUser({}));
      dispatch(paymentStatus(null));
      callback();
    });
};

/**
 *
 * Subscription Plan Action
 *
 */
export const subscriptionPlan = (plans) => {
  return {
    type: SUBSCRIPTION_PLAN,
    payload: plans,
  };
};

export const subscriptionPlanAction = (token) => (dispatch) => {
  fetch(`${baseUrlLive}Subscription/GetSubscriptions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      if (responseJson.statusCode === 200) {
        dispatch(subscriptionPlan(responseJson.value));
      } else if (responseJson.statusCode === 401) {
        dispatch(loginUser({}));
      }
    })
    .catch((err) => {
      console.log(err, "subscription Plan error");
      dispatch(subscriptionPlan([]));
    });
};

/****
 * credit card payment Action function
 *
 *
 */

export const cardPaymentAction = (data, callback) => (dispatch) => {
  fetch(`${baseUrlLive}Payments/Checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      if (responseJson.statusCode === 200) {
        dispatch(creditPayment("true"));
        callback();
      } else if (responseJson.statusCode === 400) {
        dispatch(creditPayment(responseJson.value));
        callback();
      } else if (responseJson.statusCode === 401) {
        dispatch(creditPayment(""));
        dispatch(loginUser({}));
        callback();
      }
    })
    .catch((err) => {
      callback();
    });
};

export const logoutAction = () => {
  return {
    type: LOGOUT_TYPE,
  };
};

export const createTicket = (data) => {
  return {
    type: CREATE_TICKET,
    payload: data,
  };
};

export const createTicketAction = (data, callback) => (dispatch) => {
  fetch(`${baseUrlLive}Ticket/CreateTicket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      console.log("CreateTicket is:-", responseJson);
      if (responseJson.statusCode === 200) {
        dispatch(createTicket("true"));
        callback();
      } else if (responseJson.statusCode === 400) {
        dispatch(createTicket("false"));
        callback();
      } else if (responseJson.statusCode === 401) {
        dispatch(createTicket("false"));
        dispatch(loginUser({}));
        callback();
      }
    })
    .catch((err) => {
      console.log(err, "ticket err");
      callback();
    });
};

export const getTicketList = (data) => {
  return {
    type: GET_TICKET_LISTING,
    payload: data,
  };
};

export const getSingleTicketListing = (data) => {
  return {
    type: GET_SINGLE_TICKET_LISTING,
    payload: data,
  };
};

export const getTicketAction = (data, callback) => (dispatch) => {
  console.log("Get Tickets called");
  fetch(`${baseUrlLive}Ticket/getuserticket`, {
    method: "GET",
    headers: {
      Authorization: data.token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      console.log("Get Tickets called");
      if (responseJson.statusCode === 200) {
        // console.log(responseJson.value.tickets.reverse()[0], '>>>>>>>>>>')
        if (responseJson && responseJson.value && responseJson.value.tickets) {
          dispatch(getTicketList(responseJson.value.tickets.reverse()[0]));
          let id = responseJson.value.tickets.reverse()[0].id;
          // getSingleTicketActionById(data,id)
          fetch(
            `${baseUrlLive}Ticket/getsingleticket?ticketId=${
              responseJson.value.tickets.reverse()[0].id
            }`,
            {
              method: "GET",
              headers: {
                Authorization: data.token,
              },
            }
          )
            .then((responses) => {
              return responses.json();
            })
            .then((responseJsons) => {
              if (responseJsons.statusCode === 200) {
                console.log(responseJsons.value.Comments, "responseJsons");
                if (
                  responseJsons &&
                  responseJsons.value &&
                  responseJsons.value.Comments &&
                  responseJsons.value.Comments.length > 0
                ) {
                  dispatch(
                    getSingleTicketListing(responseJsons.value.Comments)
                  );
                }
              } else if (responseJsons.statusCode === 400) {
                dispatch(getSingleTicketListing([]));
              } else if (responseJsons.statusCode === 401) {
                dispatch(getSingleTicketListing([]));
                dispatch(loginUser({}));
              }
            })
            .catch((error) => {
              console.log(error.message, "final error");
            });
          callback();
        }
      } else if (responseJson.statusCode === 400) {
        dispatch(getTicketList([]));
        dispatch(getSingleTicketListing([]));
        callback();
      } else if (responseJson.statusCode === 401) {
        dispatch(getTicketList([]));
        dispatch(getSingleTicketListing([]));
        dispatch(loginUser({}));
        callback();
      }
    })
    .catch((err) => {
      console.log(err.message, "get listing error");
      dispatch(getTicketList([]));
      dispatch(getSingleTicketListing([]));
      callback();
    });
};

export const planName = (data) => {
  return {
    type: PLAN_NAME,
    payload: data,
  };
};
export const getSubscription = (token) => (dispatch) => {
  fetch(`${baseUrlLive}Subscription/GetMySubscription`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      // Alert.alert("Result",JSON.stringify(res));
      if (res.value) {
        dispatch(planName(res.value.planName));
      }
      return res;
    })
    .catch((err) => {
      dispatch(planName(""));
    });
};
