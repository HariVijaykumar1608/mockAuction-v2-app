import axios from "axios";
axios.defaults.withCredentials = true;

const RouteCall = {
  signIn: async (userName, gmailId, password) => {
    const response = await axios.post("http://localhost:3000/signIn", {
      userName,
      gmailId,
      password,
    });
    return response.data;
  },

  logIn: async (gmailId, password) => {
    const response = await axios.post("http://localhost:3000/login", {
      gmailId,
      password,
    });
    return response.data;
  },

  checkLogIn: async () =>{
    const response = await axios.get("http://localhost:3000/check-login",{
      withCredentials : true
    })
    return response.data
  }
};

export default RouteCall;

