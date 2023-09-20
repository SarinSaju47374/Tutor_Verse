export default function cookieExtractor(req){
    let cookieHeaderValue = req.headers.cookie;
    let token = null;
    console.log(cookieHeaderValue)
    if (cookieHeaderValue) {
        let cookies = cookieHeaderValue.split(";");

        for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.trim().split("=");

        if (cookieName === "tokenA") {
            token = cookieValue;
            break;
        }
        }
    }
    return token
}