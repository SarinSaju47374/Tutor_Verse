import {createSlice} from '@reduxjs/toolkit';

const studentSlice = createSlice({
    name:"student",
    initialState:{
        user:null,
        loggedIn:false
    },
    reducers:{
        loginStudent: (state,action)=>{   
            state.user = action.payload;
        },
        logoutStudent : (state)=>{
            state.user = null;
        },
        changeStatus :(state,action)=>{
            state.loggedIn = action.payload
        },
        saveSlots:(state,action)=>{
            state.slots = action.payload;
        }
    }
})

export const {loginStudent,logoutStudent,changeStatus,saveSlots} = studentSlice.actions;
export default studentSlice.reducer