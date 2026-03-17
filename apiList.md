

## Auth apis
POST /signup
POST /login
POST /logout

## Profile apis
GET /profile/view
PATCH /profile/edit
PATCH /profile/forgotpassword

## requests apis
POST /request/send/interested/:toUserId
POST /request/send/ignored/:toUserId
 or 
both the above apis can be combined to 
POST /request/send/:status/:toUserId