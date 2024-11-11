var pubKey:any;
const isLiveMode:any = false;
const isTestMode:any = true
if(isLiveMode){
    pubKey='pk_live_51KjlW0LUdZsYaVSpkRqtThwHTQqOD0QcM4uXIcYXPTZXCJsuV083K9cNHxsLDngiiG9THqO1zLfXDDvX3TyKcsQa004lSJiZjQ'
}
if (isTestMode){
    pubKey='pk_test_51PgBMu2KNc0yhsApPxV3pmmqY03mt0zinGbLZEHN7PfZ39MP5cE3N4XG3nmco9wFEtVHzarMSVqRI0MYv9n5guFD00QYJ2MnGV'
}
export { isTestMode,pubKey}