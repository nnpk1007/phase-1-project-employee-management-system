document.addEventListener("DOMContentLoaded", () => {
  const employees = document.getElementById("employee-table");

  updateEmployeeSkill();
  addWork();
  fetchEmployees(); // show employee info when page is load
  addEmployee(); // add new employee and save to db.json
  removeEmployees();
  // show employee at station when the page first load
  displayEmployeeAtStation();

  function fetchEmployees() {
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => {
          createEmployeeElement(employee);
        })
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
      let employeeTable = document.getElementById("employee-table");
      let rows = employeeTable.getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        let nameCell = rows[i].querySelectorAll("td")[0];
        let loginCell = rows[i].querySelectorAll("td")[1];

        if (nameCell && nameCell.textContent === employeeName.value) {
          alert("Employee name already exist");
          return;
        }
        if (loginCell && loginCell.textContent === employeeLogin.value) {
          alert("Employee login already exists");
          return;
        }
      }

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

  function removeEmployees() {
    const removeEmployeeBtn = document.getElementById("remove-employee-button");

    removeEmployeeBtn.addEventListener("click", (event) => {
      let employeeLogin = document.getElementById(
        "employee-login-remove"
      ).value;
      event.preventDefault();

      fetch(`http://localhost:3000/employees?login=${employeeLogin}`)
        .then((response) => response.json())
        .then((employees) => {
          if (employees.length === 0) {
            alert("Invalid employee login");
          }
          let employeeId = employees[0].id;
          console.log(employeeId);

          fetch(`http://localhost:3000/employees/${employeeId}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((removedEmployee) => {
              removeEmployeeRow(employeeLogin);
              console.log(removedEmployee);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    });
  }

  function removeEmployeeRow(employeeLogin) {
    let employeeTable = document.getElementById("employee-table");
    let rows = employeeTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let loginCell = rows[i].querySelectorAll("td")[1];

      if (loginCell && loginCell.textContent === employeeLogin) {
        rows[i].remove();
        break;
      }
    }
  }

  function updateEmployeeRow(employee) {
    let employeeTable = document.getElementById("employee-table");
    let rows = employeeTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      let loginCell = rows[i].querySelectorAll("td")[1];

      if (loginCell && loginCell.textContent === employee.login) {
        rows[i].querySelectorAll("td")[2].textContent = employee.skill;
        break;
      }
    }
  }

  function updateEmployee(employeeId, updateData) {
    return fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((updatedEmployee) => {
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
          if (employees.length === 0) {
            alert("Invalid employee login");
          }
          // only one employee match the employee login, so we can access the first employee object return by json
          let employee = employees[0];
          let skills = employee.skill;
          console.log(skills);

          if (!skills.includes(employeeSkillUpdate)) {
            skills.push(employeeSkillUpdate);

            updateEmployee(employee.id, { skill: skills });
          } else {
            alert("Skill already exist");
          }
        })
        .catch((error) => console.log("Error fetching:", error));
      updateEmployeeForm.reset();
    });
  }

  function getStationArray() {
    return fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) => {
        let stations = [];
        employees.forEach((employee) => {
          if (employee.station) {
            stations.push(employee.station);
          }
        });
        return stations;
      });
  }

  function addWork() {
    const addWorkForm = document.getElementById("add-work-form");

    addWorkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      getStationArray().then((assignedStation) => {
        console.log(assignedStation);
        let employeeLogin = document.getElementById(
          "employee-login-add-work"
        ).value;
        let station = document.getElementById("station").value;
        let stationName = station.split("-")[0];

        fetch(`http://localhost:3000/employees?login=${employeeLogin}`) //retrieve the employee with the specified login
          .then((response) => response.json())
          .then((employees) => {
            if (employees.length === 0) {
              alert("Invalid employee login");
            }

            let employee = employees[0];
            let skills = employee.skill;
            let workStation = employee.station;

            if (!skills.includes(stationName)) {
              alert(
                `This employee does not have skill to work at ${stationName}`
              );
            } else if (assignedStation.includes(station)) {
              alert(`${station} has been already assigned to another employee`);
            } else if (workStation) {
              alert(`This employee is already at ${workStation}`);
            } else {
              workStation = station;
              updateEmployee(employee.id, { station: workStation }).then(() => {
                // update the list of employees at each station
                displayEmployeeAtStation();
              });
            }
          })
          .catch((error) => console.log("Error fetching:", error));
        addWorkForm.reset();
      });
    });
  }

  function getEmployeesStationsObj() {
    let employeeAtStation = {};
    return fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) => {
        employees.forEach((employee) => {
          if (employee.station) {
            employeeAtStation[employee.name] = employee.station;
          }
        });
        return employeeAtStation;
      });
  }

  function createDeleteButton(elementLi, employeeId, updateData) {
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";

    deleteBtn.addEventListener("mouseover", () => {
      deleteBtn.originalColor = deleteBtn.style.color;
      deleteBtn.style.color = "red";
    });

    deleteBtn.addEventListener("mouseout", () => {
      deleteBtn.style.color = deleteBtn.originalColor;
    });

    deleteBtn.addEventListener("click", function () {
      elementLi.remove();
      updateEmployee(employeeId, updateData);
    });

    elementLi.appendChild(deleteBtn);
  }

  function displayEmployeeAtStation() {
    getEmployeesStationsObj().then((employees) => {
      let stations = document.querySelectorAll(".employees-at-position");

      // loop through each station in HTML
      stations.forEach((station) => {
        let stationName = station.dataset.position;
        let employeeAtStation = Object.keys(employees).filter(
          (key) => employees[key] === stationName
        );
        // Clear the previous list of employees at this station
        station.textContent = "";
        // Generate the list of employees for this position
        employeeAtStation.forEach((employee) => {
          let li = document.createElement("li");
          li.style.color = "limegreen";
          li.textContent = employee + " ";
          station.appendChild(li);

          fetch(`http://localhost:3000/employees?name=${employee}`)
            .then((response) => response.json())
            .then((employees) => {
              // Check if there is at least one employee in the array
              if (employees.length > 0) {
                let employeeId = employees[0].id; // get the employee id from the response
                createDeleteButton(li, employeeId, { station: "" });
              }
            });
        });
      });
    });
  }
});
