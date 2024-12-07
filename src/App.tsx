import { useEffect, useRef, useState } from "react"

function App() {
 
   const [message,setmessage]=useState(["hi"]);
      const wsref=useRef();
      const inputref=useRef();

   const sendmsg=()=>{
    //@ts-ignore
    const messagetobesend=inputref.current.value;
    console.log(messagetobesend)
    wsref.current.send(JSON.stringify({
      type:"chat",
      payload:{
        message:messagetobesend
      }
    }))
   }

   useEffect(()=>{
    const webserver=new WebSocket("ws://localhost:8080")
          
    webserver.onmessage=(event)=>{
        setmessage(prevmessage=>[...prevmessage,event.data])
    }
    //@ts-ignore
    wsref.current=webserver;

    webserver.onopen=()=>{
        webserver.send(JSON.stringify(   //converting it to string because in backend it accept only string and in backend we want object so 
          //we are re converting string into object by json.parse
          {
            type:"join",
            payload:{
              roomId:"red"
            }
          }
        ))
    }

    return ()=>{
         webserver.close()
    }
   },[])

  return <div className="h-screen w-full bg-gray-900 flex flex-col justify-between items-center">
         <div className="h-[90vh] w-96 bg-gray-950  border-2 rounded-xl">
         <div className="w-full  flex justify-center">
         <h1 className="text-3xl text-white font-semibold">Chattify</h1>
         <br />
         </div>
         {message.map((messagesinsidearr)=> <div className="text-white"> {messagesinsidearr} </div>)}
         </div>
         <div className="h-[10vh] w-96 bg-gray-950 border-2 gap-2 rounded-xl">
          <input ref={inputref} className="w-60 rounded-xl" type="text"  placeholder="enter your message"/>
          <button onClick={sendmsg} className="bg-green-500 w-32 border-2 ml-2 rounded-xl">Send message</button>
         </div>
  </div>

}

export default App
