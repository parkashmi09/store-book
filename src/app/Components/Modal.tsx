import {AiFillCloseCircle} from "react-icons/ai";
import React, {ReactNode} from "react";
import {closeModal} from "@/util/modalFunctions";


type props = {
    name: any;
    modalName: any;
    refName: any;
    children: ReactNode;
    width:any
};
const Modal: React.FC<props> = ({ name,modalName,children,refName,width }) => {



    return(
        <>

            <dialog id={modalName} className="modal modal-bottom sm:modal-middle" ref={refName}>
                <div className={`modal-box ${width}`}>
                    <div className="grid grid-cols-2">
                        <div>
                            <p className="font-semibold">{name}</p>
                        </div>
                        <div className="justify-self-end">
                            <button className="text-xl" onClick={()=>(closeModal(refName))}><AiFillCloseCircle/></button>
                        </div>
                    </div>
                    <hr/>

                    {children}
                </div>
            </dialog>

        </>
    )
}
export default Modal;
