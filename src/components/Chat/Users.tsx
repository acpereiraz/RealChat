import React from "react";
import { Author } from "../../types/Author.types";
import { BsPersonCircle } from "react-icons/bs"

type UsersProps = {
    userArray: Author[]
    isHidden: boolean;
}

const Users = (prop: UsersProps) => {

    return(
        <div className={`${prop.isHidden?'hidden':''} p-3 h-full w-full flex flex-col gap-3`}>
            {prop.userArray.map((user, index)=>(
                <React.Fragment key={index}>
                    <div style={{backgroundColor: user.color}} className="w-full h-18 rounded-xl flex justify-between p-6 font-semibold text-gray-800">
                        <h1 className="text-start truncate w-2/3">{user.name}</h1>
                        <BsPersonCircle className="text-xl cursor-pointer h-[24px] w-[24px]" title="Profile" />
                    </div>
                </React.Fragment>
            ))}
        </div>
    )
}

export default Users;