import User, { UserDocument } from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js'; 

interface CreateUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
  }
  
  interface LoginUserArgs {
    email: string;
    password: string;
  }
  
  interface UserArgs {
    username: string;
  }
  
  interface RemoveBookArgs {
    id: number, 
    bookId: string;
  }
  
  interface SaveBookArgs {
        id: number,
        title: string,
        authors: string[];
  }
  
  const resolvers = {
    Query: {
        users: async (): Promise<UserDocument[] | null> => {
            return User.find({}).populate('savedbooks');
          },
          user: async (_parent: any, { username }: UserArgs) => {
            return User.findOne({ username }).populate('savedbooks');
          },
   
    me: async (_parent: any, _args: any, context: any) => {
      //i just fixed the one error and all of a sudden the findones dont exist on the user anymore and theres 9 more errors
      //ahhhhhhhhhhh  
      // I gotta be honest i really dont know what im doing and am on the verge of a breakdown atm this is due tomorrow. pls fucking work
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('books');
        }
        // If the user is not authenticated, throw an AuthenticationError
        throw new AuthenticationError('Could not authenticate user.');
      },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: CreateUserArgs) => {
 
        const user = await User.create({ ...input });
      
        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);
      
        // Return the token and the user
        return { token, user };
      },
      
      loginUser: async (_parent: any, { email, password }: LoginUserArgs) => {
        // Find a user with the provided email
        const user = await User.findOne({ email });
      
        // If no user is found, throw an AuthenticationError
        if (!user) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        // Check if the provided password is correct
        const correctPw = await user.isCorrectPassword(password);
      
        // If the password is incorrect, throw an AuthenticationError
        if (!correctPw) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);
      
        // Return the token and the user
        return { token, user };
      },
      saveBook: async (_parent: any, { id, title, authors }: SaveBookArgs, context: any) => {
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $addToSet: {
                title: { title, authors },
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }
        throw AuthenticationError;
      },
      removeComment: async (_parent: any, { id, bookId }: RemoveBookArgs, context: any) => {
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: {
                savedBooks: {
                  _id: bookId,
                  commentAuthor: context.user.username,
                },
              },
            },
            { new: true }
          );
        }
        throw AuthenticationError;
      },
    }
  }

export default resolvers;