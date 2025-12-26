// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   db,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   orderBy,
// } from "../firebase";
// import { useAuth } from "./AuthContext";

// const TasksContext = createContext();

// export const useTasks = () => useContext(TasksContext);

// export const TasksProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [sort, setSort] = useState("due_date_asc");
//   const { user, role } = useAuth();

//   const fetchTasks = async () => {
//     if (!user) {
//       setTasks([]);
//       return;
//     }

//     let q = collection(db, "tasks");

//     if (role !== "admin") {
//       q = query(q, where("user_id", "==", user.uid));
//     }

//     if (filter !== "all") {
//       q = query(q, where("status", "==", filter));
//     }

//     const sortDir = sort.endsWith("_asc") ? "asc" : "desc";
//     q = query(
//       q,
//       orderBy(
//         sort === "due_date_asc" || sort === "due_date_desc"
//           ? "due_date"
//           : "created_at",
//         sortDir
//       )
//     );

//     const snapshot = await getDocs(q);
//     const tasksData = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setTasks(tasksData);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [user, filter, sort]);

//   const createTask = async (data) => {
//     await addDoc(collection(db, "tasks"), {
//       ...data,
//       user_id: user.uid,
//       status: data.status || "pending",
//       created_at: serverTimestamp(),
//       updated_at: serverTimestamp(),
//     });
//     await fetchTasks();
//   };

//   const updateTask = async (id, data) => {
//     await updateDoc(doc(db, "tasks", id), {
//       ...data,
//       updated_at: serverTimestamp(),
//     });
//     await fetchTasks();
//   };

//   const deleteTask = async (id) => {
//     await deleteDoc(doc(db, "tasks", id));
//     await fetchTasks();
//   };

//   return (
//     <TasksContext.Provider
//       value={{
//         tasks,
//         fetchTasks,
//         createTask,
//         updateTask,
//         deleteTask,
//         filter,
//         setFilter,
//         sort,
//         setSort,
//       }}
//     >
//       {children}
//     </TasksContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "../firebase";
import { useAuth } from "./AuthContext";

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("due_date_asc");
  const { user, role } = useAuth();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      let q = collection(db, "tasks");

      // Restrict to user's tasks unless admin
      if (role !== "admin") {
        q = query(q, where("user_id", "==", user.uid));
      }

      // Apply status filter if not "all"
      if (filter !== "all") {
        q = query(q, where("status", "==", filter));
      }

      // Determine sort field and direction
      let sortField = "created_at";
      let sortDirection = "desc";

      if (sort === "due_date_asc") {
        sortField = "due_date";
        sortDirection = "asc";
      } else if (sort === "due_date_desc") {
        sortField = "due_date";
        sortDirection = "desc";
      }

      // Apply sorting
      q = query(q, orderBy(sortField, sortDirection));

      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure consistent field types
        due_date: doc.data().due_date || null,
        timeSlot: doc.data().timeSlot || "", // ← Important for new feature
      }));

      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, filter, sort, role]); // Added role dependency for safety

  const createTask = async (data) => {
    await addDoc(collection(db, "tasks"), {
      ...data,
      user_id: user.uid,
      status: data.status || "pending",
      due_date: data.due_date || null,
      timeSlot: data.timeSlot || "", // ← Explicitly save timeSlot
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    await fetchTasks();
  };

  const updateTask = async (id, data) => {
    await updateDoc(doc(db, "tasks", id), {
      ...data,
      due_date: data.due_date || null,
      timeSlot: data.timeSlot || "", // ← Explicitly update timeSlot
      updated_at: serverTimestamp(),
    });
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    await fetchTasks();
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        filter,
        setFilter,
        sort,
        setSort,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
