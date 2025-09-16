import { createContext } from "react";

export const UserDetailContext = createContext();

// export const UserDetailProvider = ({children}) => {
//     const [user, setUser] = useState();
//     return (
//         <UserDetailContext.Provider value={{user, setUser}}>
//             {children}
//         </UserDetailContext.Provider>
//     )
// }