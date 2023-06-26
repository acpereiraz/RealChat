import { ChatMessage } from "../../types/ChatMessage.types"

export default function ChatReq(context: ChatMessage){
    return(
        <div id="chat-container" className="w-full flex h-fit justify-end">
            <div id="chat-content" className="flex bg-gray-100 h-fit rounded-xl px-4 pb-4 pt-6 min-w-[33%] max-w-[50%] relative drop-shadow">
                <p id="chat-text" className="text-start w-full break-words">{context.text}</p>
                <h1 id="chat-author" className="absolute top-1 right-3 text-sm truncate w-2/3 text-gray-600 text-end">{context.author.name}</h1>
            </div>
        </div>
    );
}