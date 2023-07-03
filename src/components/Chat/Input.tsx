import { RefObject, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Author } from '../../types/Author.types';

type InputProps = {
    MessageInput: RefObject<HTMLInputElement>;
    Socket: Socket;
    User: Author;
}

export default function Input(props: InputProps) {

    const [message, setMessage] = useState<string>('');

    const handleSendMessage = () => {
        if (message.trim() && props.User){
            props.Socket.emit('message', {
                text: message,
                author: props.User,
                id: props.Socket.id+"."+Math.random(),
                socketID: props.Socket.id,
            })
        }
        props.MessageInput.current && (props.MessageInput.current.value = "");
        setMessage('');
    }
    
    const handleOnChangeMessage = (context: string) => {
        setMessage(context)
    }

    const handleOnFocusIn = () => {
        props.Socket.emit('typing', (props.User));
    }

    const handleOnFocusOut = () => {
        props.Socket.emit('notTyping', (props.User));
    }

    return(
        <div className="flex items-center w-full h-18 p-6 gap-2">
            <div className="w-[85%] md:w-[90%]">
                <input 
                    ref={props.MessageInput} 
                    onFocus={() => handleOnFocusIn()} 
                    onBlur={() => handleOnFocusOut()}
                    onChange={(e) => handleOnChangeMessage(e.target.value)} 
                    onKeyUp={(e) => {
                        if(e.key === "Enter"){
                            handleSendMessage()
                        }
                    }}
                    className="w-full h-10 rounded-md px-2">
                </input>
            </div>
            <div className="flex items-center h-full grow">
                <button onClick={handleSendMessage} className='w-full h-full font-semibold bg-sky-300 rounded-md bg-opacity-60 backdrop-blur-lg self-end hover:bg-opacity-60 hover:bg-sky-400 active:bg-opacity-60 active:bg-sky-500 transition-all duration-300'>Send</button>
            </div>
        </div>
    )
}