import React, { useState,useEffect } from 'react';
import { ethers  }  from 'ethers';
import { TextField,Button } from '@mui/material';
import { contractAddress } from './config';
// import TaskAbi from './abi/TaskContract.json'
import Task from './Task';
import './App.css';
const { abi } = require('./abi/TaskContract.json')
function App() {
  const [tasks,setTasks] = useState([]);
  const [input,setInput] = useState('');
  const [currentAccount,setCurrentAccount] = useState('');
  const [correctNetwork,setCorrectNetwork] = useState(false);



  useEffect(()=>{
    getAllTasks();
    // 是否立即连接钱包
    conncetWallet()
    // console.log( new ethers,'ethers')
  },[])
  const conncetWallet = async ()=>{
    try{
      const { ethereum} = window;
       if(!ethereum) {
        console.log(' please downloadmetamask');
       }
       const chainId = await ethereum.request({
        method:'eth_chainId'
      })
      const goerliChainId = '0x5' ;  //Rinkeby is 0x4
      if(chainId !== goerliChainId) {
        alert('you are not connected to Goerli network')
        return
      }else {
        setCorrectNetwork(true)
      }
         // get Accounts
        const accounts =  await ethereum.request({
          method:"eth_requestAccounts"
        })
        const account = accounts && accounts[0];
        console.log(account,' this is your address account')
        setCurrentAccount(account)
    }catch(error) {
      console.log(' error connect metamask',error)
    }
  }

   const addTask = async (e)=> {
    e.preventDefault();
    const task = {
      taskText:input,
      isDeleted:false
    };
    try {
      const { ethereum  } = window;
      if(ethereum) {
        // 和合约交互 ；Contract( 合约地址。合约的ABI ， 合约签名)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(contractAddress,abi,signer);
        const { taskText,isDeleted} = task;
        // 添加任务；
        TaskContract.addTask(taskText,isDeleted).then(res=>{
          setTasks([...tasks,task])
        }).catch(error=> {
          console.log(error,'please again add task')
        })
      }
    }catch(error) {

    }
    setInput('') // 添加项变成空
   }

   const deleteTask =  key => async ()=> {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(contractAddress,abi,signer);
        await TaskContract.deleteTask(key,true);
        const allTasks = await TaskContract.getMytasks();
        setTasks(allTasks)
      }else {
        console.log('error')
      }
    }catch(error){
      console.log(error)
    }
   }

   const getAllTasks = async ()=> {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(contractAddress,abi,signer);
        const allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks)
      }else {
        console.log('error')
      }
    }catch(error){
      console.log(error)
    }
   }
   return (
     <div>
       {
        currentAccount === '' ? (
          <center>
            <button className='button' onClick={conncetWallet}> connect wallet </button>
          </center>
        ): correctNetwork ? (
          <div className='App'>
            <h2>Task Management List</h2>
            <form>
              <TextField
                id="outlined-basic" label="Make Todo" variant="outlined"
                style={{ margin:'0 5px'}}
                size='small'
                value={input}
                onChange={e=>setInput(e.target.value)}
              ></TextField>
              <Button variant='contained' color='primary' onClick={addTask}>Add Task</Button>
            </form>
            <ul>
              {
                tasks.map(item=>{
                  return <Task
                    key={item.id}
                    taskText={item.taskText}
                    onClick={deleteTask(item.id)}
                  ></Task>
                })
              }
            </ul>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
            <div> Please connect to the Goerli Tesenet and reload the screen</div>
          </div>
        )
       }
     </div>
   )
}

export default App;