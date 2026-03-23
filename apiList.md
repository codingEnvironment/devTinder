

## Auth apis
POST /signup
POST /login
POST /logout

## Profile apis
GET /profile/view
PATCH /profile/edit
PATCH /profile/forgotpassword

## connection requests apis
POST /request/send/interested/:toUserId
POST /request/send/ignored/:toUserId
 or 
both the above apis can be combined to 
POST /request/send/:status/:toUserId
POST /request/review/:status/:requestId

## User apis
GET /user/requests/received
GET /user/connections
GET /user/feed - Gets you the profiles of other users on platform
Status: ignored, interested, accepeted, rejected