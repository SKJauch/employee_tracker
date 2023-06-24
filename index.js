const inquirer = require("inquirer");
const db = require("./db/connection");
const util = require("util");
db.query = util.promisify(db.query);

function promptMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "view all depts",
          "view all roles",
          "view all employees",
          "add dept",
          "add role",
          "add employee",
          "update employee role",
          "exit",
        ],
      },
    ])
    .then((result) => {
      console.log(result);
      if (result.choice === "view all depts") {
        viewDepts();
      } else if (result.choice === "view all roles") {
        viewRoles();
      } else if (result.choice === "view all employees") {
        viewEmployees();
      } else if (result.choice === "add dept") {
        addDept();
      } else if (result.choice === "add role") {
        addRole();
      } else if (result.choice === "add employee") {
        addEmployee();
      } else if (result.choice === "update employee role") {
        updateEmployee();
      } else {
        db.close();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

promptMenu();

async function viewDepts() {
  const result = await db.query("select * from department");
  console.table(result);
  promptMenu();
}


async function viewRoles() {
  const result = await db.query("select * from role");
  console.table(result);
  promptMenu();
}

async function viewEmployees() {
  const result = await db.query("select * from employee");
  console.table(result);
  promptMenu();
}

async function addDept() {
  const deptData = await inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: "Enter the name of the department:",
    },
  ]);

  try {
    const query = "INSERT INTO department (name) VALUES (?)";
    await db.query(query, [deptData.deptName]);
    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error);
  }

  promptMenu(); 
}


async function addRole() {
  const departments = await db.query("SELECT * FROM department");

  const roleData = await inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the name of the role?",
    },
    {
      type: "number",
      name: "roleSalary",
      message: "What is the salary for the role?",
    },
    {
      type: "list",
      name: "deptId",
      message: "Which department does the role belong to?",
      choices: departments.map((dept) => ({
        name: dept.name,
        value: dept.id,
      })),
    },
  ]);

  try {
    const query =
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
    await db.query(query, [
      roleData.roleTitle,
      roleData.roleSalary,
      roleData.deptId,
    ]);
    console.log("Role added successfully!");
  } catch (error) {
    console.error("Error adding role:", error);
  }

  promptMenu();
}


async function addEmployee() {
  const roles = await db.query("SELECT * FROM role");
  const employees = await db.query("SELECT * FROM employee");

  const employeeData = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "managerId",
      message: "Who is the employee's manager?",
      choices: [
        { name: "None", value: null },
        ...employees.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        })),
      ],
    },
  ]);

  try {
    const query =
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    await db.query(query, [
      employeeData.firstName,
      employeeData.lastName,
      employeeData.roleId,
      employeeData.managerId,
    ]);
    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }

  promptMenu(); 
}


async function updateEmployee() {
  const employees = await db.query("SELECT * FROM employee");
  const roles = await db.query("SELECT * FROM role");

  const employeeData = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select the employee to update:",
      choices: employees.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      type: "list",
      name: "roleId",
      message: "Select the new role for the employee:",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);

  try {
    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
    await db.query(query, [employeeData.roleId, employeeData.employeeId]);
    console.log("Employee role updated successfully!");
  } catch (error) {
    console.error("Error updating employee role:", error);
  }

  promptMenu(); 
}


// function test () {
//     inquirer.prompt([{
//         type: "input",
//         message: "test",
//         name: "choice",

//     }])
//     .then (res => {
//         console.log(res)
//     })
// }
// test()
