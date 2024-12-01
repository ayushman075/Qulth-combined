import React, { useEffect, useRef, useState } from 'react'
import { FiLogOut } from "react-icons/fi";
import { CiMenuFries } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthData } from '@/context/AuthContext';
import axiosInstance from '@/utils/axiosConfig';
import { toast } from 'react-toastify';
import { IoSearch } from "react-icons/io5";
import useDebounce from '@/context/useDebounce';
import { RxAvatar } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import logo from "../../public/qultrLogo.png"


const Navbar = () => {
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate(); 
    const { isSignedIn,logout } = useAuthData();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggOpen, setSuggOpen] = useState(false);
  const dropdownRef = useRef(null);
  const suggestionDropRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const {setUserData} = useAuthData();
  const [isQuestionModalOpen,setIsQuestionModalOpen]=useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleClickOutsideDropdown = (event) => {
   
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (suggestionDropRef.current && !suggestionDropRef.current.contains(event.target)) {
      setSuggOpen(false);
    }
    
  };
  const {userData} = useAuthData();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };


  useEffect(() => {
    if (debouncedSearchValue) {
      const fetchSuggestions = async () => {
        try {
         const response = await axiosInstance.get('question/get',{params:{status:"Approved",search:debouncedSearchValue}});
          setSuggestions(response.data.data.questions);
          setSuggOpen(true);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          toast.error("Error getting search suggestion")
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setSuggOpen(false);
    }
  }, [debouncedSearchValue]);



  const onSearch = (searchTerm) => {
    navigate(`/questionSearch/${searchTerm}`);
    setSearchValue('');
    setSuggestions([]);
    setSuggOpen(false);
  };
  const onIndividualSearch = (id) => {
    navigate(`/question/${id}`);
    setSearchValue('');
    setSuggestions([]);
    setSuggOpen(false);
  };
   
    useEffect(()=>{
        if(!isSignedIn ){
        
            navigate("/login")
        }
    },[isSignedIn])
    const handleClickOutside = (event) => {
      
        
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
      };
    
      useEffect(() => {
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);


       
    const [user,setUser] = useState({
  avatar: null,        
  createdAt: null,      
  emailId: null,       
  followers: 0,         
  following: 0,         
  fullName: null,      
  role: null,           
  updatedAt: null,      
  userId: null,         
  userName: null, 
    });
    useEffect(()=>{
        axiosInstance.get("auth/get").then((res)=>{
            if(res.data.statusCode<400){
                setUser(res.data.data);
                setUserData(res.data.data)
                if(res.data.data?.userName==res.data.data?.emailId||res.data.data?.fullName=="null null"){
                  setIsOpen(true);
                }
                else{
                  setIsOpen(false);
                }
            }
            else{
                toast.error(res.data.message)
            }
              }).catch((err)=>{
                toast.error("An error occurred while getting user")
            console.log(err)
              })
    },[])


    const [question, setQuestion] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isOpen,setIsOpen] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Question cannot be empty');
      return;
    }
    if (tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }
    setError('');

    axiosInstance.post("question/create",{question,tags}).then((res)=>{
        if(res.data.statusCode<400){
            window.location.reload();
        }
        else{
            toast.error(res.data.message)
        }
        console.log(res);
        setQuestion('');
        setTags([]);
    }).catch((err)=>{
        toast.error("Error uploading question")
        console.log(err);
    })
  };

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null); 
  const [loading, setLoading] = useState(false);


  const debouncedUserNameValue = useDebounce(username,1000);
  useEffect(()=>{
    if(debouncedUserNameValue){
    axiosInstance.post('auth/check-username',{userName:debouncedUserNameValue}).then((res)=>{
        if(res.data.statusCode<400){
          setUsernameAvailable(res.data.data);
        }
        else{
          toast.error(res.data.message);
          console.log(res);
        }
    }).catch((err)=>{
      console.error(err);
      toast.error("Error checking username")
    })
  }
  },[debouncedUserNameValue])


  const handleProfileSubmit = async () => {
    if(usernameAvailable){
      axiosInstance.post('auth/update',{userName:username,fullName:fullname}).then((res)=>{
        if(res.data.statusCode<400){
          toast.success('User profile updated successfully');
          setIsOpen(false);
          window.location.reload();
        } else{
          console.log(res);
          toast.error(res.data.message);
        }
      }).catch((err)=>{
        console.error(err);
        toast.error('Error occurred while updating profile.')
      })
    }
  } 



  return (
    <div ref={menuRef} >
       <div  className="flex   w-4/6 max-md:w-full mt-[-10px] rounded-xl m-auto backdrop-blur-lg  bg-gradient-to-t from-white to-gray-300  border-gray-200 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to={'/'} className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="ml-3 text-xl font-bold text-gray-800">Qulth</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow mx-4 mr-5">
            <div className="relative text-gray-600 w-full">
              <input
                type="search"
                name="search"
                placeholder="Search for questions"
                className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
                value={searchValue} 
                onChange={handleSearchChange}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 md:mt-3 md:mr-4"
                onClick={() => onSearch(searchValue)}
              >
                <IoSearch className="h-4 w-4 text-gray-600" />
              </button>
              {suggOpen && (
                <div 
                  style={{ width: 'calc(100% - 2.5rem)' }}
                  ref={suggestionDropRef}
                  className="absolute z-10 bg-white mt-2 rounded-md shadow-lg"
                >
                  {suggestions?.map((question, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onIndividualSearch(question._id)}
                      >
                        {question.question}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>


        {/* Logout Button */}
        {isSignedIn?<button
          onClick={logout}
          className="rounded-lg max-md:hidden bg-[#bcea9b] px-4 py-2 text-black  font-bold hover:bg-[#6A669D] hover:text-white"
        >
          <FiLogOut size={20} />
        </button>:<Link to={'/login'}/>}
        <button
          onClick={(e)=>{setIsMenuOpen(!isMenuOpen)}}
          className="rounded-lg md:hidden  bg-[#bcea9b] px-4 py-2 text-black  font-bold hover:bg-[#6A669D] hover:text-white"
        >
          <CiMenuFries size={25}/>
        </button>
      </div>
      
    </div>
    {isMenuOpen&&<div className='md:hidden  backdrop-blur-lg  bg-gradient-to-b from-white to-gray-300 rounded-xl  border-gray-200 flex flex-col'>
      <div className=" md:flex flex-grow mx-4 mr-5">
            <div className="relative text-gray-600 w-full">
              <input
                type="search"
                name="search"
                placeholder="Search for questions"
                className="bg-white h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none w-full"
                value={searchValue} 
                onChange={handleSearchChange}
              />
              <button 
                type="submit" 
                className="absolute right-1 top-3 md:mt-3 md:mr-4"
                onClick={() => onSearch(searchValue)}
              >
                <IoSearch className="h-4 w-4 text-gray-600" />
              </button>
              {suggOpen && (
                <div 
                  style={{ width: 'calc(100% - 2.5rem)' }}
                  ref={suggestionDropRef}
                  className="absolute z-10 bg-white mt-2 rounded-md shadow-lg"
                >
                  {suggestions?.map((question, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onIndividualSearch(question._id)}
                      >
                        {question.question}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        <div className=' border-b-2 py-0 mx-4   border-[#6A669D]'>
        <div>
      <AlertDialog  open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
          {/* Hidden trigger button */}
          <button className="hidden">Open</button>
        </AlertDialogTrigger>
        <AlertDialogContent className='bg-[#bcea9b]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete your profile to continue.</AlertDialogTitle>
            <AlertDialogDescription>
            <div className="flex justify-center items-center ">
      <form
        className=" p-8  rounded-md w-full max-w-md"
      >
    

        {/* Fullname Field */}
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-2 border rounded outline-none focus:ring-0 bg-[#dff8cd]"
            placeholder="Enter your full name"
          />
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
            className={`w-full p-2 border bg-[#dff8cd] rounded focus:outline-none ${
              usernameAvailable === false
                ? "border-red-500"
                : usernameAvailable === true
                ? "border-green-500"
                : "border-gray-300"
            }`}
            placeholder="Enter a username"
          />
          {loading && <p className="text-blue-500 text-sm mt-1">Checking...</p>}
          {!loading && usernameAvailable === true && (
            <p className="text-green-500 text-sm mt-1">Username is available!</p>
          )}
          {!loading && usernameAvailable === false && (
            <p className="text-red-500 text-sm mt-1">Username is taken.</p>
          )}
        </div>      
      </form>
    </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className='bg-green-400' onClick={() => {handleProfileSubmit()}}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    <div className="  items-center mb-4 rounded-xl p-6 w-full">
      {/* Profile Picture */}
      {user?.avatar?<img
        src={user.avatar}
        alt={user.fullName}
        className="w-32 h-32 m-auto rounded-full border-4 border-gray-200 mb-4"
      />:<RxAvatar color='#81f82c' className="w-32 h-32 m-auto rounded-full border-4 border-gray-200 mb-4" />}

      
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
        <p className="text-sm text-gray-500">{user.userName}</p>
      </div>

      {/* Email */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-700">{user.emailId}</p>
      </div>

      {/* Followers and Following */}
     

      {/* Created/Updated At */}
      
      <Dialog className="mt-2" >
  <DialogTrigger className='w-full flex mt-4 bg-[#bcea9b] p-2 rounded-xl hover:bg-[#6A669D] hover:text-white justify-center my-auto'><IoMdAdd className='mr-2' size={25}/> Add Question</DialogTrigger>
  <DialogContent className='bg-[#e3fad2]'>
    <DialogHeader>
      <DialogTitle>Add Question, Let our community answer it ?</DialogTitle>
    </DialogHeader>

    <div ref={menuRef}>

    <form>
        <div className="mb-4" >
          <label htmlFor="question" className="block font-medium mb-1">
            Question:
          </label>
          <textarea
            id="question"
            rows="4"
            className="w-full border bg-[#e0ffca] border-gray-300 outline-none focus:ring-0  rounded p-2  focus:ring-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
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
          onClick={(e)=>{handleSubmit(e)}}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit Question
        </button>
      </form>

    </div>
  </DialogContent>
</Dialog>
</div>
</div>
       
           
      
      <div className=' border-b-2 py-3 mx-4 border-[#6A669D]'>
        <Link className='hover:bg-[#bcea9b]' to={"/questions"}>Your Questions</Link>
      </div>
      {userData.role=="admin"&&<div className='  py-3 mx-4 '>
        <Link to={"/adminQuestions"}>Manage Questions</Link>
      </div>}
      <div>
      {isSignedIn?<button
          onClick={logout}
          className="flex justify-center gap-x-4 align-middle  rounded-lg w-4/5 my-4 mx-auto text-center  bg-[#bcea9b] px-4 py-2 text-black  font-bold hover:bg-[#6A669D] hover:text-white"
        >
          <FiLogOut size={20} /> Logout
        </button>:<Link to={'/login'}/>}
      </div>
    </div>}
    </div>
  )
}

export default Navbar
