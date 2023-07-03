// Modules
import { RefObject, useEffect, useRef, useState } from 'react'
import socketIO, { Socket } from 'socket.io-client';

// React Icons
import { BiSolidChevronRight , BiSolidChevronLeft } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";

// Types
import { Author } from './types/Author.types';
import { ChatMessage } from './types/ChatMessage.types';

// Components
import ChatRes from './components/Chat/ChatRes';
import ChatReq from './components/Chat/ChatReq'
import Input from './components/Chat/Input';
import Users from './components/Chat/Users';

// Utils
import PastelColorGen from './utils/PastelColorGen';

// Styling
import './App.css'


const socket: Socket = socketIO("http://144.22.204.159:3000/");

function App() {

  const messageInput = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const overflowContainerRef = useRef(null);

  const [currentUser, setCurrentUser] = useState<Author>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [noUsername, setNoUsername] = useState<boolean>(false);
  const [loggedUsers, setLoggedUsers] = useState<Author[]>([]);
  const [typingStatus, setTypingStatus] = useState<boolean>(false);
  const [currentTypingAuthor, setCurrentTypingAuthor] = useState<Author | null>();

  useEffect(() => {
    const scrollToBottom = () => {
      const MaxScrollHeight = 9999999999;
      if (overflowContainerRef.current) {
        overflowContainerRef.current.scrollTop = MaxScrollHeight;
      }
    }
    scrollToBottom();
  },[])

  useEffect(() => {
    socket.on('LoggedUsers', (users: Author[]) => setLoggedUsers([...users]));
  }, [socket, loggedUsers])

  useEffect(() => {
    socket.on('messageResponse', (data: ChatMessage) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on('typing', (user: Author) => {
      if ((user.name!=currentUser?.name)&&(currentUser)){
        setTypingStatus(true);
        setCurrentTypingAuthor(user);
      }
    })
  })

  useEffect(() => {
    socket.on('notTyping', (user: Author) => {
      if ((user.name!=currentUser?.name)&&(currentUser)){
        setTypingStatus(false);
        setCurrentTypingAuthor(null);
      }
    })
  })

  const handleUserAuth = (userRef: RefObject<HTMLInputElement>) => {
    if (userRef.current && userRef.current.value){
      const User: Author = ({
        id: socket.id,
        name: userRef.current?.value,
        color: PastelColorGen(),
        profile_pic: "null"
      });
      setCurrentUser(User);
      socket.emit("userLogin", User);
      return true;
    }
    setNoUsername(true);
    return console.error("Error: referência userRef não existe.")
  }

  const handleIsHidden = () => {
    return setIsHidden(!isHidden);
  }

  return (
    <div className='App w-full h-full flex flex-col'>

      <div className="w-full h-20 px-20 flex justify-between text-white items-center mdm:hidden">
        <h1 className="text-2xl font-bold subpixel-antialiased">RealChat</h1>
        <div className="flex gap-10 items-center justify-center subpixel-antialiased">
          <h2 className="hover:animate-pulse cursor-pointer">Home</h2>
          <h2 className="hover:animate-pulse cursor-pointer">Chats</h2>
          <h2 className="hover:animate-pulse cursor-pointer">Friends</h2>
          <button className="text-center font-semibold border-2 border-white px-3 py-1 rounded-md hover:bg-white hover:text-black transition-all duration-300 active:bg-gray-200">Account</button>
        </div>
      </div>

      <div className="w-full grow md:flex md:justify-center md:items-center">
        <div className='w-full h-full md:w-[80%] md:h-[90%] md:rounded-xl bg-opacity-10 backdrop-blur-md flex justify-center items-center md:p-6 bg-[#e9eff1] md:gap-6 relative'>

          <div className={`${isHidden?'w-0':"w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"} bg-opacity-20 backdrop-blur-md mdm:absolute shadow md:shadow-none left-0 bg-white top-0 z-10 transition-all duration-300 h-full rounded-xl relative`}>
            <Users userArray={loggedUsers} isHidden={isHidden} />
            <div className={`md:hidden -right-10 absolute transition-all duration-300 top-4`}>
              <HiMenu onClick={handleIsHidden} className="text-gray-700 text-3xl cursor-pointer" />
            </div>
          </div>

          <div id="screen" className='flex flex-col justify-end w-full h-full bg-opacity-20 md:rounded-xl bg-white overflow-hidden relative'>

            <div onClick={handleIsHidden} className="mdm:hidden z-30 w-8 h-8 bottom-1/2 left-2 absolute cursor-pointer">
              {isHidden?<BiSolidChevronRight className="w-full h-full" />:<BiSolidChevronLeft className="w-full h-full" />}
            </div>

            {currentUser ?    

              <>
                <div ref={overflowContainerRef} id="overflow-container" className="flex overflow-y-auto">
                  <div id="chatbox" className="flex flex-col overflow-x-hidden w-full justify-end p-4 grow gap-4 min-h-0">
                    {messages?.map((message, index)=>(
                      (message.author.name === currentUser.name) ? (
                        <ChatReq key={index}  color='none' text={message.text} author={currentUser}/>
                      )
                    :
                      (
                        <ChatRes key={index} color={message.author.color} text={message.text} author={message.author}/>
                      )
                    ))}
                  </div>
                </div>
                {typingStatus&&<div className={`text-gray-700 mb-4`}>{currentTypingAuthor?.name} está digitando...</div>}
                <Input MessageInput={messageInput} Socket={socket} User={currentUser} />
              </>

            :
              <div className="h-full w-full flex justify-center items-center">
                <div className="rounded-3xl flex flex-col items-start p-6 bg-gray-200 bg-opacity-50 backdrop-blur-lg gap-3">
                  <h1 className="font-semibold">Nome:</h1>
                  <h2 className={`text-[#f08080] ${noUsername?"":"hidden"}`}>Please insert a username.</h2>
                  <input ref={userRef} className="rounded-lg h-10 px-2"/>
                  <div className="flex justify-between w-full">
                    <button className="bg-[#f08080] hover:bg-red-500 active:bg-red-600 text-white px-3 py-2 rounded-xl">Cancelar</button>
                    <button onClick={() => {handleUserAuth(userRef)}} className="bg-[#5aa9e6] hover:bg-blue-500 active:bg-blue-600 text-white px-2 py-1 rounded-xl">Entrar</button>
                  </div>
                </div>
              </div>
            }

          </div>

        </div>
      </div>
    </div>
  )
}

export default App
