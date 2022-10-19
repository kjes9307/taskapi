const express = require('express');
const router = express.Router();
const {asyncErrorHandler, appError} = require('../util/tool.js')
const isAuth = require("../util/auth")
const postAPI= require("../controller/postMethod.js")

/* GET home page. */
router.get('/',isAuth,asyncErrorHandler(postAPI.findPost
    /**
     * #swagger.tags=['Post'] 
     * #swagger.description = '取得貼文'
     * #swagger.security = [{
        'apiAuth' : [] 
       }]
     * #swagger.parameters['body'] = {
     
       }
     * #swagger.responses[200] = {
            description : 'some api info',
            schema: {
                'status' : true,
                'data': [
                    {
                        '_id': '628dbcf49adbd24a2c962de1',
                        'name': '大帥哥中的大帥哥',
                        'user': {
                            '_id': '6283a064261ad96649ea9d05',
                            'name': '大帥哥中的大帥哥',
                            'photo': 'https://i.imgur.com/JhstGJB.png'
                        },
                        'tags': '["心情"]',
                        'type': 'group',
                        'image': 'https://i.imgur.com/q3NHdNn.jpg',
                        'content': 'test',
                        'likes': 0,
                        'comments': 0,
                        'createAt': '2022-05-25T05:21:56.851Z'
                    }
                ]
            }
        }
     */
));

router.get('/singlePost',isAuth,asyncErrorHandler(postAPI.findSinglePost));

router.post('/',isAuth,asyncErrorHandler(postAPI.createPost
    /**
     * #swagger.tags=['Post'] 
     * #swagger.description = '新增貼文'
     * #swagger.security = [{
        'apiAuth' : [] 
       }]
     * #swagger.parameters['body'] = {
            in : 'body',
            type: 'object',
            required : true,
            description: '格式',
            schema : {
            '$content': '你的小老虎上限拉',
            '$tags' : '心情',
            '$type' : 'group'
            }
       }
     * #swagger.responses[200] = {
            description : 'add',
            schema: {
                'status' : true,
                'data': [
                    {
                        '_id': '628dbcf49adbd24a2c962de1',
                        'name': '大帥哥中的大帥哥',
                        'user': {
                            '_id': '6283a064261ad96649ea9d05',
                            'name': '大帥哥中的大帥哥',
                            'photo': 'https://i.imgur.com/JhstGJB.png'
                        },
                        'tags': '["心情"]',
                        'type': 'group',
                        'image': 'https://i.imgur.com/q3NHdNn.jpg',
                        'content': 'test',
                        'likes': 0,
                        'comments': 0,
                        'createAt': '2022-05-25T05:21:56.851Z'
                    }
                ]
            }
        }
     */
));

router.delete('/:id',asyncErrorHandler(postAPI.deleteByID));

router.delete('/',asyncErrorHandler(postAPI.deleteAll));

router.patch('/:id',asyncErrorHandler(postAPI.editPost));

router.post('/addlike/:id',isAuth,asyncErrorHandler(postAPI.addLike))

router.post('/deletelike/:id',isAuth,asyncErrorHandler(postAPI.deleteLike))

router.post('/comment/:id',isAuth,asyncErrorHandler(postAPI.postComment))

router.get('/getComment/:id',isAuth,asyncErrorHandler(postAPI.getUserComment));

router.delete('/delcomment/:id',isAuth,asyncErrorHandler(postAPI.deleteComment))
module.exports = router;
