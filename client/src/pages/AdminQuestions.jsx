import Navbar from '@/components/Navbar';
import axiosInstance from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MdDeleteOutline } from 'react-icons/md';
import { ImCancelCircle } from "react-icons/im";
import InfiniteScroll from 'react-infinite-scroll-component';
import { GiConfirmed } from "react-icons/gi";

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [pendingQuestions,setPendingQuestions]=useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [user,setUser] = useState({
    avatar: null,        
createdAt: null,      
emailId: null,       
followers: 0,         
following: 0,         
fullName: null,      
role: null,           
updatedAt: null,      
userId:null,        
userName: null, 
})



useEffect(()=>{
  axiosInstance.get("auth/get").then((res)=>{
      if(res.data.statusCode<400){
          setUser(res.data.data);
          setPage(1)
          console.log(res.data.data)
      }
      else{
          toast.error(res.data.message)
      }
        }).catch((err)=>{
          toast.error("An error occurred while getting user")
      console.log(err)
        })
},[])

const fetchQuestions = async () => {
  if(page>=1){
  try {
    const response = await axiosInstance.get(`question/get`, {
      params: { page, limit: 10 },
    });
    const { questions, currentPage: currentPage, totalPages: totalPages } = response.data.data;
    console.log(response)
    setQuestions((prevQuestions) => [...prevQuestions, ...questions]);
    setHasMore(currentPage<totalPages);
  } catch (error) {
      toast.error("Error getting questions.")
      console.error('Error fetching questions:', error);
  }
}
};


useEffect(()=>{
 
  if(user.userId!=null){
    axiosInstance.get(`question/get`, {
      params: { page, limit: 50,status:"Pending" },
    }).then((res)=>{
      if(res.data.statusCode<400){
        const { questions, currentPage: currentPage, totalPages: totalPages } = res.data.data;
        console.log(res)
        setPendingQuestions(questions);
      }
      else{
        toast.error(res.data.message);
        console.log(res);
      }
    }).catch((error)=>{
      toast.error("Error getting pending questions.")
      console.error('Error fetching pending questions:', error);
    })
  
  } 
},[user])

useEffect(() => {

  fetchQuestions();

}, [page]);

const fetchNextPage = () => setPage((prevPage) => prevPage + 1);
useEffect(()=>{
  setPage(1)
},[])



const otherQuestions =  questions.filter(q => q.status !== 'Pending');

const deleteQuestion = async (questionId) =>{
  await axiosInstance.get("question/delete",{params:{questionId}}).then((res)=>{
    if(res.data.statusCode<400){
      toast.success("Question deleted successfully")
      window.location.reload()
    }
    else{
      toast.error(res.data.message)
    }
  }).catch((err)=>{
    toast.error("Error deleting question, Please try again")
    console.error(err)
  })
}

const approve = async (questionId) =>{
    await axiosInstance.post('question/approve',{questionId:questionId}).then((res)=>{
      if(res.data.statusCode<400){
        toast.success("Question Approved successfully")
        window.location.reload();
      }
      else{
        console.log(res);
        toast.error(res.data.message)
      }
    }).catch((err)=>{
console.error(err);
toast.error("Error Approving Question")
    })
}
const disapprove = async (questionId) =>{
  await axiosInstance.post('question/disapprove',{questionId:questionId}).then((res)=>{
    if(res.data.statusCode<400){
      toast.success("Question Disapproved successfully")
      window.location.reload();
    }
    else{
      console.log(res);
      toast.error(res.data.message)
    }
  }).catch((err)=>{
console.error(err);
toast.error("Error Disapproving Question")
  })
}
  return (
    <div className=' mx-auto '>
    <Navbar/>
    {user.role!=="admin"?<div className="mb-8 w-4/6 max-md:w-5/6 mx-auto mt-2"><h1 className='font-semibold text-lg'>Sorry, You are unautorized to access this page</h1></div>:
    <div>
    <div className="mb-8 w-4/6 max-md:w-5/6 mx-auto mt-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Questions</h2>
          {pendingQuestions.length > 0 ? (
            <div className="space-y-4 ">
              {pendingQuestions.map((question) => (
                <div key={question._id} className="bg-[#eafbdd] p-4 rounded-lg shadow-sm">
                  <span className='flex  justify-end   '>
                  <Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'>
<ImCancelCircle color='#ff5213'/>
</DialogTrigger>
<DialogContent className='bg-[#e3fad2]'>
  <DialogHeader>
    <DialogTitle>Disapprove this question ?</DialogTitle>
  </DialogHeader>

  <div>
  <div className='mt-4 flex justify-end'>
      <button onClick={()=>{disapprove(question._id)}} className='p-2 rounded-lg hover:bg-orange-600 bg-red-400 px-3 text-white'>Confirm Disapprove</button>
    </div>
  

  </div>
</DialogContent>
</Dialog>

<Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'>
<GiConfirmed  color='#1dcc0df5' />
</DialogTrigger>
<DialogContent className='bg-[#e3fad2] '>
  <DialogHeader>
    <DialogTitle>Approve this question ?</DialogTitle>
  </DialogHeader>

  <div>
  <div className='mt-4 flex justify-end'>
      <button onClick={()=>{approve(question._id)}} className='p-2 rounded-lg hover:bg-green-600 bg-green-400 px-3 text-white'>Confirm Approve</button>
    </div>
  

  </div>
</DialogContent>
</Dialog>

                    </span>
                  <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>
                  <p className="text-gray-600">{new Date(question.createdAt).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">{"# "}{question.tags.join(" # ")}</span>
                  </div>
                  <span className='flex justify-end'>
                  <Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'><MdDeleteOutline size={25}/></DialogTrigger>
<DialogContent className='bg-[#e3fad2]'>
  <DialogHeader>
    <DialogTitle>Are you sure to delete this Question</DialogTitle>
  </DialogHeader>

  <div>
    <span>This cannot be undone.</span>
    <div className='mt-4 flex justify-end'>
      <button onClick={()=>{deleteQuestion(question._id)}} className='p-2 rounded-lg hover:bg-orange-600 bg-red-400 px-3 text-white'>Confirm Delete</button>
    </div>
  </div>
</DialogContent>
</Dialog>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No pending questions.</p>
          )}
        </div>
        <div className="mb-8 w-4/6  mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Questions</h2>

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

          {otherQuestions.length > 0 ? (
            <div className="space-y-4 ">
              {otherQuestions.map((question) => (
                <div key={question._id} className={`${question.status=="Approved"?"bg-green-200":"bg-orange-200"} p-4 rounded-lg shadow-sm`}>
                  <span className='flex  justify-end   '>
                  <Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'>
<ImCancelCircle color='#ff5213'/>
</DialogTrigger>
<DialogContent className='bg-[#e3fad2]'>
  <DialogHeader>
    <DialogTitle>Disapprove this question ?</DialogTitle>
  </DialogHeader>

  <div>
  <div className='mt-4 flex justify-end'>
      <button onClick={()=>{disapprove(question._id)}} className='p-2 rounded-lg hover:bg-orange-600 bg-red-400 px-3 text-white'>Confirm Disapprove</button>
    </div>
  

  </div>
</DialogContent>
</Dialog>

<Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'>
<GiConfirmed  color='#30ff44' />
</DialogTrigger>
<DialogContent className='bg-[#e3fad2] '>
  <DialogHeader>
    <DialogTitle>Approve this question ?</DialogTitle>
  </DialogHeader>

  <div>
  <div className='mt-4 flex justify-end'>
      <button onClick={()=>{approve(question._id)}} className='p-2 rounded-lg hover:bg-green-600 bg-green-400 px-3 text-white'>Confirm Approve</button>
    </div>
  

  </div>
</DialogContent>
</Dialog>
                    </span>
                  <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>
                  <p className="text-gray-600">{new Date(question.createdAt).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">{"# "}{question.tags.join(" # ")}</span>
                  </div>
                  <span className='flex justify-end'>
                  <Dialog className="mt-2">
<DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'><MdDeleteOutline size={25}/></DialogTrigger>
<DialogContent className='bg-[#e3fad2]'>
  <DialogHeader>
    <DialogTitle>Are you sure to delete this Question</DialogTitle>
  </DialogHeader>

  <div>
    <span>This cannot be undone.</span>
    <div className='mt-4 flex justify-end'>
      <button onClick={()=>{deleteQuestion(question._id)}} className='p-2 rounded-lg hover:bg-orange-600 bg-red-400 px-3 text-white'>Confirm Delete</button>
    </div>
  </div>
</DialogContent>
</Dialog>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No Approved or Disapproved questions.</p>
          )}
          </InfiniteScroll>
        </div>
          </div>}
  </div>
  )
}

export default AdminQuestions
