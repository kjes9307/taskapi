const express = require('express');
const userService = require('../controller/userMethod')
const upload = require('../util/upload');
const {asyncErrorHandler} = require('../util/tool');
const isAuth = require("../util/auth")
const router = express.Router();

router.post('/register', asyncErrorHandler(userService.register))

router.post('/login', asyncErrorHandler(userService.login))

router.post('/reset', isAuth, asyncErrorHandler(userService.resetPassWord))

router.get('/profile', isAuth, asyncErrorHandler(userService.getProfile))

router.patch('/updateUser', isAuth, asyncErrorHandler(userService.updateProfile))
    
router.post('/uploadImg',isAuth,upload,asyncErrorHandler(userService.uploadImg))

router.get('/getLikeList',isAuth,asyncErrorHandler(userService.getLikeList))

router.get('/getUserPost',isAuth,asyncErrorHandler(userService.getUserPost))

router.post('/addTrack',isAuth,asyncErrorHandler(userService.addTrack))

router.post('/cancelTrack',isAuth,asyncErrorHandler(userService.cancelTrack))

router.get('/getTrackList',isAuth,asyncErrorHandler(userService.getTrackList))

router.post('/Follow',isAuth,asyncErrorHandler(userService.addFollwer))

router.post('/unFollow',isAuth,asyncErrorHandler(userService.minusFollower))

router.get('/getFollow',isAuth,asyncErrorHandler(userService.getFollower))

router.post('/checkToken',asyncErrorHandler(userService.checkToken))

router.get('/getUser',asyncErrorHandler(userService.getUserAll))


module.exports = router
