import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { signToken } from "../auth";
import { Project } from "../types/Projects";
import { Task } from "../types/Tasks";
import { User } from "../types/Users";
import { AuthPayload } from "../types/AuthPayload";
import { createUser, validateUser } from "../collections/users";

const projectCollection="proyectos";
const userCollection="users";
const tasksCollection="tasks";

export const resolvers: IResolvers = {
    Query: {
        me : async (__,_, {user})=>{
            if(!user)  throw new Error ("No tienes credenciales");
            return {id:user._id.toString(),
            ...user}
    },
        myProjects: async(__,_,{user})=>{
            if(!user) throw new Error ("No tienes credenciales");

            const db= getDB();
            return db.collection(projectCollection).find({
            $or:[
            {owner:new ObjectId(user._id)},
            {members: new ObjectId(user._id)}        
            ]
        }).toArray();
    },
        projectDetails: async (__, {projectId}:{projectId:string},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");

            const db= getDB();
            return await db.collection(projectCollection).findOne({_id: new ObjectId(projectId)})
    },
        users: async (__,_,{user})=>{
            if(!user) throw new Error ("No tienes credenciales");

            const db= getDB();
            return await db.collection(userCollection).find().toArray();

    }
    },
   Projects: {
    tasks: async(parent: Project)=>{
        const db= getDB();
        return await db.collection<Task>(tasksCollection).find({ projectId: new ObjectId(parent._id) }).toArray();
    },
    members: async(parent: Project)=>{
        const db= getDB();

        if (!parent.members || parent.members.length === 0) {
            return [];
        }

        const listOfMembers= parent.members.map((id)=>
            id instanceof ObjectId ? id : new ObjectId(id)
        );

        const members= await db.collection<User>(userCollection).find({_id:{$in: listOfMembers}}).toArray();
        
        return members;
    }

    },
    Mutation:{
       register: async(_,{username,email,password}:{username:string,email:string,password:string})=>{
        const userId= await createUser(username,email,password);
        const token= signToken(userId);
       
        const payload: AuthPayload={
            token
        }
        return payload;
       },
       login: async(_,{email,password}:{email: string, password: string})=>{
        const user= await validateUser(email,password);
        if(!user) throw new Error("El login esta mal hecho");
        const token= signToken(user._id.toString());
        
        const payload: AuthPayload={
            token
        }
        return payload;
       },
       createProject: async(_,{name,description,startDate,endDate,members}:{name:string,description:string,startDate:Date,endDate:Date,members:ObjectId[]},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");

            const db= getDB();
            if(endDate < startDate)throw new Error("Fecha de inicio invalida");
            const newProject= await db.collection(projectCollection).insertOne({
                name, description, startDate, endDate, members
            });

            return {
                _id: newProject.insertedId,
                name,
                description,
                startDate,
                endDate,
                members
            }
       },
       updateProject: async(_,{id,name,description,startDate,endDate,members}:{id: ObjectId,name:string,description:string,startDate:Date,endDate:Date, members:ObjectId[]},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");
            const db= getDB();

            const actualProject= await db.collection(projectCollection).findOne({_id: new ObjectId(id)});
            if(!actualProject) throw new Error ("No existe ese proyecto");

            const ownerComprobation= user._id.toString();
            const owner= actualProject.owner.toString();
            if(owner!== ownerComprobation) throw new Error("No eres el dueño del proyecto");

            const datosActualizados = {
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                members: members.map(m => new ObjectId(m)),
            };

            const projectActualizado= await db.collection<Project>(projectCollection).updateOne({_id: new ObjectId(id)},
                {$set: 
                    datosActualizados
            });
            return projectActualizado;

       },
       deleteProject: async(_, {id}:{id: ObjectId},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");
            const db= getDB();

            const actualProject= await db.collection(projectCollection).findOne({_id: new ObjectId(id)});
            if(!actualProject) throw new Error ("No existe ese proyecto");

            const ownerComprobation= user._id.toString();
            const owner= actualProject.owner._id.toString();
            if(owner!== ownerComprobation) throw new Error("No eres el dueño del proyecto");

            await db.collection(projectCollection).deleteOne({_id: new ObjectId(id)});
            await db.collection(tasksCollection).deleteMany({proyectId: id});

            return actualProject;
       },
       addMember: async(_,{projectId,userId}:{projectId: ObjectId,userId: ObjectId},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");
            const db= getDB();

            const actualProject= await db.collection(projectCollection).findOne({_id: new ObjectId(projectId)});
            if(!actualProject) throw new Error ("No existe ese proyecto");

            const ownerComprobation= user._id.toString();
            const owner= actualProject.owner._id.toString();
            if(owner!== ownerComprobation) throw new Error("No eres el dueño del proyecto");

            const usuario= await db.collection(userCollection).findOne({_id: new ObjectId(userId)});
            if(!usuario) throw new Error("El usuario que quieres añadir no existe");

            actualProject.members.push(usuario._id);
            const miembrosactualizados= await db.collection(projectCollection).updateOne({_id: new ObjectId(projectId)},{
                $set:{
                    members:actualProject.members
                }
            });

            return miembrosactualizados;

       },
       createTask: async(_,{projectId,title,assignedTo, status, priority, dueDate}:{projectId: ObjectId,title:string, assignedTo: ObjectId, status: string, priority:string, dueDate: Date},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");

            const db= getDB();

            const actualProject= await db.collection(projectCollection).findOne({_id: new ObjectId(projectId)});
            if(!actualProject) throw new Error ("No existe ese proyecto");

            const ownerComprobation= user._id.toString();
            const owner= actualProject.owner._id.toString();
            const miembroComprobation= user._id.toString();
            const miembro= actualProject.members?.some((id: ObjectId)=> id.toString() === user._id.toString());
            if(owner!== ownerComprobation && miembroComprobation!==miembro) throw new Error("No eres el dueño del proyecto ni miembro");

            if (status !== "PENDING" && status !== "IN PROGRESS" && status !== "COMPLETED") {
                throw new Error("Status incorrecto");
            }

            if (priority !== "LOW" && priority !== "HIGH" && priority !== "MEDIUM") {
                throw new Error("Prioridad incorrecta");
            }

            const newTask= await db.collection(projectCollection).insertOne({
                title, projectId, assignedTo, status, priority, dueDate
            })

            return {
                _id: newTask.insertedId,
                title,
                projectId,
                assignedTo,
                status,
                priority,
                dueDate
            }

       },
       updateTaskStatus: async(_,{taskId,status}:{taskId: ObjectId,status: string},{user})=>{
            if(!user) throw new Error ("No tienes credenciales");
            const db= getDB();

            const existe= await db.collection(tasksCollection).findOne({_id: new ObjectId(taskId)});
            if(!existe) throw new Error("No existe la tarea que quieres actualizar");

            const tareaActualizada= await db.collection(tasksCollection).updateOne({_id: new ObjectId(taskId)},{
                $set:{
                    status
                }
            });

            return await db.collection(tasksCollection).findOne({ _id: new ObjectId(taskId) });
       }
    }
}