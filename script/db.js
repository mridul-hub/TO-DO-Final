let db;
let openRequest = indexedDB.open("To-do");

openRequest.addEventListener("success",(e)=>{
    console.log("DB Success");
    db = openRequest.result;
    showhomeTask();
    filtersetcat();
    editsetcat();
})
openRequest.addEventListener("error",(e)=>{
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("upgrading");
    db = openRequest.result;
    db.createObjectStore("task",{ keyPath:"id" });
    db.createObjectStore("category",{keyPath:"id"});
    db.createObjectStore("logs",{keyPath:"id"});
    const subtask = db.createObjectStore("subtasks",{keyPath:"id"});
    subtask.createIndex("taskget",["taskId"],{unique:false});
})