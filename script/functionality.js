const addTask = document.getElementById("add-task");
const newTask = document.getElementById("input");
const dataBody = document.getElementById("hero");
const newcat = document.getElementById("addcat");
const catInput = document.getElementById("cat-input-box");
const caterror = document.getElementById("error-message");
const addTaskcat = document.getElementById("addTaskcategory");
const showTask = document.getElementById("showTask");

let currentOrder;

function openBox(){
  closecatbox();
  appendCat();
  newTask.style.display = "block";
}

function closebox(){
    if(newTask.style.display === "block")
    {
        newTask.style.display = "none";
    }
    showhomeTask();
}

function catBoxopen(){
  closebox();
  newcat.style.display = "block";
}

function closecatbox(){
    if(newcat.style.display === "block")
    {
        newcat.style.display = "none";
    }
    filtersetcat();
}

function addCategory(){
  if(catInput.value === "")
  {
    ptag = document.createElement("p");
    ptag.innerHTML = "Please enter a value";
    setTimeout(function(){
      ptag.style.display = 'none';
    },10000);
    caterror.appendChild(ptag);
    return ;
  }
  if(db){
    let categoryid = shortid();
    let dbTransaction = db.transaction("category","readwrite");
    let categoryStore = dbTransaction.objectStore("category");
    let categorEntry = {
      id: categoryid,
      name: catInput.value
    } 
    let catres = categoryStore.getAll();
    catres.onsuccess = (e) =>{
          let obj = catres.result.find(o => o.name == catInput.value);
          if(obj){
            ptag = document.createElement("p");
            ptag.innerHTML = "Category Already Exists in DB";
            setTimeout(function(){ ptag.style.display = 'none';},10000);
            caterror.appendChild(ptag);
            return ;
          }
          else{
              categoryStore.add(categorEntry);
              catInput.value = "";
              ptag = document.createElement("p");
              ptag.innerHTML = "Successfully Added New category to DB";
              setTimeout(function(){ ptag.style.display = 'none';},10000);
              caterror.appendChild(ptag);
              return ;
          }
    }
  }
}

function appendCat(){
  if(db){
    addTaskcat.innerHTML = "";
    let dbTransaction = db.transaction("category","readonly");
    let categoryStore = dbTransaction.objectStore("category");
    let catres = categoryStore.getAll();
    catres.onsuccess = (e) =>{
    let allcat = catres.result;
    allcat.forEach(function (catItem) {
      optionTag = document.createElement("option");
      optionTag.value = catItem.name;
      optionTag.innerHTML = catItem.name;
      addTaskcat.appendChild(optionTag);
     });
    }
  }
};
function filtersetcat(){
  if(db){
    const filtercat = document.getElementById("filtercategory");
    filtercat.innerHTML ="";
    let dbTransaction = db.transaction("category","readonly");
    let categoryStore = dbTransaction.objectStore("category");
    let catres = categoryStore.getAll();
    catres.onsuccess = (e) =>{
    let allcat = catres.result;
    let optionTag = document.createElement("option");
    optionTag.value = "All";
    optionTag.innerHTML = "All";
    filtercat.appendChild(optionTag);
    allcat.forEach(function (catItem) {
      optionTag = document.createElement("option");
      optionTag.value = catItem.name;
      optionTag.innerHTML = catItem.name;
      filtercat.appendChild(optionTag);
     });
    }
  }
  
};
function addTaskDb(){
    let errorMessage  = document.getElementById("error-message-addtask");
    let taskDetail = document.getElementById("input-box");
    let dueDate = document.getElementById("duedate");
    let priority = document.getElementById("priority");
    let category = document.getElementById("addTaskcategory");
    let tags = document.getElementById("tagText");

    if(taskDetail.value==="")
    {
      ptag = document.createElement("p");
      ptag.innerHTML = "Add Task details";
      setTimeout(function(){ ptag.style.display = 'none';},3000);
      errorMessage.appendChild(ptag);
      return ;
    }
    if(dueDate.value ==="")
    {
      ptag = document.createElement("p");
      ptag.innerHTML = "Provide Due Date";
      setTimeout(function(){ ptag.style.display = 'none';},3000);
      errorMessage.appendChild(ptag);
      return ;
    }

    let taskid = shortid();
    let dbTransaction = db.transaction("task","readwrite");
    let taskStore = dbTransaction.objectStore("task");
    let taskEntry = {
      id: taskid,
      taskDetail: taskDetail.value,
      dueDate: dueDate.value,
      priority: priority.value,
      category: category.value,
      tags: tags.value,
      status: "false"
    }
    taskStore.add(taskEntry);
    taskDetail.value = "";
    dueDate.value = "";
    tags.value = "";
    ptag = document.createElement("p");
    ptag.innerHTML = "Task Added SuccessFully to DB";
    setTimeout(function(){ ptag.style.display = 'none';},4000);
    errorMessage.appendChild(ptag);
    return ;

}

function showhomeTask(){
  let dbTransaction = db.transaction("task","readwrite");
  let taskStore = dbTransaction.objectStore("task");
  let todayDate = new Date();
  let upcomingTask = []
  let tasks = taskStore.getAll();
  tasks.onsuccess = (e)=>{
    let alltasks = tasks.result;
    alltasks.forEach(function (taskItem) {
      const d1 = Date.parse(taskItem.dueDate);
      if(d1>=todayDate)
      {
        upcomingTask.push(taskItem);
      }
     });
     upcomingTask.sort(function(a, b) {
      var keyA = new Date(a.dueDate),
        keyB = new Date(b.dueDate);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    showTask.innerHTML = "";
    currentOrder = upcomingTask;
    upcomingTask.forEach(function(taskItem){
         let date = document.createElement("div")
         date.className = "date-task";
         date.id = taskItem.id;
         let ptag1 = document.createElement("p");
         ptag1.className = "date-head";
         ptag1.innerHTML = taskItem.dueDate;
         date.appendChild(ptag1);
         let additional = document.createElement("div");
         additional.className = "additional-detail";

         let ptag4 = document.createElement("p");
         ptag4.innerHTML = "Category" + ": " + taskItem.category;
         additional.appendChild(ptag4);

         let ptag5 = document.createElement("p");
         ptag5.innerHTML = "Priority" + ": " + taskItem.priority;
         additional.appendChild(ptag5);


         let ptag7 = document.createElement("p");
         if(taskItem.status==="false")
         {
          ptag7.innerHTML = "Status" + ": " + "Incomplete";
         }
         else{
          ptag7.innerHTML = "Status" + ": " + "Complete";
         }
         additional.appendChild(ptag7);


         let ptag6 = document.createElement("p");
         ptag6.innerHTML = "Tags" + ": " + taskItem.tags;
         additional.appendChild(ptag6);
         date.appendChild(additional);
         let oneTask = document.createElement("div");
         oneTask.className = "one-task";
         let detailRow = document.createElement("div");
         detailRow.className = "detail-row";
         let ptag2 =document.createElement("p");
         ptag2.className = "details";
         ptag2.innerHTML = taskItem.taskDetail;
         detailRow.appendChild(ptag2);
         let but1 = document.createElement("button");
         but1.innerHTML = "Mark Complete"; 
         but1.id = taskItem.id;
         but1.className = "Mark-complete";

         let but2 = document.createElement("button");
         but2.innerHTML = "Edit"; 
         but2.id = taskItem.id;
         but2.className = "edit";

         let but3 = document.createElement("button");
         but3.innerHTML = "Delete";
         but3.id = taskItem.id;
         but3.className = "delete";

         let but4 = document.createElement("button");
         but4.innerHTML = "Mark Uncomplete";
         but4.id = taskItem.id;
         but4.className = "Mark-uncomplete"
    

         detailRow.appendChild(but1);
         detailRow.appendChild(but2); 
         detailRow.appendChild(but3);
         detailRow.appendChild(but4);
         let subtask = document.createElement("div");
         subtask.className = "subtasks";
         let ul = document.createElement("ul");
         let li = document.createElement("li");
         ul.appendChild(li);
         subtask.appendChild(ul);
         oneTask.appendChild(detailRow);
         oneTask.appendChild(subtask);
         date.appendChild(oneTask);
         showTask.appendChild(date);  

    });
    }
  }

function filterData(){
  const catgfilt = document.getElementById("filtercategory");
  const priofilt = document.getElementById("priorityfilter");
  const startdate = document.getElementById("startdate");
  const enddate = document.getElementById("Enddate");
  const status = document.getElementById("status");
  let dbTransaction = db.transaction("task","readwrite");
  let taskStore = dbTransaction.objectStore("task");
  let upcomingTask = []
  let tasks = taskStore.getAll();
  tasks.onsuccess = (e)=>{
    let alltasks = tasks.result;
    alltasks.forEach(function (taskItem) {
      let d2 = Date.parse(taskItem.dueDate);
      let d3 = startdate.value;
      if(startdate.value!=""){
        d3 = Date.parse(startdate.value);
      }
      let d4 = enddate.value;
      if(startdate.value!=""){
        d4 = Date.parse(enddate.value);
      }
      let flag = false;
      if(status.value==="true")
      {
        flag  = true;
      }
      if(catgfilt.value==="All"||catgfilt.value===taskItem.category)
      {
        if(priofilt.value=="All"||priofilt.value===taskItem.priority)
        {
            if(startdate.value===""||d2>=d3)
            {
                if(enddate.value===""||d2<=d4)
                {    
                     if(status.value==="All"||status.value===taskItem.status)
                     {
                       upcomingTask.push(taskItem);
                     }
                }
            } 
        }
      }
     });
     upcomingTask.sort(function(a, b) {
      var keyA = new Date(a.dueDate),
        keyB = new Date(b.dueDate);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    currentOrder = upcomingTask;
    showTask.innerHTML = "";
    upcomingTask.forEach(function(taskItem){
         let date = document.createElement("div")
         date.className = "date-task";
         date.id = taskItem.id;
         let ptag1 = document.createElement("p");
         ptag1.className = "date-head";
         ptag1.innerHTML = taskItem.dueDate;
         date.appendChild(ptag1);
         let additional = document.createElement("div");
         additional.className = "additional-detail";

         let ptag4 = document.createElement("p");
         ptag4.innerHTML = "Category" + ": " + taskItem.category;
         additional.appendChild(ptag4);

         let ptag5 = document.createElement("p");
         ptag5.innerHTML = "Priority" + ": " + taskItem.priority;
         additional.appendChild(ptag5);

         let ptag7 = document.createElement("p");
         if(taskItem.status==="false")
         {
          ptag7.innerHTML = "Status" + ": " + "Incomplete";
         }
         else{
          ptag7.innerHTML = "Status" + ": " + "Complete";
         }
         additional.appendChild(ptag7);
         let ptag6 = document.createElement("p");
         ptag6.innerHTML = "Tags" + ": " + taskItem.tags;
         additional.appendChild(ptag6);
         date.appendChild(additional);
         let oneTask = document.createElement("div");
         oneTask.className = "one-task";
         let detailRow = document.createElement("div");
         detailRow.className = "detail-row";
         let ptag2 =document.createElement("p");
         ptag2.className = "details";
         ptag2.innerHTML = taskItem.taskDetail;
         detailRow.appendChild(ptag2);
         let but1 = document.createElement("button");
         but1.innerHTML = "Mark Complete"; 
         but1.id = taskItem.id;
         but1.className = "Mark-complete";

         let but2 = document.createElement("button");
         but2.innerHTML = "Edit"; 
         but2.id = taskItem.id;
         but2.className = "edit";

         let but3 = document.createElement("button");
         but3.innerHTML = "Delete";
         but3.id = taskItem.id;
         but3.className = "delete";

         let but4 = document.createElement("button");
         but4.innerHTML = "Mark Uncomplete";
         but4.id = taskItem.id;
         but4.className = "Mark-uncomplete"
    

         detailRow.appendChild(but1);
         detailRow.appendChild(but2); 
         detailRow.appendChild(but3);
         detailRow.appendChild(but4);
         let subtask = document.createElement("div");
         subtask.className = "subtasks";
         let ul = document.createElement("ul");
         let li = document.createElement("li");
         ul.appendChild(li);
         subtask.appendChild(ul);
         oneTask.appendChild(detailRow);
         oneTask.appendChild(subtask);
         date.appendChild(oneTask);
         showTask.appendChild(date);  

    });
    }
}
function sortbyDate(){
  let upcomingTask = currentOrder;
  upcomingTask.sort(function(a, b) {
    var keyA = new Date(a.dueDate),
      keyB = new Date(b.dueDate);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  currentOrder = upcomingTask;
  showTask.innerHTML = "";
  upcomingTask.forEach(function(taskItem){
       let date = document.createElement("div")
       date.className = "date-task";
       date.id = taskItem.id;
       let ptag1 = document.createElement("p");
       ptag1.className = "date-head";
       ptag1.innerHTML = taskItem.dueDate;
       date.appendChild(ptag1);
       let additional = document.createElement("div");
       additional.className = "additional-detail";

       let ptag4 = document.createElement("p");
       ptag4.innerHTML = "Category" + ": " + taskItem.category;
       additional.appendChild(ptag4);

       let ptag5 = document.createElement("p");
       ptag5.innerHTML = "Priority" + ": " + taskItem.priority;
       additional.appendChild(ptag5);

       let ptag7 = document.createElement("p");
         if(taskItem.status==="false")
         {
          ptag7.innerHTML = "Status" + ": " + "Incomplete";
         }
         else{
          ptag7.innerHTML = "Status" + ": " + "Complete";
         }
         additional.appendChild(ptag7);

       let ptag6 = document.createElement("p");
       ptag6.innerHTML = "Tags" + ": " + taskItem.tags;
       additional.appendChild(ptag6);
       date.appendChild(additional);
       let oneTask = document.createElement("div");
       oneTask.className = "one-task";
       let detailRow = document.createElement("div");
       detailRow.className = "detail-row";
       let ptag2 =document.createElement("p");
       ptag2.className = "details";
       ptag2.innerHTML = taskItem.taskDetail;
       detailRow.appendChild(ptag2);
       let but1 = document.createElement("button");
         but1.innerHTML = "Mark Complete"; 
         but1.id = taskItem.id;
         but1.className = "Mark-complete";

         let but2 = document.createElement("button");
         but2.innerHTML = "Edit"; 
         but2.id = taskItem.id;
         but2.className = "edit";

         let but3 = document.createElement("button");
         but3.innerHTML = "Delete";
         but3.id = taskItem.id;
         but3.className = "delete";

         let but4 = document.createElement("button");
         but4.innerHTML = "Mark Uncomplete";
         but4.id = taskItem.id;
         but4.className = "Mark-uncomplete"
    

         detailRow.appendChild(but1);
         detailRow.appendChild(but2); 
         detailRow.appendChild(but3);
         detailRow.appendChild(but4);
       let subtask = document.createElement("div");
       subtask.className = "subtasks";
       let ul = document.createElement("ul");
       let li = document.createElement("li");
       ul.appendChild(li);
       subtask.appendChild(ul);
       oneTask.appendChild(detailRow);
       oneTask.appendChild(subtask);
       date.appendChild(oneTask);
       showTask.appendChild(date);  

  });
}
function sortbyprty(){
  let upcomingTask = currentOrder;
  upcomingTask.sort(function(a, b) {
    var keyA = a.priority,
      keyB = b.priority;
    if(keyB === "High") return 1;
    if (keyB === "Medium"&& keyA === "Low") return 1;
    else return -1;
  });
  currentOrder = upcomingTask;
  showTask.innerHTML = "";
  upcomingTask.forEach(function(taskItem){
       let date = document.createElement("div")
       date.className = "date-task";
       date.id = taskItem.id;
       let ptag1 = document.createElement("p");
       ptag1.className = "date-head";
       ptag1.innerHTML = taskItem.dueDate;
       date.appendChild(ptag1);
       let additional = document.createElement("div");
       additional.className = "additional-detail";

       let ptag4 = document.createElement("p");
       ptag4.innerHTML = "Category" + ": " + taskItem.category;
       additional.appendChild(ptag4);

       let ptag5 = document.createElement("p");
       ptag5.innerHTML = "Priority" + ": " + taskItem.priority;
       additional.appendChild(ptag5);

       let ptag7 = document.createElement("p");
       if(taskItem.status==="false")
       {
        ptag7.innerHTML = "Status" + ": " + "Incomplete";
       }
       else{
        ptag7.innerHTML = "Status" + ": " + "Complete";
       }
       additional.appendChild(ptag7);

       let ptag6 = document.createElement("p");
       ptag6.innerHTML = "Tags" + ": " + taskItem.tags;
       additional.appendChild(ptag6);
       date.appendChild(additional);
       let oneTask = document.createElement("div");
       oneTask.className = "one-task";
       let detailRow = document.createElement("div");
       detailRow.className = "detail-row";
       let ptag2 =document.createElement("p");
       ptag2.className = "details";
       ptag2.innerHTML = taskItem.taskDetail;
       detailRow.appendChild(ptag2);
       let but1 = document.createElement("button");
       but1.innerHTML = "Mark Complete"; 
       but1.id = taskItem.id;
       but1.className = "Mark-complete";

       let but2 = document.createElement("button");
       but2.innerHTML = "Edit"; 
       but2.id = taskItem.id;
       but2.className = "edit";

       let but3 = document.createElement("button");
       but3.innerHTML = "Delete";
       but3.id = taskItem.id;
       but3.className = "delete";

       let but4 = document.createElement("button");
       but4.innerHTML = "Mark Uncomplete";
       but4.id = taskItem.id;
       but4.className = "Mark-uncomplete"
  

       detailRow.appendChild(but1);
       detailRow.appendChild(but2); 
       detailRow.appendChild(but3);
       detailRow.appendChild(but4);
       let subtask = document.createElement("div");
       subtask.className = "subtasks";
       let ul = document.createElement("ul");
       let li = document.createElement("li");
       ul.appendChild(li);
       subtask.appendChild(ul);
       oneTask.appendChild(detailRow);
       oneTask.appendChild(subtask);
       date.appendChild(oneTask);
       showTask.appendChild(date);  

  });

}

function sortbysts(){
  let upcomingTask = currentOrder;
  upcomingTask.sort(function(a, b) {
    var keyA = a.status,
      keyB = b.status;
    if(keyB === "false") return 1;
    else return -1;
  });
  currentOrder = upcomingTask;
  showTask.innerHTML = "";
  upcomingTask.forEach(function(taskItem){
       let date = document.createElement("div")
       date.className = "date-task";
       date.id = taskItem.id;
       let ptag1 = document.createElement("p");
       ptag1.className = "date-head";
       ptag1.innerHTML = taskItem.dueDate;
       date.appendChild(ptag1);
       let additional = document.createElement("div");
       additional.className = "additional-detail";

       let ptag4 = document.createElement("p");
       ptag4.innerHTML = "Category" + ": " + taskItem.category;
       additional.appendChild(ptag4);

       let ptag5 = document.createElement("p");
       ptag5.innerHTML = "Priority" + ": " + taskItem.priority;
       additional.appendChild(ptag5);


       let ptag7 = document.createElement("p");
         if(taskItem.status==="false")
         {
          ptag7.innerHTML = "Status" + ": " + "Incomplete";
         }
         else{
          ptag7.innerHTML = "Status" + ": " + "Complete";
         }
         additional.appendChild(ptag7);

       let ptag6 = document.createElement("p");
       ptag6.innerHTML = "Tags" + ": " + taskItem.tags;
       additional.appendChild(ptag6);
       date.appendChild(additional);
       let oneTask = document.createElement("div");
       oneTask.className = "one-task";
       let detailRow = document.createElement("div");
       detailRow.className = "detail-row";
       let ptag2 =document.createElement("p");
       ptag2.className = "details";
       ptag2.innerHTML = taskItem.taskDetail;
       detailRow.appendChild(ptag2);
       let but1 = document.createElement("button");
         but1.innerHTML = "Mark Complete"; 
         but1.id = taskItem.id;
         but1.className = "Mark-complete";

         let but2 = document.createElement("button");
         but2.innerHTML = "Edit"; 
         but2.id = taskItem.id;
         but2.className = "edit";

         let but3 = document.createElement("button");
         but3.innerHTML = "Delete";
         but3.id = taskItem.id;
         but3.className = "delete";

         let but4 = document.createElement("button");
         but4.innerHTML = "Mark Uncomplete";
         but4.id = taskItem.id;
         but4.className = "Mark-uncomplete"
    

         detailRow.appendChild(but1);
         detailRow.appendChild(but2); 
         detailRow.appendChild(but3);
         detailRow.appendChild(but4);
       let subtask = document.createElement("div");
       subtask.className = "subtasks";
       let ul = document.createElement("ul");
       let li = document.createElement("li");
       ul.appendChild(li);
       subtask.appendChild(ul);
       oneTask.appendChild(detailRow);
       oneTask.appendChild(subtask);
       date.appendChild(oneTask);
       showTask.appendChild(date);  

  });
}



document.body.addEventListener('click',function(e){
  let dbTransaction = db.transaction("task","readwrite");
  let taskStore = dbTransaction.objectStore("task");
  if(e.target.className=="edit")
  {
      editTask(e.target.id);
  }
  if(e.target.className==="delete")
  {
      let res = taskStore.delete(e.target.id);
      res.onsuccess = (e) =>{
        alert("Deleted Successfully");
        showhomeTask();
      }
  }
  if(e.target.className ==="Mark-complete"){
    let res = taskStore.get(e.target.id);
    res.onsuccess =(e) =>{
      res.result.status = "true";
      let res2 = taskStore.put(res.result);
      res2.onsuccess = (e) =>{
        alert("Marked Completed Successfully");
        showhomeTask();
      }
    }
  }
  if(e.target.className === "Mark-uncomplete")
  {
    let res = taskStore.get(e.target.id);
    res.onsuccess =(e) =>{
      res.result.status = "false";
      let res2 = taskStore.put(res.result);
      res2.onsuccess = (e) =>{
        alert("Marked Uncomplete");
        showhomeTask();
      }
    }
  }
})

const editInput = document.getElementById("editinput");
const editInputBox = document.getElementById("edit-input-box");
const editdue = document.getElementById("edit-duedate");
const editprty = document.getElementById("edit-priority");
const editcat = document.getElementById("editTaskcategory");
const tagedit = document.getElementById("edittagText");
const holder = document.getElementById("idholder");

function editTask(id){
  closecatbox();
  closebox();
  let dbTransaction = db.transaction("task","readwrite");
  let taskStore = dbTransaction.objectStore("task");
  let res = taskStore.get(id);
  res.onsuccess = (e)=>{
    editInput.style.display = "block";
    editInputBox.value = res.result.taskDetail;
    editdue.value = res.result.dueDate;
    editprty.value = res.result.priority;
    editcat.value = res.result.category;
    tagedit.value = res.result.tags;
    holder.innerHTML = "Edit Task ID :" + id;
  }
  
}

function closeeditbox(){
  editInput.style.display = "none";
}

function editsetcat(){
  if(db){

    editcat.innerHTML ="";
    let dbTransaction = db.transaction("category","readonly");
    let categoryStore = dbTransaction.objectStore("category");
    let catres = categoryStore.getAll();
    catres.onsuccess = (e) =>{
    let allcat = catres.result;
    allcat.forEach(function (catItem) {
      optionTag = document.createElement("option");
      optionTag.value = catItem.name;
      optionTag.innerHTML = catItem.name;
      editcat.appendChild(optionTag);
     });
    }
  }
  
};

function editTaskDb(){
  let id = holder.innerHTML.slice(14);
  let dbTransaction = db.transaction("task","readwrite");
  let taskStore = dbTransaction.objectStore("task");
  let res = taskStore.get(id);
  res.onsuccess = (e)=>{
    res.result.taskDetail = editInputBox.value;
    res.result.dueDate = editdue.value;
    res.result.priority = editprty.value;
    res.result.category = editcat.value;
    res.result.tags = tagedit.value ;
    let res2 = taskStore.put(res.result);
    res2.onsuccess =(e)=>{
      closeeditbox();
      showhomeTask();
      alert("Task Updated Successfully");
    } 
  }

}