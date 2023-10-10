import jwt from "jsonwebtoken";

export default function  extractCookie(req,tokenName) {
  const token = req.headers.authorization || getTokenFromCookies(req,tokenName);

  if (!token) {
    return false;
  }else{
    return token
  }


};

const getTokenFromCookies = (req,tokenName) => {
  let cookieHeaderValue = req.headers.cookie;
  if (cookieHeaderValue) {
    let cookies = cookieHeaderValue.split(";");
    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === tokenName) {
        return cookieValue;
      }
    }
  }
  return null;
};

 