import messageModel from "../model/messageModel.js";
import mongoose from "mongoose"
/**
 * @route   post /api/add-messageS or /api/add-messageT 
 * @desc    loads the chat rooms associated to specific students
 * @access  Private
 */
export async function AddMessage(req,res){
    let {id} = req.payload;
    let {roomId,message} = req.body
    try{
        await messageModel.create({
            chatId:roomId,
            message:message,
            sender:id,
            readBy:[id]
        })
        res.status(200).send({success:true})
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

/**
 * @route   post /api/load-messagesS or /api/load-messagesT 
 * @desc    loads the messages
 * @access  Private
 */
export async function loadMessages(req,res){
    let {roomId} = req.query
    try{
        let messages = await messageModel.find({chatId:roomId})
        let modMessages = messages.map(elem=> (
            {
                message:elem.message,
                senderId:elem.sender
            }
        ))
        if(messages.length<1) return res.status(200).send({empty:true})
        return res.status(200).send({empty:false,messages:modMessages})
    }catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

/**
 * @route   post /api/readS or /api/readT 
 * @desc    readMssg
 * @access  Private
 */
export async function readMessage(req, res) {
    let { id } = req.payload;
    let { roomId } = req.body;
    try {
        let messages = await messageModel.find({ chatId: roomId });
        console.log(messages);
        for (let elem of messages) {
            if (!elem.readBy.includes(id)) {
                elem.readBy.push(id);
                await elem.save(); // Save each document
            }
        }
        res.status(200).send({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


/**
 * @route   post /api/checkMessage  
 * @desc    readMssg
 * @access  Private
 */
export async function checkReads(req,res){
    let {id} = req.payload
    let {roomId} = req.body
    try{
        let messages = await messageModel.find({chatId:roomId})
        messages.map(elem=>{
            if(!elem.readBy.includes(id)){
                elem.readBy,push(id);
            }
        })
        await messages.save()
        res.status(200).send({success:true})
    }catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

/**
 * @route   get /api/view-unread-messages  
 * @desc    checks out the messages that are unread
 * @access  Private
 */
export async function viewUnReadMessages(req,res){
    const {id} = req.query
    try {
        const data = [];
        const chatIds = await messageModel.find({readBy:{$nin:new mongoose.Types.ObjectId(id)}}).select('chatId');
        chatIds.map(ele=>data.push(ele.chatId))
        const uniqueArray = Array.from(new Set(data.map(id => id.toString()))).map(id => new mongoose.Types.ObjectId(id));
      } catch (error) {
        console.error('Error finding chat rooms:', error);
        throw error;
      }
}


