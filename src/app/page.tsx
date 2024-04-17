'use client'
import Todos from "@/components/todoList/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTaskList } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import iconimg from "../components/images/Group-1.svg";
import john from "../components/images/john.svg";
import list from "../components/images/list.svg";
import ss from "../components/images/ss.svg";
import axios from 'axios';
import { baseUrl, createNewTask } from "@/helper/utils";

export default function Home() {
        
  const { updateTask, createdTasks, allTask}: any = useTaskList();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [tasks, setTasks] = useState<Array<{ title: string, desc: string }>>([]);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string >("");
  
  const openSheet = () => {
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedTaskIndex(0);
    setTitle('');
    setDesc('');
  };

  const onSave = async () => {
    const resp:any = await createNewTask(title, desc);
    const { data = {} } = resp;
    updateTask(data.id, data.title, data.description, false, data.status)
    if(resp && resp.data)
    {
        createTask();
        closeSheet();
    }
  }  
  const createTask = (): void => { 
    setTasks([...tasks, { title , desc }]);
    setTitle('');
    setDesc('');
  };

  const fetchTask = async()=>{
    try{
      const response=await axios.get(baseUrl + '/api/todos/');
      console.log({response})
      allTask(response.data)
    }catch(error){
      console.error('Error fetching tasks',error)
    }
  };

  useEffect(()=>{
      fetchTask();
      //eslint-disable-next-line
  },[]);
  
  return (
    <>
    <title>To-Do App</title>
    <div className=" p-10 pt-10 w-full h-16  flex flex-row justify-between align-center">
    <div className="ml-20 w-20 h-7 flex flex-row justify-item-start align-center self-start">
      <Image src={iconimg} width={20} height={15} className=" pt-4 self-start rounded-md" alt=""></Image>
      <h1 className=" pt-2 text-2xl font-['Urbanist'] self-start">Taski</h1>
    </div>
    <div className="flex flex-row w-24 h-10 align-center justify-content-center mr-20">
      <h1 className=" pt-2 text-xl text-black ml-2 font-['Urbanist']">John</h1>
      <Image src={john} width={42} height={42} alt="" className="ml-2" />
    </div>
  </div>
  {/* Welcome John */}
  
  <div className="mt-10 ml-20 w-48 h-9  flex flex-row justify-center items-center">
    <h1 className="ml-8 font-['Urbanist'] text-2xl font-bold leading-34 tracking-normal text-left"> Welcome,</h1>
    <h1 className="text-blue-500 font-['Urbanist'] text-2xl font-bold leading-34 tracking-normal text-left "> John.</h1>
  </div>
  <div className="w-56 h-5 ml-20 ">
    <p className=" ml-8 font-['Urbanist'] text-base font-medium leading-19 tracking-normal text-gray-500">Create tasks to achieve more.</p>
 </div>
  
    {/* Image */}
    {createdTasks.length == 0 && <div className="flex flex-row justify-center items-center">
    <Image src={list} width={148} height={144} alt="" className="mt-20"></Image>
  </div>}
            
  <div className="">
    <Sheet open={isSheetOpen} >
      <div className="flex flex-row justify-center items-center">
      {createdTasks.length == 0 && <SheetTrigger className=" p-4 flex flex-row justify-center items-center mt-5 w-39 h-12 rounded-xl gap-3 bg-blue-500 bg-opacity-10 text-blue-500" onClick={openSheet}>+ Create Task</SheetTrigger>}
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <h2 className="font-['Urbanist'] text-black text-base font-semibold leading-6 text-left">Create Task</h2>
            <h3 className=" text-rgba-63-61-86 font-['Urbanist'] text-sm font-medium leading-4.5 text-left w-27 h-17">Title</h3>
            <Input type="text" className=" font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86 h-17" placeholder="Enter text.. " onChange={(e) => {setTitle(e.target.value)}}/>
            <h3  className=" w-70 h-17 font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86">Description</h3>
            <Input type="text" placeholder="Enter Description.." className="font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86 h-56" onChange={(e) => {setDesc(e.target.value)}}/>
          </SheetTitle>
          <SheetDescription>
            <div>
              <h3 className=" w-70 h-17 font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86">Upload Screenshot</h3>
              <div className="w-32 h-32  rounded-md border-dotted border-1 border-black flex flex-row items-center justify-center">
                <Image src={ss} width={20} height={20} alt=""></Image>
              </div>
            </div>
            <div className="flex flex-row justify-between align-center pt-8 w-full">
              <Button variant="outline" className="w-[45%] h-12 font=['Urbanist'] p-5  rounded-12 border-1 border-solid  border-black gap-3 flex flex-row justify-center items-center " onClick={closeSheet}>Cancel</Button>
              <Button variant="outline" className="w-[45%] h-12 font=['Urbanist']  p-5 rounded-12 border-1 border-solid border-black gap-3 flex flex-row justify-center items-center bg-blue-500 bg-opacity-10 text-blue-600" onClick={onSave} >+ Create Task</Button>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>

    <Todos />
    </div>
</>
  );
}
