export default function generateOtp(){
    return Math.floor(Math.random() * 9000) + 1000
}