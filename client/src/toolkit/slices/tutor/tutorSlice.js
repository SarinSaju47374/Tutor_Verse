import {createSlice} from '@reduxjs/toolkit';

const tutorSlice = createSlice({
    name:"tutor",
    initialState:{
        user:null,
        courseTempId:null,
        slots:null
    },
    reducers:{
        loginTutor: (state,action)=>{   
            state.user = action.payload;
        },
        logoutTutor : (state)=>{
            state.user = null;
        },
        saveTempCourse: (state,action)=>{
            state.courseTempId = action.payload;
        },
        saveSlots:(state,action)=>{
            state.slots = action.payload;
        }
    }
})

export const {loginTutor,logoutTutor,saveTempCourse,saveSlots} = tutorSlice.actions;
export default tutorSlice.reducer