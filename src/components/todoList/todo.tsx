import React, { useState } from 'react';
import { useTaskList } from '@/store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import editimg from "../images/edit.svg";
import newtask from "../images/newtask.svg";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import ss from "../images/ss.svg";
import deleteimg from "../images/delete.svg";
import { useEffect } from 'react';
import trash from "../images/trash.svg";
import deleteall from "../images/deleteall.svg"
import axios from 'axios';
import { baseUrl, createNewTask } from '@/helper/utils';

type TaskList = {
    id: number;
    title: string;
    description: string;
    showEdit: boolean;
    status: string;
};

const Todos = (props: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [tasks, setTasks] = useState<Array<{ title: string, desc: string }>>([]);
    const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
    const { updateTask, createdTasks, deleteTask, editTodoTasks, allTask, deleteAlltasks }: any = useTaskList();
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [hoveredTaskIndex, setHoveredTaskIndex] = useState<number | null>(null);
    const [completedTasks, setCompletedTasks] = useState<TaskList[]>([]);
    const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

    const openSheet = () => {
        setIsSheetOpen(true);
        setIsCheckboxChecked(false);
        createNewTask(title, desc);
    };

    const closeSheet = () => {
        setIsSheetOpen(false);
        setSelectedTaskIndex(0);
        setTitle('');
        setDesc('');
    };

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
        setShowCompletedTasks(true);
    };

    const update = async (id: number, selectedTitle = "", selectedDes = "") => {
        console.log({ id })
        try {
            const resp = await axios.put(`${baseUrl}/api/todos/${id}`, { title: selectedTitle || title, description: selectedDes || desc, status: selectedDes ? "completed" : "todo" });
            // updateTask(title, desc);
            if (resp) {
                const finalRes = createdTasks.map((res: TaskList) => {
                    if (res.id === resp.data.id) {
                        return {
                            ...resp,
                            id: resp.data.id,
                            title: resp.data.title,
                            description: resp.data.description,
                            showEdit: false,
                            status: resp.data.status,
                        }
                    } else {
                        return res
                    }
                })
                console.log({finalRes})
                allTask(finalRes)
            }
            setIsCheckboxChecked(false);
            closeSheet();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    const createTask = async () => {
        try {
            const resp= await createNewTask(title, desc);
            const {data = {}}: any = resp
            updateTask(data.id, data.title, data.description, false)
            setTitle('');
            setDesc('');
            closeSheet();

        } catch (error) {
            console.error('Error creating task:', error);
        }
    };
    const deleteTaskHandler = async (id: number) => {
        try {
            const resp = await axios.delete(`${baseUrl}/api/todos/${id}`);
            deleteTask(id)
            
        } catch (error) {
            console.error('Error deleting task:', error);
        }
        setSelectedTaskId(null);
    };

    const deleteCompletedtasks = async () => {
        try {
            const resp = await axios.delete(`${baseUrl}/api/todos/`);
            if (resp.status === 200) {
                allTask(resp.data)
                setShowCompletedTasks(false);
            } else {
                console.error('Failed to delete all tasks');
            }
        } catch (error) {
            // console.error('Error deleting all tasks:', error);
        }
    };

    const editTasks = (index: number) => {
        setSelectedTaskIndex(index);
        setDesc(createdTasks[index].description);
        setTitle(createdTasks[index].title);
        // editTodoTasks(index)
        setSelectedTaskId(null);
    };

    console.log({ createdTasks })
    return (
        <div>
            {createdTasks.length !== 0 && (
                <>
                    <h3 className=' ml-20 flex flex-row justify-center items-center font-bold font-[Urbanist]'>Created Tasks</h3>
                    <p className='ml-20 text-gray-500 flex flex-row justify-center items-center font-[Urbanist]'>{`You have ${createdTasks.length} task${createdTasks.length !== 1 ? 's' : ''} to do`}</p>
                    <div className="flex flex-col items-center justify-center ">
                        <Image src={newtask} alt="" onClick={openSheet} width={182} height={10} className="ml-48 self-start flex flew-row hover:bg-rgba-121-136-164-1 " ></Image>
                        {Array.isArray(createdTasks) && createdTasks.length !== 0 && createdTasks?.map((task: TaskList, index: number) => {
                            return (

                                (task.status === "todo") ?
                                    <>
                                        {/* {task.status === "todo" ? <p>todo</p> : <p>completed</p>} */}
                                        <div key={index} className='mt-5 bg-[rgba(245,247,249,1)] bg-opacity-100 flex flex-col justify-center items-center w-3/4 h-28 rounded-2xl relative' onMouseEnter={() => setHoveredTaskIndex(index)}
                                            onMouseLeave={() => setHoveredTaskIndex(null)}>
                                            {hoveredTaskIndex === index && (
                                                <>
                                                    <Dialog>
                                                        <DialogTrigger>
                        {/*  EDIT  */}
                                                            <Image src={editimg} alt="" onClick={() => { editTasks(index) }} width={28} height={28} className="absolute top-10 right-12 cursor-pointer"></Image>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit profile</DialogTitle>
                                                                <DialogDescription>
                                                                    Make changes to your profile here. Click save when you are done.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="title" className="text-right">
                                                                        Title
                                                                    </Label>
                                                                    <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="col-span-3" />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="desc" className="text-right">
                                                                        Description
                                                                    </Label>
                                                                    <Input id="desc" value={desc} onChange={(e) => { setDesc(e.target.value) }} className="col-span-3" />
                                                                </div>
                                                            </div>
                                                            <DialogClose>
                                                                <Button type="submit" onClick={() => {
                                                                    console.log({ task })
                                                                    update(task.id)
                                                                }}>Save changes</Button>
                                                            </DialogClose>
                                                        </DialogContent>
                                                    </Dialog>
                                                    {/* DELETE */}
                                                    <Image src={deleteimg} alt="" onClick={() => { deleteTaskHandler(task.id) }} width={28} height={28} className="absolute top-10 right-3 cursor-pointer"></Image>
                                                </>
                                            )}
                                            <div className='absolute flex flex-row justify-start self-start left-5 top-8'>
                                                <div className=''>
                                                    {/*CHECKBOXX */}
                                                    <Checkbox id={`checkbox-${index}`} className='w-4 h-4 ' checked={task.showEdit} onCheckedChange={() => {
                                                        setIsCheckboxChecked(!isCheckboxChecked);
                                                        task.status = "completed";
                                                        editTodoTasks(task.id, task.title, task.description, !task.showEdit, task.status)
                                                        update(task.id, task.title, task.description);
                                                        setShowCompletedTasks(true);
                                                    }} />
                                                    <Label htmlFor={`checkbox-${index}`}></Label>
                                                </div>
                                            </div>
                                            <div className={`absolute left-20 ${task.showEdit ? 'line-through' : ''}`}>

                                                <p onClick={() => {
                                                    if (selectedTaskId === task.id) {
                                                        setSelectedTaskId(null);
                                                    } else {
                                                        setSelectedTaskId(task.id);
                                                    }
                                                }} className='relative bottom-3 font-bold font-[Urbanist] '>
                                                    {task.title}
                                                </p>
                                                {selectedTaskId === task.id && (
                                                    <p className='relative bottom-2 text-rgba-141-156-184-1 font-[Urbanist]'>{task.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                    : <>
                                        <p></p>
                                    </>
                            )
                        }
                        )}
                    </div>

            {/* COMPLETED TASKS */}
                    
                    {Array.isArray(createdTasks) && createdTasks.some((task: any) => task?.status === "completed") && (
                        <div>
                            <h3 className='mt-12 ml-48 flex flex-row justify-start items-start font-bold font-[Urbanist]'>Completed Tasks</h3>
                            <div className='flex flex-row justify-end align-end mr-40'>
            {/* DELETE ALL */}
                                <Image src={deleteall} alt="" onClick={() => { deleteCompletedtasks() }} width={91} height={30} className=" rounded-l-8 px-3 py-1"></Image>
                            </div>
                        </div>)}
                    <div className="flex flex-col items-center justify-center">
                        {Array.isArray(createdTasks) && createdTasks.map((task: TaskList, index: number) => {
                            if (task.status === "completed") {
                                console.log("123456789")
                                return (
                                    <div key={index} className='mt-5 bg-[rgba(245,247,249,1)] bg-opacity-100 flex flex-col justify-center items-center w-3/4 h-28 rounded-2xl relative'>
                                        <div className={`absolute left-20 line-through`}>
                                            <p className='relative bottom-3 font-bold font-[Urbanist]'>{task.title}</p>
                                            <p className='relative bottom-2 text-rgba-141-156-184-1 font-[Urbanist]'>{task.description}</p>
                                        </div>
                                        <Image src={trash} alt="" onClick={() => { deleteTaskHandler(task.id) }} width={30} height={30} className="absolute right-5 cursor-pointer"></Image>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </>
            )}
            <Sheet open={isSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            <h2 className="font-['Urbanist'] text-black text-base font-semibold leading-6 text-left ">Create Task</h2>
                            <h3 className="text-rgba-63-61-86 font-['Urbanist'] text-sm font-medium leading-4.5 text-left w-27 h-17">Title</h3>
                            <Input type="text" className=" font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86 h-17" placeholder="Enter text.. " onChange={(e) => { setTitle(e.target.value) }} />
                            <h3 className=" w-70 h-17 font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86">Description</h3>
                            <Input type="text" placeholder="Enter Description.." className="font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86 h-56" onChange={(e) => { setDesc(e.target.value) }} />
                        </SheetTitle>
                        <SheetDescription>
                            <div>
                                <h3 className=" w-70 h-17 font-['Urbanist'] text-sm font-medium leading-4.5 text-left text-rgba-63-61-86">Upload Screenshot</h3>
                                <div className="w-32 h-32  rounded-md border-dotted border-1 border-black flex flex-row items-center justify-center">
                                    <Image src={ss} width={20} height={20} alt=""></Image>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between align-center pt-8 w-full">
                                <Button variant="outline" className="w-[45%] h-12 font-['Urbanist'] p-5  rounded-12 border-1 border-solid  border-black gap-3 flex flex-row justify-center items-center " onClick={closeSheet}>Cancel</Button>
                                <Button variant="outline" className="w-[45%] h-12 font-['Urbanist']  p-5 rounded-12 border-1 border-solid border-black gap-3 flex flex-row justify-center items-center bg-blue-500 bg-opacity-10 text-blue-600" onClick={() => {
                                    createTask()
                                }} >+ Create Task</Button>

                                {/* Checking Git Push */}
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default Todos;

