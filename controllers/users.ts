import { Request, Response } from 'express';
import { collections } from '../src/database';
import { User } from '../src/models/users';
import { ObjectId } from 'mongodb';
import { createUserSchema } from '../src/models/users';
import { date } from 'zod';


export const getUsers = async (req: Request, res: Response) => {

  try {

    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    res.status(200).send(users);

  } catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(500).send(`Unable to fetch user`);
 }

};


export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne(query)) as unknown as User;

    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};


export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); //for now still log the data

  const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.error.issues
    });
  }

  const { name,  phonenumber, email, dob } = req.body;
    const newUser : User = {name : name, phonenumber: phonenumber, email: email, dob : new Date(),
    dateJoined: new Date(), lastUpdate : new Date()}


  try {
    const result = await collections.users?.insertOne(newUser)

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
    }
    else {
      res.status(500).send("Failed to create a new user.");
    }
  }
  catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new user`);
  }
};


export const updateUser = (req: Request, res: Response) => {
  
  console.log(req.body); //for now just log the data

  res.json({"message": `update user ${req.params.id} with data from the post message`})
};

export const deleteUser = (req: Request, res: Response) => {
  // logic to delete user by ID from the database

  res.json({"message": `delete user ${req.params.id} from the database`})
};
