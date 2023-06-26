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
        <div className="flex items-center w-full h-14 bg-gray-200">
            <input 
                ref={props.MessageInput} 
                onFocus={() => handleOnFocusIn()} 
                onBlur={() => handleOnFocusOut()}
                onChange={(e) => handleOnChangeMessage(e.target.value)} 
                className="w-3/4 px-2 m-4 h-8">
            </input>
            <div className="h-full grow">
                <button onClick={handleSendMessage} className='h-full w-full bg-lime-300 self-end hover:bg-lime-400 active:bg-lime-500'>Send</button>
            </div>
        </div>
    )
}