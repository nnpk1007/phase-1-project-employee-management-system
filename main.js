document.addEventListener("DOMContentLoaded", () => {
  const employees = document.getElementById("employee-table");

  fetchEmployees(); // show employee info

  function fetchEmployees() {
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((employees) =>
        employees.forEach((employee) => displayEmployeeInfo(employee))
      );
  }

  function displayEmployeeInfo(employee) {
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
});
