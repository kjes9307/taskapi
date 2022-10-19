const Proj = require('../model/testUserModel.js')
const userProject = require('../model/projectModel.js')
const Task = require('../model/taskModel.js')
const Kanban = require('../model/kanbanModel.js')
const TodoList = require('../model/todoModel.js')
const TaskComment = require('../model/taskCommentModel.js')
const Taskdetail = require('../model/taskDetailModel.js')
const ImageStore = require("../model/imageModel.js")
const Invite = require("../model/inviteModel.js")
const {appError,responseHandler,cleanObject} = require("../util/tool")

let taskService = {
    projectData: async(req,res,next)=>{
        let name = req.query.name !== undefined ? {"name": new RegExp(req.query.name)} : {}; 
        let id = req.query.personId !== undefined ? {"personId": req.query.personId} : {}; 
        let obj = {...name,...id}
        const data = await Proj.find(obj).sort("_id")
        responseHandler(res,data,200)

    },
    getProjectDetail: async(req,res,next)=>{
        const editId = req.params.id;
        const data = await Proj.find({_id:editId})
        responseHandler(res,data,200)

    },
    testUser:async(req,res,next)=>{
        const data = await userProject.find().sort("id")
        responseHandler(res,data,200)
    },
    addProj:async(req,res,next) =>{
        let addTask = req.body
        if(!addTask){
            return next(appError("404","Name Not Found",next,res));
        }
        const personId = req.user.id;
        let resData = await Proj.create({name:addTask.name,personId})
        responseHandler(res,resData,201);
    },
    editProj : async (req,res,next) =>{
            let edit = req.body;
            let data = await Proj.findByIdAndUpdate(edit._id,{name: edit.name},{ runValidators: true,new: true });
            if(data !== null){
                responseHandler(res,data,200);
            }else{
                return next(appError("404","IdNotFound",next,res));
            }
    }
    ,deleteProj : async (req,res,next) =>{
        let {id} = req.params;
        if(!id){
            return next(appError("404","Id Not Found",next,res));
        }
        let data = await Proj.findByIdAndDelete(id);
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","IdNotFound",next,res));
        }
    },
    editPin : async (req,res,next)=>{
            let edit = req.body;
            let data = await Proj.findByIdAndUpdate(edit._id,{pin: edit.pin},{ runValidators: true,new: true });
            if(data !== null){
                responseHandler(res,data,200);
            }else{
                return next(appError("404","IdNotFound",next,res));
            }
    },
    getKanBan : async (req,res,next) =>{
        let {id} = req.params;
        if(req.query && req.query.taskName){
            Object.keys(req.query).map(x=> req.query[x] = new RegExp(req.query[x]))
        }
        let searchParam = req.query ? {match : req.query}: {};
        let baseConfig = {path:'alltask',select:'taskName type status taskCreator createAt'}
        let config_1 = {...baseConfig,...searchParam}
        let data = await Kanban.find({projectId:id}).populate(config_1).populate({
            path: 'creator',
            select: 'name'
        })
        .sort("createAt")
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","IdNotFound",next,res));
        }
    },
    getKanBanInfo : async (req,res,next) =>{
        let {id} = req.params;
        let baseConfig = {path:'alltask',select:'status'}
        let config_1 = {...baseConfig,}
        let data = await Kanban.find({projectId:id}).populate(config_1).select("allTask kanbanName")
        let counter = {
            idle:0,
            ongoing:0,
            done:0,
            total: 0
        }
        data?.map(x=>{
            if(x.alltask.length !==0){
                x.alltask.map(y=>{
                    counter[y.status]+= 1
                    counter['total'] +=1
                })
            }
        })
        if(data !== null){
            responseHandler(res,[counter],200);
        }else{
            return next(appError("404","IdNotFound",next,res));
        }
    },
    addKanBan : async (req,res,next) =>{
        let addKanban = req.body;
        let creator = req.user._id;
        let newKanban = {...addKanban,creator}
        let data = await Kanban.create(newKanban)
        responseHandler(res,data,200);

    },
    deleteKanBan : async (req,res,next) =>{
        let {id} = req.params;
        console.log(id)
        let data = await Kanban.findByIdAndDelete(id)
        responseHandler(res,data,200);

    },
    editKanBan : async (req,res,next) =>{
        let newTaskInfo = req.body;
        let creator = req.user._id;
        let newTask = {...newTaskInfo,creator}
        let data = await Kanban.findByIdAndUpdate(newTask)
        responseHandler(res,data,200);

    },
    addTask : async (req,res,next) =>{
        let {kanbanId,projectId,taskName} = req.body;
        let addTask ={
            status: "idle",
            taskName,
            projectId,
            taskCreator: req.user._id
        }
        let data = await Task.create({...addTask})

        await Kanban.findOneAndUpdate(
            { _id:kanbanId},
            { $addToSet: { alltask: data._id } },
            { runValidators: true,new: true }
        )
        responseHandler(res,data,200);

    },
    deleteTask : async (req,res,next) =>{
        let {id} = req.params;
        let {kanbanId} = req.body;
        let data = await Task.findByIdAndDelete(id)

        let rest = await Kanban.findOneAndUpdate(
            { _id:kanbanId},
            { $pull: { alltask: id } }
            ,{ runValidators: true,new: true })
        responseHandler(res,data,200);
    },
    editTask : async (req,res,next) =>{
        let {taskId,taskName,status,type} = req.body;
        let editTask ={
            status,
            type,
            taskName,
        }
        let data = await Task.findByIdAndUpdate({_id:taskId},{...cleanObject(editTask)},{ runValidators: true,new: true })
        responseHandler(res,data,200);
    },
    getTask : async (req,res,next) =>{
        let {id} = req.params;
        let data = await Task.findById({_id:id}).populate({
            path: 'taskTodoList',
            select: 'name done tab'
        })
        .populate({
            path:"comments",
            select:"id user -task comment"
        })
        responseHandler(res,data,200);

    },
    editStatus : async (req,res,next) =>{
        let {id,newStatus} = req.body;
        let data = await Task.findByIdAndUpdate({_id:id},{status: newStatus},{ runValidators: true,new: true });
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","IdNotFound",next,res));
        }
    },
    addList: async (req,res,next) =>{
        let {id} = req.params;
        let addList = req.body
        let data = await TodoList.create({...addList})

        await Task.findOneAndUpdate(
            { _id:id},
            { $addToSet: { taskTodoList: data._id } },
            { runValidators: true,new: true }
        )
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user adds item",next,res));
        }
    },
    editList: async (req,res,next) =>{
        let {_id,name,done} = req.body;
        let editList = {_id,name,done}
        let data = await TodoList.findByIdAndUpdate({_id},{...editList},{ runValidators: true,new: true })

        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user edits item",next,res));
        }
    },
    delList: async (req,res,next) =>{
        let {_id,taskId} = req.body;
        let data = await TodoList.findByIdAndDelete({_id})

        await Task.findOneAndUpdate(
            { _id:taskId},
            { $pull: { taskTodoList: _id } },
            { runValidators: true,new: true }
        )
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user delete item",next,res));
        }
    },
    editComment: async (req,res,next) =>{
        let {postid,comment} = req.body
       
        let editComment = {
            comment
        }
        let data = await TaskComment.findByIdAndUpdate({_id:postid},{...editComment},{ runValidators: true,new: true })
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user edit comment",next,res));
        }
    },
    addComment: async (req,res,next) =>{
        let user = req.user._id
        let {task,comment} = req.body
       
        let addComment = {
            comment,
            user,
            task
        }
        let data = await TaskComment.create({...addComment})
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user edit comment",next,res));
        }
    },
    deleteComment: async (req,res,next) =>{
        let {postid} = req.body
       
        let data = await TaskComment.findByIdAndDelete({_id:postid})
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user edit comment",next,res));
        }
    },
    getTaskMember: async (req,res,next) =>{
        let {id} = req.params;
        let data = await Taskdetail.find({projectId:id}).populate({
            path:"member",
            select:"_id name photo"
        })
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when get team member",next,res));
        }
    },
    addTaskMember: async (req,res,next) =>{
        let {projectId,userId} = req.body
        let memberId = userId

        // 被追蹤 表示+1
        let data;
        let isCreated = await Taskdetail.find({projectId});
        if(isCreated.length ===0){
        data = await Taskdetail.create({
            projectId,
            member: [memberId]
        })
        }else{
        data = await Taskdetail.findOneAndUpdate(
            { projectId},
            { $addToSet: { member: memberId } },
            { runValidators: true,new: true }
        )
        }
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when get team member",next,res));
        }
    },
    delTaskMember: async (req,res,next) =>{
        let {projectId,userId} = req.body
        let data = await Taskdetail.findOneAndUpdate(
            { projectId},
            { $pull: { member: userId } },
            { runValidators: true,new: true }
        )
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when get team member",next,res));
        }
    },
    addPhoto: async (req,res,next) =>{
        let {projectId,img_url} = req.body
        console.log(req.body)
        if(!img_url) return next(appError("404","image_url missing",next,res));
        // 被追蹤 表示+1
        let data;
        let isCreated = await ImageStore.find({projectId});
        if(isCreated.length ===0){
            data = await ImageStore.create({
                projectId,
                images:[img_url]
            })
        }else{
            data = await ImageStore.findOneAndUpdate(
                { projectId},
                { $addToSet: { images: img_url } },
                { runValidators: true,new: true }
            )
        }
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when add image_url",next,res));
        }
    },
    getTaskPhoto: async (req,res,next) =>{
        let {id} = req.params;
        let data = await ImageStore.find({projectId:id})
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when get task photo",next,res));
        }
    },
    delPhoto: async (req,res,next) =>{
        let {projectId,img_url} = req.body
        if(!img_url) return next(appError("404","image_url missing",next,res));

        let data = await ImageStore.findOneAndUpdate(
            { projectId},
            { $pull: { images: img_url } },
            { runValidators: true,new: true }
        )
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when get team member",next,res));
        }
    },
    addInvite: async (req,res,next) =>{
        let {projectId,userId,state} = req.body
        let sender = req.user._id
        if(!projectId) return next(appError("404","missing projectid",next,res));
        if(!userId) return next(appError("404","missing userId",next,res));
        let data = await Invite.create({projectId,receiver:userId,status:state,sender})
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user create invitation",next,res));
        }
    },
    getSendingInvite: async (req,res,next) =>{
        let id = req.user._id
        let data = await Invite.find({sender:id}).populate({  
            path: 'receiver',
            select: '_id name photo'
        }).populate({
            path: 'projectId',
            select: 'name'
        })
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user get invitation",next,res));
        }
    },
    eddInvite: async (req,res,next) =>{
        let {inviteId,state} = req.body
        if(!inviteId) return next(appError("404","missing inviteId",next,res));
        if(!state) return next(appError("404","missing state",next,res));
        let data = await Invite.findByIdAndUpdate(inviteId,{status: state},{ runValidators: true,new: true })
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user create invitation",next,res));
        }
    },
    getReceivedInvites: async (req,res,next) =>{
        let id = req.user._id
        let data = await Invite.find({receiver:id}).populate({  
            path: 'sender',
            select: '_id name photo'
        }).populate({
            path: 'projectId',
            select: 'name'
        })
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user get invitation",next,res));
        }
    },
    getProject: async (req,res,next) =>{
        let id = req.user._id
        let data = await Proj.find({personId:id})
        if(data !== null){
            responseHandler(res,data,200);
        }else{
            return next(appError("404","error occurs when user get invitation",next,res));
        }
    },
    taskReorder: async (req,res,next) =>{
        let {fromKanbanId,toKanbanId,content,position} = req.body
        let result = await Kanban.findOneAndUpdate(
            { _id : fromKanbanId},
            { $pull: { alltask: content } },
            { runValidators: true,new: true }
        )
        let data = await Kanban.findOneAndUpdate(
            { _id : toKanbanId},
            { $push: { arr:{$each: [content], $position: position}  } },
            { runValidators: true,new: true }
        )
        responseHandler(res,data,200);
    }
}

module.exports =  taskService