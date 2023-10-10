import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import tutorReducer from "./slices/tutor/tutorSlice"; //importing the reducer
import studentReducer from "./slices/student/studentSlice"; //importing the reducer

const tutorPersistConfig = {
    key : "tutor",
    storage
}
const studentPersistConfig = {
    key : "student",
    storage
}

const persistedTutorReducer = persistReducer(tutorPersistConfig,tutorReducer)
const persistedStudentReducer = persistReducer(studentPersistConfig,studentReducer)

const store = configureStore({
    reducer:{     //something similar to combine reducers
        'tutor': persistedTutorReducer,
        'student': persistedStudentReducer
    }
})

export const persistor = persistStore(store);

export default store;