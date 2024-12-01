import axiosInstance from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MdDeleteOutline } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '@/components/Navbar';


const Questions = () => {
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
  if(page>=1 && user.userId){
  try {
    const response = await axiosInstance.get(`question/get`, {
      params: { page, limit: 10,userId:user.userId },
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
 console.log("reached")
    axiosInstance.get(`question/get`, {
      params: { page, limit: 50,userId:user.userId,status:"Pending" },
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
  
    //setHasMore(currentPage<totalPages);
  } 
},[user])

useEffect(() => {

  fetchQuestions();
 
}, [page]);

const fetchNextPage = () => setPage((prevPage) => prevPage + 1);


const [editQuestion, setEditQuestion] = useState('');
const [tags, setTags] = useState([]);
const [tagInput, setTagInput] = useState('');
const [error, setError] = useState('');

const handleAddTag = () => {
  if (!tagInput.trim()) {
    setError('Tag cannot be empty');
    return;
  }
  if (tags.includes(tagInput.trim())) {
    setError('Tag already added');
    return;
  }
  setTags((prevTags) => [...prevTags, tagInput.trim()]);
  setTagInput('');
  setError('');
};

const handleRemoveTag = (tagToRemove) => {
  setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
};

const handleSubmit = (e,questionId) => {
  e.preventDefault();
  if (!editQuestion.trim()) {
    setError('Question cannot be empty');
    return;
  }
  if (tags.length === 0) {
    setError('Please add at least one tag');
    return;
  }
  setError('');

  axiosInstance.post("question/edit",{id:questionId,question:editQuestion,tags}).then((res)=>{
      if(res.data.statusCode<400){
          window.location.reload();
      }
      else{
          toast.error(res.data.message)
      }
      console.log(res);
      setEditQuestion('');
      setTags([]);
  }).catch((err)=>{
      toast.error("Error uploading question")
      console.log(err);
  })


};

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

  return (
    <div className=' mx-auto '>
      <Navbar/>
      <div className="mb-8 w-4/6 mx-auto mt-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Questions</h2>
            {pendingQuestions.length > 0 ? (
              <div className="space-y-4 ">
                {pendingQuestions.map((question) => (
                  <div key={question._id} className="bg-[#eafbdd] p-4 rounded-lg shadow-sm">
                    <span className='flex  justify-end   '>
                    <Dialog className="mt-2">
  <DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'><button onClick={()=>{setEditQuestion(question.question);setTags([...question.tags]);setError()}}><MdEdit size={25}/></button></DialogTrigger>
  <DialogContent className='bg-[#e3fad2]'>
    <DialogHeader>
      <DialogTitle>Add Question, Let our community answer it ?</DialogTitle>
    </DialogHeader>

    <div>

    <form>
        <div className="mb-4">
          <label htmlFor="question" className="block font-medium mb-1">
            Question:
          </label>
          <textarea
            id="question"
            rows="4"
            className="w-full border bg-[#e0ffca] border-gray-300 outline-none focus:ring-0  rounded p-2  focus:ring-blue-500"
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            placeholder="Enter your question"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="tagInput" className="block font-medium mb-1">
            Add Tag:
          </label>
          <div className="flex">
            <input
              type="text"
              id="tagInput"
              className="flex-grow border bg-[#e0ffca] outline-none focus:ring-0 border-gray-300 rounded p-2  focus:ring-blue-500"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter a tag"
            />
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-[#6A669D] text-white rounded hover:bg-[#5b55b0]"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {tags.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium">Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={(e)=>{handleSubmit(e,question._id)}}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit Question
        </button>
      </form>

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
          <div className="mb-8 w-4/6 mx-auto">
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
  <DialogTrigger className='bg-[#c6f6a4] rounded-md p-2 shadow-lg'><button onClick={()=>{setEditQuestion(question.question);setTags([...question.tags]);setError()}}><MdEdit size={25}/></button></DialogTrigger>
  <DialogContent className='bg-[#e3fad2]'>
    <DialogHeader>
      <DialogTitle>Add Question, Let our community answer it ?</DialogTitle>
    </DialogHeader>

    <div>

    <form>
        <div className="mb-4">
          <label htmlFor="question" className="block font-medium mb-1">
            Question:
          </label>
          <textarea
            id="question"
            rows="4"
            className="w-full border bg-[#e0ffca] border-gray-300 outline-none focus:ring-0  rounded p-2  focus:ring-blue-500"
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            placeholder="Enter your question"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="tagInput" className="block font-medium mb-1">
            Add Tag:
          </label>
          <div className="flex">
            <input
              type="text"
              id="tagInput"
              className="flex-grow border bg-[#e0ffca] outline-none focus:ring-0 border-gray-300 rounded p-2  focus:ring-blue-500"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter a tag"
            />
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-[#6A669D] text-white rounded hover:bg-[#5b55b0]"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {tags.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium">Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={(e)=>{handleSubmit(e,question._id)}}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit Question
        </button>
      </form>

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
    </div>
  )
}

export default Questions
