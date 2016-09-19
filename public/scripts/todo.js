console.log('js sourced');
var tasks = [];

$(document).ready(function(){
  console.log('JQ doc rdy');
// initial call to get any stores tasks in db
$.ajax({
  url: '/tasks',
  type: 'GET',
  success: function(data){
    for (var i = 0; i < data.length; i++) {
      tasks.push(data[i]);
    }
    console.log('tasks:', tasks);
    displayTasks();
    // $('#taskList').html()
  }
});// end get ajax call
// send new task to server and add to display
$('#submitTask').on('click', function(){
  console.log('in addtask');
  var objectToSend = {
    task: $('#taskIn').val(),
  }; // end objectToSend
  $.ajax({
    url:'/addTask',
    type: 'POST',
    data: objectToSend,
    success: function(data){
      console.log('new task in db:', data);
      tasks.push(data[0]);
      displayTasks();
    } // end success
  }); // emnd addTask ajax call
  $('#taskIn').val('');
});// end on click submitTask
// on click for delete function and confirmation box
$('body').on('click', '#deleteButton',  function(){
  var deleteMe = $(this).attr('data');
  var checkConfirm = confirm("Are you sure you want to delete this task?");
  if (checkConfirm === true) {
    deleteTask(deleteMe);
  }else {
  return;
  }

}); // end on click delete
// complete button get data to go to complete fuction
$('body').on('click', '#complete', function(){
  var completed = $(this).attr('data');
  //call completeTask
  completeTask(completed);
});
}); // end doc ready
// function to display all tasks on dom
var displayTasks = function(){
  console.log('in display tasks');
  var taskStatus = '';
  $('#taskList').empty();
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].complete === 'n'){
      taskStatus = $('#taskList').append('<li><span>' + tasks[i].task + '</span><br>status: Incomplete' + '<br><button id="deleteButton" data="' + i + '">Delete</button>' + ' ' + '<button id="complete" data=' + i + '>Mark as done!</button></li>');
    }else{
      taskStatus = $('#taskList').append('<li id="done"><span>' + tasks[i].task + '</span><br>status: Done!<br><button id="deleteButton" data=' + i + '>Delete</button></li>');
    }

    console.log('taskStatus:', taskStatus);
  }
};
// delete function
var deleteTask = function (selectedTask){
  console.log('in deleteTask');
  var objectToSend = {
    task: tasks[selectedTask].task
  };
  $.ajax({
    url:'/deleteTask',
    type:'POST',
    data: objectToSend,
    success: function(data) {
      console.log('delete post send:', data);
      console.log('task:', tasks);
      displayTasks();
      location.reload();
    }
  });// end ajax deleteTask
};
// ajax call to change to complete
var completeTask = function( selectedTask){
  console.log('in completeTask');

  var objectToSend = {
    task: tasks[selectedTask].task
  };
  $.ajax({
    url: '/completeTask',
    type:'POST',
    data: objectToSend,
    success: function(data) {
      console.log('complete success:', data);
      displayTasks();
      location.reload();
    }
  }); // end ajax completeTask
};
