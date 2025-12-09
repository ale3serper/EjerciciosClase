import { gql } from "apollo-server"

export const typeDefs = gql`
    type User{
        _id: ID!
        username: String!
        email: String!
        createdAt: String!
    }
    
    type Project{
        _id: ID!
        name: String!
        description: String!
        startDate: String!
        endDate: String!
        owner: ID!
        members: [ID!]!
        tasks: [Task!]!
    }

    type Task{
        _id: ID!
        title: String!
        projectId: ID!
        assignedTo: ID!
        status: String!
        priority: String!
        dueDate: String!
    }

    type AuthPayload{
        token: String!
    }
    
    type Query {
        me: User
        myProjects: [Project!]!
        projectDetails(projectId: ID!): Project!
        users: [User!]!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        createProject(name:String!, description:String!, startDate: Int!, endDate:Int!, members: [ID!]!): Project!
        updateProject(id: ID!,name:String!, description:String!, startDate: Int!, endDate:Int!, members:[ID!]!): Project!
        deleteProject(id: ID!):Project!
        addMember(projectId: ID!, userId:ID!): Project!

        createTask(projectId: ID!, title: String!, assignedTo:ID!, status:String!, priority:String!, dueDate:Int!): Task!
        updateTaskStatus(taskId:ID!, status: String!):Task!

       
    }

`;