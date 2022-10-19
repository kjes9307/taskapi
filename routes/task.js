const express = require('express');
const {asyncErrorHandler} = require('../util/tool');
const isAuth = require("../util/auth")
const router = express.Router();
const taskAPI = require('../controller/taskMethod')

router.get('/project',isAuth, asyncErrorHandler(taskAPI.projectData))
router.get('/project/:id',isAuth, asyncErrorHandler(taskAPI.getProjectDetail))
router.get('/users',isAuth, asyncErrorHandler(taskAPI.testUser))

router.post('/addProject',isAuth,asyncErrorHandler(taskAPI.addProj))
router.patch('/editProject/:id',isAuth,asyncErrorHandler(taskAPI.editProj))
router.delete('/deleteProject/:id',isAuth,asyncErrorHandler(taskAPI.deleteProj))
router.patch('/editPin/:id',asyncErrorHandler(taskAPI.editPin))

router.get('/getKanBan/:id/Event',isAuth,asyncErrorHandler(taskAPI.getKanBan))
router.get('/getKanBanSingle/:id',isAuth,asyncErrorHandler(taskAPI.getKanBanInfo))
router.put('/statusSwitch',isAuth,asyncErrorHandler(taskAPI.editStatus))
router.post('/addKanBan',isAuth,asyncErrorHandler(taskAPI.addKanBan))
router.delete('/deleteKanBan/:id',isAuth,asyncErrorHandler(taskAPI.deleteKanBan))

router.post('/addTask',isAuth,asyncErrorHandler(taskAPI.addTask))
router.patch('/editTask',isAuth,asyncErrorHandler(taskAPI.editTask))
router.delete('/deleteTask/:id',isAuth,asyncErrorHandler(taskAPI.deleteTask))
router.get('/getTask/:id',isAuth,asyncErrorHandler(taskAPI.getTask))

router.post('/addTodo/:id',isAuth,asyncErrorHandler(taskAPI.addList))
router.patch('/editTodo',isAuth,asyncErrorHandler(taskAPI.editList))
router.delete('/deleteTodo',isAuth,asyncErrorHandler(taskAPI.delList))

router.patch('/editComment',isAuth,asyncErrorHandler(taskAPI.editComment))
router.post('/addComment',isAuth,asyncErrorHandler(taskAPI.addComment))
router.delete('/deleteComment',isAuth,asyncErrorHandler(taskAPI.deleteComment))

router.post('/addMember',isAuth,asyncErrorHandler(taskAPI.addTaskMember))
router.get('/getMember/:id',isAuth,asyncErrorHandler(taskAPI.getTaskMember))
router.delete('/delMember',isAuth,asyncErrorHandler(taskAPI.delTaskMember))

router.post('/addPhoto',isAuth,asyncErrorHandler(taskAPI.addPhoto))
router.get('/getPhoto/:id',isAuth,asyncErrorHandler(taskAPI.getTaskPhoto))
router.delete('/delPhoto',isAuth,asyncErrorHandler(taskAPI.delPhoto))

router.post('/addInvite',isAuth,asyncErrorHandler(taskAPI.addInvite))
router.get('/getSendingInvite',isAuth,asyncErrorHandler(taskAPI.getSendingInvite))
router.get('/getReceivedInvites',isAuth,asyncErrorHandler(taskAPI.getReceivedInvites))
router.get('/getProject',isAuth,asyncErrorHandler(taskAPI.getProject))
router.post('/editInvite',isAuth,asyncErrorHandler(taskAPI.eddInvite))

router.post('/reorder',isAuth,asyncErrorHandler(taskAPI.taskReorder))
module.exports = router;