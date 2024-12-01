import Navbar from '@/components/Navbar';

import axiosInstance from '@/utils/axiosConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';
import { RxAvatar } from 'react-icons/rx';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const Question = () => {
  let params = useParams()
  const questionId = params.id;

  const [comments,setComments] = useState([]);
  const [question,setQuestion] = useState({
    "_id": "",
    "question": "",
    "likes": 0,
    "dislikes": 0,
    "likesList": [],
    "dislikesList": [],
    "comments": 0,
    "status": "Pending",
    "tags": [],
    "createdAt": "",
    "userId": {
      "userId": "",
      "avatar": "",
      "fullName": "",
      "userName": ""
    }
  });

  const [commentEdit,setCommentEdit]=useState("");

  useEffect(()=>{
    if(questionId){
      axiosInstance.get('question/getById',{params:{id:questionId}}).then((res)=>{
        if(res.data.statusCode>399){
          toast.error(res.data.message)
          console.log(res);
        }
        else{
          setQuestion(res.data.data)
        }
        
      }).catch((err)=>{
        console.log(err);
        toast.error("An error occurred while getting question")
      })
    }
  },[])

  useEffect(()=>{
    if(questionId){
      axiosInstance.get('comment/get',{params:{questionId:questionId}}).then((res)=>{
        if(res.data.statusCode>399){
          toast.error(res.data.message)
          console.log(res);
        }
        else{
          setComments(res.data.data)
          
        }
        
      }).catch((err)=>{
        console.log(err);
        toast.error("An error occurred while getting comments")
      })
    }
  },[])


  const handleDislike = async (questionId,userId) => {
    setQuestion((prevQuestion) => {
      // Clone the previous state to ensure immutability
      const updatedQuestion = { ...prevQuestion };
  
      // Check if the user has already disliked
      if (!updatedQuestion.dislikesList.includes(userId)) {
        updatedQuestion.dislikesList = [...updatedQuestion.dislikesList, userId];
        updatedQuestion.dislikes += 1;
      }
  
      // If the user has liked before, remove them from likesList and decrement likes
      if (updatedQuestion.likesList.includes(userId)) {
        updatedQuestion.likesList = updatedQuestion.likesList.filter((id) => id !== userId);
        updatedQuestion.likes -= 1;
      }
  
      return updatedQuestion; // Return the updated question
    });
  
    try {
      await axiosInstance.post('like/dislikeQuestion', { questionId: question._id });
    } catch (err) {
      console.log(err);
      toast.error('Error Disliking the question');
    }
  };
  
  const handleLike = async (questionId,userId) => {
    setQuestion((prevQuestion) => {
      // Clone the previous state to ensure immutability
      const updatedQuestion = { ...prevQuestion };
  
      // Check if the user has already liked
      if (!updatedQuestion.likesList.includes(userId)) {
        updatedQuestion.likesList = [...updatedQuestion.likesList, userId];
        updatedQuestion.likes += 1;
      }
  
      // If the user has disliked before, remove them from dislikesList and decrement dislikes
      if (updatedQuestion.dislikesList.includes(userId)) {
        updatedQuestion.dislikesList = updatedQuestion.dislikesList.filter((id) => id !== userId);
        updatedQuestion.dislikes -= 1;
      }
  
      return updatedQuestion; // Return the updated question
    });
  
    try {
      await axiosInstance.post('like/likeQuestion', { questionId: question._id });
    } catch (err) {
      console.log(err);
      toast.error('Error Liking the question');
    }
  };


  const handleCommentSubmit = async () =>{
    if(!commentEdit) {
        toast.error("Comment is empty !!")
    }
    else{
        await axiosInstance.post('comment/create',{questionId, comment:commentEdit}).then((res)=>{
            if(res.data.statusCode<400){
                toast.success("Comment added successfully")
                console.log(res.data.data)
                setComments((prev)=>[...prev,res.data.data])
            }
            else{
                toast.error(res.data.data.message)
            }
        }).catch((error)=>{
            toast.error("Error occurred while adding comment");
            console.log(error)
        })
    }
  }

  return (
    <div>
      <Navbar/>
 <div
  key={question._id}
  className="bg-white p-4 mt-4 w-4/5 max-md:w-full mx-auto rounded-lg shadow-sm flex flex-col space-y-2 mb-4"
>
  {/* Question Header */}
  <div className="flex items-center space-x-4">
    {question.userId.avatar ? (
      <img
        src={question.userId.avatar}
        alt={question.userId.fullName}
        className="w-10 h-10 rounded-full mr-3"
      />
    ) : (
      <RxAvatar
        color="#81f82c"
        className="w-10 h-10 rounded-full border-4 border-gray-200 mb-4"
      />
    )}
    <div className='w-full'>
      <h2 className="font-semibold text-left w-4/5 text-wrap text-gray-800">
        {question.userId.fullName}
      </h2>
      <p className="text-sm text-left text-wrap w-4/5 overflow-clip text-gray-500">
        {question.userId.userName}
      </p>
    </div>
  </div>

  {/* Question Content */}
  <div className="text-gray-800 text-wrap">
    <p>{question.question}</p>
  </div>

  {/* Tags */}
  <div className="flex space-x-2 flex-wrap text-sm text-blue-500">
    {question.tags.map((tag, index) => (
      <span key={index} className="bg-gray-100 px-2 py-1 rounded-full">
        #{tag}
      </span>
    ))}
  </div>

  {/* Question Footer */}
  <div className="flex justify-between flex-wrap max-md:justify-evenly gap-2 gap-x-3 text-gray-500 text-sm mt-2">
    <div
      onClick={(e) => handleLike(question._id, question.userId.userId)}
      className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
    >
      <span className="flex flex-row items-center gap-2 my-auto justify-center mx-auto align-middle">
        {question.likesList.includes(question.userId.userId) ? (
          <AiFillLike color="#bcea9b" size={25} />
        ) : (
          <AiOutlineLike size={25} />
        )}{" "}
        {question.likes}
      </span>
      <span>Like</span>
    </div>
    <div
      onClick={(e) => handleDislike(question._id, question.userId.userId)}
      className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
    >
      <span className="flex flex-row items-center gap-2 my-auto justify-center mx-auto align-middle">
        {question.dislikesList.includes(question.userId.userId) ? (
          <AiFillDislike color="#bcea9b" size={25} />
        ) : (
          <AiOutlineDislike size={25} />
        )}{" "}
        {question.dislikes}
      </span>
      <span>Dislike</span>
    </div>
    <div className="flex items-center justify-center">
      {/* Dialog Trigger */}
      <Dialog>
  <DialogTrigger><div className='flex'><span className='flex flex-row items-center  gap-2 my-auto  mx-2 justify-center  align-middle'><FaRegCommentDots size={25}/> {question.comments}</span>
  <span className='flex  my-auto'>Comment</span></div></DialogTrigger>
  <DialogContent className='bg-[#e3fad2]'>
    <DialogHeader>
      <DialogTitle>Add your comment to this question.
        <p className='my-2 font-thin text-sm'>Question ID :- {questionId}</p>
      </DialogTitle>
      
      <DialogDescription>
      <div className="mb-4">
          <label htmlFor="question" className="block font-medium mb-1">
            Comment:
          </label>
          <textarea
            id="question"
            rows="4"
            className="w-full border text-black text-lg bg-[#e0ffca] border-gray-300 outline-none focus:ring-0  rounded p-2  focus:ring-blue-500"
            value={commentEdit}
            onChange={(e) => setCommentEdit(e.target.value)}
            placeholder="Enter your comment"
          ></textarea>
        </div>

        <button
          onClick={(e)=>{handleCommentSubmit()}}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit Question
        </button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
    <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
      <IoMdShare size={25} />
      <span>Share</span>
    </div>
  </div>

  {/* Comments Section */}
  <div className="mt-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
    {comments.map((comment) => (
      <div
        key={comment._id}
        className="bg-[#f0fee5] p-3 flex max-md:flex-col max-md:items-center justify-between rounded-lg shadow-sm mb-2"
      >
        <div className="flex items-center  text-left space-x-4 mb-2">
          {comment.userId.avatar ? (
            <img
              src={comment.userId.avatar}
              alt={comment.userId.fullName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <RxAvatar color="#81f82c" className="w-8 h-8 rounded-full" />
          )}
          <div className='w-full'>
            <h4 className="font-semibold w-full max-sm:w-5/6 text-wrap text-gray-800">
              {comment.userId.fullName}
            </h4>
            <p className="text-xs w-4/5 overflow-clip text-gray-500">{comment.userId.userName}</p>
          </div>
        </div>
        <div className='ml-4 text-right'>
        <p className="text-gray-800 text-right">{comment.comment}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  )
}

export default Question
