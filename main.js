document.addEventListener("DOMContentLoaded", () => {
    const employees = document.getElementById("employee-list");

    fetchEmployees(); // show employee info

    
    function fetchEmployees(){
        fetch("http://localhost:3000/employees")
        .then(response => response.json())
        .then(employees => employees.forEach(employee => displayEmployeeInfo(employee)));
    }  
    
    
    function displayEmployeeInfo(employee) {
        let employeeInfo = document.createElement("div");
        let nameAndLogin = document.createElement("li");
        let skill = document.createElement("span");
        
        nameAndLogin.textContent = `Name: ${employee.name} / Login: ${employee.login}`;
        skill.textContent = `Skill: ${employee.skill}`;
        
        employeeInfo.append(nameAndLogin, skill);
        employees.appendChild(employeeInfo);
    }
})
