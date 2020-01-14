var mysql = require("mysql");
//var inquirer = require("inquirer");
var inquirer = require("inquirer");
// create the connection information for the sql database
var consTable = require("console.table")
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Se9ura1928820",
  database: "employee_tracker"
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  //start();
  console.log("connected as id " + connection.threadId + "\n");

  start();
});

/*function afterConnection() {
  connection.query("SELECT * FROM employee_tracker.department", function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
}*/

function start() {
  inquirer
    .prompt({
      name: "startMessage",
      type: "list",
      message: "What would you like to do",
      choices: ["View Employees", "View Department", "View Role", "View All"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.startMessage === "View Employees") {
        viewEmployees();
      }
      else if (answer.startMessage === "View Department") {
        viewDepartment();
      }
      else if (answer.startMessage === "View Role") {
        viewRole();
      }
      else if (answer.startMessage === "View All") {
        viewAll();
      }
    });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee_tracker.employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    secondQuestion();
  });
}

function viewDepartment() {
  connection.query("SELECT * FROM employee_tracker.department", function (err, res) {
    if (err) throw err;
    console.table(res);
    secondQuestion();
  });
}

function viewRole() {
  connection.query("SELECT * FROM employee_tracker.role", function (err, res) {
    if (err) throw err;
    console.table(res);
    secondQuestion();
  });
}

function viewAll() {
  connection.query(

    `SELECT employee.id, employee.first_name, employee.last_name , role.title, role.salary, department.dept_name 
        FROM employee_tracker.employee 
        LEFT JOIN employee_tracker.role
        ON employee.id = role.id
        LEFT JOIN employee_tracker.department
        ON role.id = department.id`,

    function (err, res) {
      if (err) throw err;
      console.table(res);
      secondQuestion();
    });
}

function secondQuestion() {
  inquirer
    .prompt({
      name: "optionPrompt",
      type: "list",
      message: "What would you like to do ",
      choices: ["EDIT", "BACK", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.optionPrompt === "EDIT") {
        editEmployee();
      }
      else if (answer.optionPrompt === "BACK") {
        start();
      }
      else if (answer.optionPrompt === "EXIT") {
        connection.end();
      }

    });
}

function editEmployee() {
  inquirer
    .prompt({
      name: "editPrompt",
      type: "list",
      message: "What would you like to do ",
      choices: ["ADD EMPLOYEE", "REMOVE EMPLOYEE", "CHANGE TITLE", "BACK", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.editPrompt === "EDIT") {
        editEmployee();
      }
      else if (answer.editPrompt === "ADD EMPLOYEE") {
        addEmployee()
      }
      else if (answer.editPrompt === "REMOVE EMPLOYEE") {
        removeEmployee()
      }
      else if (answer.editPrompt === "CHANGE TITLE") {
        changeTitle()
      }
      else if (answer.editPrompt === "BACK") {
        start();
      }
      else if (answer.editPrompt === "EXIT") {
        connection.end();
      }

    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter First Name"
      },

      {
        name: "lastName",
        type: "input",
        message: "Enter Last Name"
      },




    ])
    .then(function (answer) {
      connection.query(`

                INSERT INTO employee 
                SET ?
              
                `
        ,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,

        },



        function (err) {
          if (err) throw err;
          console.log("Employee has been added");
          addRole();
        }
      )
    })
}

function addRole() {
  inquirer
    .prompt([


      {
        name: "title",
        type: "input",
        message: "Enter Title",
      },

      {
        name: "salary",
        type: "input",
        message: "Enter Salary"
      },


    ])
    .then(function (answer) {
      connection.query(`

                INSERT INTO role
                SET ?
              
                `
        ,
        {
          title: answer.title,
          salary: answer.salary
        },



        function (err) {
          if (err) throw err;
          console.log("Pay and Position Have been added to employee ");
          addDepartment();
        }
      )
    })
  }
  function addDepartment() {
    inquirer
      .prompt([


        {
          name: "department",
          type: "input",
          message: "Assign department to new employee",
        },




      ])
      .then(function (answer) {
        connection.query(`
    
                    INSERT INTO department
                    SET ?
                  
                    `
          ,
          {
            dept_name: answer.department

          },



          function (err) {
            if (err) throw err;
            console.log("Department  Have been assigned to employee ");
            viewAll();
          }
        )
      })
  }

  function removeEmployee() {
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "Enter employee id to Delete"
        },
  
        
  
  
  
  
      ])
      .then(function (answer) {
        connection.query(`
  
                  DELETE FROM employee 
                  WHERE ?
                
                  `
          ,
          {
            id: answer.id,
            
          },
  
  
  
          function (err) {
            if (err) throw err;
            console.log("Employee Name has been DELETED");
            removeRoll();
          }
        )
      })
  }

  function removeRoll() {
    inquirer
      .prompt([
        {
          name: "roleId",
          type: "input",
          message: "Enter Employee Id to Delete Pay & Position"
        },
  
        
  
  
  
  
      ])
      .then(function (answer) {
        connection.query(`
  
                  DELETE FROM role
                  WHERE ?
                
                  `
          ,
          {
            id: answer.roleId,
            
          },
  
  
  
          function (err) {
            if (err) throw err;
            console.log("Employee Pay and Postion have been DELETED");
            removeDepartment();
          }
        )
      })
  }
  
  function removeDepartment() {
    inquirer
      .prompt([
        {
          name: "deptatmentId",
          type: "input",
          message: "Enter Employee ID to Delete Department"
        },
  
        
  
  
  
  
      ])
      .then(function (answer) {
        connection.query(`
  
                  DELETE FROM department
                  WHERE ?
                
                  `
          ,
          {
            id: answer.deptatmentId,
            
          },
  
  
  
          function (err) {
            if (err) throw err;
            console.log("Employee has been DELETED");
            viewAll();
          }
        )
      })
  }
  

  