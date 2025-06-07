# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId 
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received => interested
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform (where you dont show already connected, rejected  accepted or ignored and also his own card)


Status: ignored, interested, accepeted, rejected