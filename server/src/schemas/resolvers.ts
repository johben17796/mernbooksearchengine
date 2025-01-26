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
   
    me: async (_parent: any, _args: any, _context: any) => {
      //i just fixed the one error and all of a sudden the findones dont exist on the user anymore and theres 9 more errors
      //ahhhhhhhhhhh  
      // I gotta be honest i really dont know what im doing and am on the verge of a breakdown atm this is due tomorrow. pls fucking work
        if (_context.user) {
          return User.findOne({ _id: _context.user._id }).populate('books');
        }
        // If the user is not authenticated, throw an AuthenticationError
        throw new AuthenticationError('Could not authenticate user.');
      
      },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: CreateUserArgs) => {
 
        const user = await User.create({ ...input });
      

        const token = signToken(user.username, user.email, user._id);

        return { token, user };
      },
      
      loginUser: async (_parent: any, { email, password }: LoginUserArgs) => {
        const user = await User.findOne({ email });
      
        if (!user) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        const token = signToken(user.username, user.email, user._id);
      
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
      removeBook: async (_parent: any, { id, bookId }: RemoveBookArgs, context: any) => {
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: {
                savedBooks: {
                  _id: bookId
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