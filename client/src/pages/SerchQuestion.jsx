import axiosInstance from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { RxAvatar } from 'react-icons/rx';
import { useAuthData } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const SerchQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [comment,setComment] = useState("");
    const navigate = useNavigate(); 
    const {userData} = useAuthData();
    const {keyword} = useParams();


    const fetchQuestions = async () => {
        if(page>=1){
        try {
         
          const response = await axiosInstance.get(`question/get`, {
            params: { page, status:"Approved",search:keyword },
          });
          const { questions, currentPage: currentPage,totalPages: totalPages } = response.data.data;
          console.log(response)
        
          setQuestions((prevQuestions) => [...prevQuestions, ...questions]);
          setHasMore(currentPage<totalPages);
          
        } catch (error) {
            toast.error("Error getting questions.")
            console.error('Error fetching questions:', error);
        }
      }
      };
    
    
      const handleDislike = async (postId, userId) => {
        setQuestions((prevPosts) => {
          const updatedPosts = prevPosts.map((post) => {
            if (post._id === postId) {
              // If the user is not in the dislike list, add them and increase the dislike count
              if (!post.dislikesList.includes(userId)) {
                post.dislikesList.push(userId);
                post.dislikes++;
              }
      
              // If the user is in the likes list, remove them and decrease the like count
              if (post.likesList.includes(userId)) {
                post.likesList = post.likesList.filter((id) => id !== userId);
                post.likes--;
              }
            }
            return post;
          });
          return updatedPosts;
        });
        await axiosInstance.post('like/dislikeQuestion', {questionId:postId}).then((res)=>{
    
        }).catch((err)=>{
            console.log(err);
            toast.error('Error Disliking the question')
        })
      };
      
      
      
    
    
    
      useEffect(() => {
      
          
    
       fetchQuestions();
        
      }, [page]);
    
      useEffect(()=>{
    setPage(1)
      },[])
     
    
      const handleLike =async (postId, userId) => {
        setQuestions((prevPosts) => {
          const updatedPosts = prevPosts.map((post) => {
            if (post._id === postId) {
              // If the user is not in the likes list, add them and increase the like count
              if (!post.likesList.includes(userId)) {
                post.likesList.push(userId);
                post.likes++;
              }
      
              // If the user is in the dislike list, remove them and decrease the dislike count
              if (post.dislikesList.includes(userId)) {
                post.dislikesList = post.dislikesList.filter((id) => id !== userId);
                post.dislikes--;
              }
            }
            return post;
          });
          return updatedPosts;
        });
        console.log(postId)
        await axiosInstance.post('like/likeQuestion',{questionId:postId}).then((res)=>{
    
        }).catch((err)=>{
            console.log(err);
            toast.error('Error Liking the question')
        })
      };
      
      
      const handleCommentSubmit = async (questionId) =>{
        if(!comment) {
            toast.error("Comment is empty !!")
        }
        else{
            await axiosInstance.post('comment/create',{questionId, comment:comment}).then((res)=>{
                if(res.data.statusCode<400){
                    toast.success("Comment added successfully")
                    window.location.reload()
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
    
      const handleFeedClick = (questionId) => {
        if(questionId){
        navigate(`question/${questionId}`); 
    }
      }
    
      const fetchNextPage = () => {setPage((prevPage) => prevPage + 1);}
    
    



  return (
    <div>
        <Navbar/>
    <div className="flex justify-center w-3/6 max-md:mx-auto max-md:w-full m-auto flex-col  bg-gray-100 py-4">
    <h1 className='font-semibold my-3 text-base'>Serach Result for <span className='font-bold text-large'>{keyword}</span></h1>
      {/* Feed Container */}
      <div className="w-full max-w-3xl">
        <InfiniteScroll
          dataLength={questions.length} 
          next={fetchNextPage} 
          hasMore={hasMore} 
          loader={<h4 className="text-center text-gray-500">Loading...</h4>} // Loading indicator
          endMessage={
            <p className="text-center text-gray-500">
              <b>No more questions to show</b>
            </p>
          }
        >
          {/* Render Posts */}
          {questions.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-2 mb-4"
            >
              {/* Post Header */}
              <div className="flex items-center space-x-4">
              {post.userId.avatar?<img
            src={post.userId.avatar}
            alt={post.userId.fullName}
            className="w-10 h-10 rounded-full mr-3"
          />:<RxAvatar color='#81f82c' className="w-10 h-10 rounded-full border-4 border-gray-200 mb-4" />}
                <div>
                  <h2 className="font-semibold text-left text-gray-800">{post.userId.fullName}</h2>
                  <p className="text-sm text-left text-gray-500">{post.userId.userName}</p>
                </div>
              </div>

              {/* Post Content */}
              <div onClick={(e)=>{handleFeedClick(post._id)}} className="text-gray-800">
                <p>{post.question}</p>
              </div>

              {/* Tags */}
              <div className="flex space-x-2 text-sm text-blue-500">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Footer */}
              <div className="flex flex-wrap justify-evenly gap-2 text-gray-500 text-sm mt-2">
                <div onClick={(e)=>{handleLike(post._id,userData.userId)}} className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
                  <span className='flex flex-row items-center  gap-2 my-auto justify-center mx-auto align-middle'>{post.likesList.includes(userData.userId)?<AiFillLike color='#bcea9b' size={25}/>:<AiOutlineLike size={25}/>} {post.likes}</span>
                  <span>Like</span>
                </div>
                <div onClick={(e)=>{handleDislike(post._id,userData.userId)}} className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
                  <span className='flex flex-row items-center  gap-2 my-auto justify-center mx-auto align-middle'>{post.dislikesList.includes(userData.userId)?<AiFillDislike color='#bcea9b' size={25}/>:<AiOutlineDislike size={25}/>} {post.dislikes}</span>
                  <span>Dislike</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
                <Dialog>
  <DialogTrigger><div className='flex'><span className='flex flex-row items-center  gap-2 my-auto  mx-2 justify-center  align-middle'><FaRegCommentDots size={25}/> {post.comments}</span>
  <span className='flex  my-auto'>Comment</span></div></DialogTrigger>
  <DialogContent className='bg-[#e3fad2]'>
    <DialogHeader>
      <DialogTitle>Add your comment to this question.
        <p className='my-2 font-thin text-sm'>Question ID :- {post._id}</p>
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
          ></textarea>
        </div>

        <button
          onClick={(e)=>{handleCommentSubmit(post._id)}}
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
                    <span><IoMdShare size={25}/></span>
                  <span>Share</span>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
    </div>
  )
}

export default SerchQuestion
