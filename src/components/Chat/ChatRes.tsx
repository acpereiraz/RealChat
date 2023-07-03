import { ChatMessage } from "../../types/ChatMessage.types"

export default function ChatRes(context: ChatMessage){
    return (
        <div id="chat-container" className="w-full flex justify-start h-fit">
            <div id="chat-content" style={{backgroundColor:context.color}} className="rounded-xl h-fit px-4 pb-4 pt-8 min-w-[33%] max-w-[50%] relative drop-shadow">
                <p id="chat-text" className="text-start w-full break-words">{context.text}</p>
                <h1 id="chat-author" className="absolute top-1 left-3 text-sm truncate w-2/3 text-gray-600 text-start">{context.author.name}</h1>
            </div>
        </div>
    );
}