document.addEventListener("DOMContentLoaded", () => {
  const employees = document.getElementById("employee-table");

  updateEmployeeSkill();
  fetchEmployees(); // show employee info when page is load
  addEmployee(); // add new employee and save to db.json
  addWork();
  function fetchEmployees() {
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => createEmployeeElement(employee))
      );
  }

  function createEmployeeElement(employee) {
    let employeeRow = document.createElement("tr");
    let nameCell = document.createElement("td");
    let loginCell = document.createElement("td");
    let skillCell = document.createElement("td");

    nameCell.textContent = employee.name;
    loginCell.textContent = employee.login;
    skillCell.textContent = employee.skill;

    employeeRow.append(nameCell, loginCell, skillCell);
    employees.appendChild(employeeRow);
  }

  function addEmployee() {
    const addEmployeeForm = document.getElementById("add-employee-form");

    addEmployeeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let employeeName = document.getElementById("employee-name");
      let employeeLogin = document.getElementById("employee-login");
      let employeeSkill = document.getElementById("employee-skill");

      let newEmployee = {
        name: employeeName.value,
        login: employeeLogin.value,
        skill: employeeSkill.value,
      };
      saveEmployee(newEmployee);

      addEmployeeForm.reset();
    });
  }

  function saveEmployee(newEmployee) {
    fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((employee) => createEmployeeElement(employee));
  }

  function updateEmployee(employeeId, updateData) {
    fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    })
    .then(response => response.json())
    .then(updatedEmployee => {
      alert(`Updated employee: ${JSON.stringify(updatedEmployee)}`);
      updateEmployeeRow(updatedEmployee);
    })
    .catch(error => console.log(`Error fetching:`, error));
  }

  function updateEmployeeSkill() {
    const updateEmployeeForm = document.getElementById("update-employee-form");

    updateEmployeeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let employeeLogin = document.getElementById(
        "employee-login-update"
      ).value;
      let employeeSkillUpdate = document.getElementById(
        "employee-skill-update"
      ).value;

      fetch(`http://localhost:3000/employees?login=${employeeLogin}`) //retrieve the employee with the specified login
        .then((response) => response.json())
        .then((employees) => {
          // only one employee match the employee login, so we can access the first employee object return by json
          let employee = employees[0];
          let login = employee.login;
          let skills = employee.skill;
          console.log(skills);

          if (
            employeeLogin === login &&
            !skills.includes(employeeSkillUpdate)
          ) {
            skills.push(employeeSkillUpdate);

            updateEmployee(employee.id, {skill: skills})
            
            updateEmployeeForm.reset();
          } else {
            alert("Employee not found");
          }
        })
        .catch((error) => console.log(`Error fetching:`, error));
    });
  }

  function updateEmployeeRow(updateEmployee) {
    const employees = document.getElementById("employee-table");
    let rows = employees.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let loginCell = rows[i].querySelectorAll("td")[1];

      if (loginCell && loginCell.textContent === updateEmployee.login) {
        rows[i].querySelectorAll("td")[2].textContent = updateEmployee.skill;
        break;
      }
    }
  }
});
