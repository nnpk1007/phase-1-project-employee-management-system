document.addEventListener("DOMContentLoaded", () => {
  const employees = document.getElementById("employee-table");

  fetchEmployees(); // show employee info when page is load
  addEmployee(); // add new employee and save to db.json
  removeEmployees(); // remove employee adn update to db.json
  updateEmployeeSkill(); // update new skill for employee and save to db.json
  addWork(); // add employee to a work station and update to db.json
  displayEmployeeAtStation(); // show employee name at work station

  function fetchEmployees() {
    fetch("https://my-json-server.typicode.com/nnpk1007/phase-1-project-employee-management-system/db/employees")
    //fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => {
          createEmployeeElement(employee);
        })
      );
  }

  // make employee table
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

      // loop through row of table
      for (let i = 0; i < rows.length; i++) {
        let nameCell = rows[i].querySelectorAll("td")[0];
        let loginCell = rows[i].querySelectorAll("td")[1];

        // check if name exists
        if (nameCell && nameCell.textContent === employeeName.value) {
          alert("Employee name already exist");
          return;
        }
        // check if login exists
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

      // call function saveEmployee
      saveEmployee(newEmployee);
      addEmployeeForm.reset();
    });
  }

  function saveEmployee(newEmployee) {
    //  check if the skill field is a string and convert it to an array before saving it to the database
    if (typeof newEmployee.skill === "string") {
      newEmployee.skill = [newEmployee.skill];
    }
    // use POST method to update new employee to db.json
    fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((employee) => createEmployeeElement(employee)); // call function createEmployeeElement to create new employee
  }

  function removeEmployees() {
    const removeEmployeeBtn = document.getElementById("remove-employee-button");

    removeEmployeeBtn.addEventListener("click", (event) => {
      event.preventDefault();

      // get employee login value
      let employeeLogin = document.getElementById(
        "employee-login-remove"
      ).value;

      fetch(`http://localhost:3000/employees?login=${employeeLogin}`) // //retrieve the employee with the specified login
        .then((response) => response.json())
        .then((employees) => {
          // if employee login value is invalid, we can not fetch, the return by json will be empty
          if (employees.length === 0) {
            alert("Invalid employee login");
          }

          // only one employee match the employee login, so we can access the first employee object return by json
          let employeeId = employees[0].id;
          console.log(employeeId);

          // use employee ID to fetch data and DELETE method to delete that employee
          fetch(`http://localhost:3000/employees/${employeeId}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((removedEmployee) => {
              removeEmployeeRow(employeeLogin); // call removeEmployeeRow to remove employee from table
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

  function updateEmployeeSkill() {
    const updateEmployeeForm = document.getElementById("update-employee-form");

    updateEmployeeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      // get the values of employee login and new skill from the form
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
            // if the new skill is not already in the skills list, add it
            skills.push(employeeSkillUpdate);

            updateEmployee(employee.id, { skill: skills }); // call function updateEmployee
          } else {
            alert("Skill already exist");
          }
        })
        .catch((error) => console.log("Error fetching:", error));
      updateEmployeeForm.reset();
    });
  }

  function updateEmployee(employeeId, updateData) {
    // Make a PATCH request using employee Id
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
        // Pass the updated employee object to the updateEmployeeRow function
        updateEmployeeRow(updatedEmployee);
      })
      .catch((error) => console.log(`Error fetching:`, error));
  }

  function updateEmployeeRow(employee) {
    let employeeTable = document.getElementById("employee-table");
    let rows = employeeTable.getElementsByTagName("tr");

    // Loop through each row of the tabl
    for (let i = 0; i < rows.length; i++) {
      // Get the cell containing the login of the employee in row at td[1]
      let loginCell = rows[i].querySelectorAll("td")[1];

      if (loginCell && loginCell.textContent === employee.login) {
        // Update the skill cell of the current row with the updated skill
        rows[i].querySelectorAll("td")[2].textContent = employee.skill;
        break;
      }
    }
  }

  // This function retrieves all the employees from the database and returns an array of stations where employees are currently assigned to work.
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

  // This function handle adding a new work to an employee.
  function addWork() {
    const addWorkForm = document.getElementById("add-work-form");

    addWorkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      //  call the getStationArray() function, which retrieves an array of all assigned stations from the server.
      getStationArray().then((assignedStation) => {
        console.log(assignedStation);
        let employeeLogin = document.getElementById(
          "employee-login-add-work"
        ).value;
        let station = document.getElementById("station").value;
        // station value, for example is titan-1, so we need to split it and get the first index only
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
            // check if station name is not in skills
            if (!skills.includes(stationName)) {
              alert(
                `This employee does not have skill to work at ${stationName}`
              );
            }
            // check if station is already assigned
            else if (assignedStation.includes(station)) {
              alert(`${station} has been already assigned to another employee`);
            }
            // if workStation return true. that means this employee already assigned to a work station
            else if (workStation) {
              alert(`This employee is already at ${workStation}`);
            // if employee is not assigned to a station
            } else {
              workStation = station;
              // call function updateEmployee
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

  // This function retrieves a list of employees from the server and returns an object with key-value pairs 
  // where the key is the employee's name and the value is the station they are currently assigned to.
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
        // Return the object with the employees at stations
        return employeeAtStation;
      });
  }

  function createDeleteButton(elementLi, employeeId, updateData) {
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";

    deleteBtn.addEventListener("mouseover", () => {
      // Sets the originalColor property of the button to its original color 
      deleteBtn.originalColor = deleteBtn.style.color;
      // changes the button's text color to red.
      deleteBtn.style.color = "red";
    });

    deleteBtn.addEventListener("mouseout", () => {
      // Resets the button's text color to its original color.
      deleteBtn.style.color = deleteBtn.originalColor;
    });

    deleteBtn.addEventListener("click", function () {
      // Removes the corresponding list item from the HTML
      elementLi.remove();
      // calls the updateEmployee function to update the employee record in the database.
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
