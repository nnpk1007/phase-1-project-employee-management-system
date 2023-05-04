document.addEventListener("DOMContentLoaded", () => {
  const employees = document.getElementById("employee-table");

  updateEmployeeSkill();
  addWork();
  fetchEmployees(); // show employee info when page is load
  addEmployee(); // add new employee and save to db.json

  function fetchEmployees() {
    
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => {
          createEmployeeElement(employee) 
          
        })
    );
    
  }

  function fetchStations() {
    let stations = []
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => {
           stations.push(employee.station)
          
        })
    );
    return stations;
  }

  function createEmployeeElement(employee) {
    let employeeRow = document.createElement("tr");
    let nameCell = document.createElement("td");
    let loginCell = document.createElement("td");
    let skillCell = document.createElement("td");
    let stationCell = document.createElement("td");
    
    nameCell.textContent = employee.name;
    loginCell.textContent = employee.login;
    skillCell.textContent = employee.skill;
    stationCell.textContent = employee.station;
    employeeRow.append(nameCell, loginCell, skillCell, stationCell);
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
    //  check if the skill field is a string and convert it to an array before saving it to the database
    if (typeof newEmployee.skill === "string") {
      newEmployee.skill = [newEmployee.skill];
    }

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

  function updateEmployeeRow(updateEmployee) {
    const employees = document.getElementById("employee-table");
    let rows = employees.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let loginCell = rows[i].querySelectorAll("td")[1];

      if (loginCell && loginCell.textContent === updateEmployee.login) {
        rows[i].querySelectorAll("td")[2].textContent = updateEmployee.skill;
        rows[i].querySelectorAll("td")[3].textContent = updateEmployee.station;
        break;
      }
    }
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
      .then((response) => response.json())
      .then((updatedEmployee) => {
        //alert(`Updated employee: ${JSON.stringify(updatedEmployee)}`);
        updateEmployeeRow(updatedEmployee);
      })
      .catch((error) => console.log(`Error fetching:`, error));
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
          let skills = employee.skill;
          console.log(skills);

          if (!skills.includes(employeeSkillUpdate)) {
            skills.push(employeeSkillUpdate);

            updateEmployee(employee.id, { skill: skills });
          } else {
            alert("Employee not found");
          }
        })
        .catch((error) => alert("Invalid Employee Login"));
      updateEmployeeForm.reset();
    });
  }

  function addWork() {
    const addWorkForm = document.getElementById("add-work-form");
    let assignedStation = fetchStations();
    console.log(assignedStation);
    addWorkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let employeeLogin = document.getElementById(
        "employee-login-add-work"
      ).value;
      let station = document.getElementById("station").value;
      let stationName = station.split("-")[0];
      //console.log(employeeLogin, station);
      fetch(`http://localhost:3000/employees?login=${employeeLogin}`) //retrieve the employee with the specified login
        .then((response) => response.json())
        .then((employees) => {
          let employee = employees[0];
          let name = employee.name;
          let skills = employee.skill;
          //console.log(skills);
          let workStation = employee.station;

          if (!skills.includes(stationName)) {
            alert(
              `This employee does not have skill to work at ${stationName}`
            );
          }
          else if (assignedStation.includes(station)) {
            alert(`${station} has been already assigned to another employee`)
          } else if (workStation) {
            alert(`This employee is already at ${workStation}`);
          } else {
            workStation = station;
            updateEmployee(employee.id, { station: workStation });
            
          }
        })
        .catch((error) => alert("Invalid Employee Login"));
    });
  }
   
});
