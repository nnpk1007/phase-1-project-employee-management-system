console.log("JS is working")

fetch("http://localhost:3000/employees")
.then(response => response.json())
.then(data => console.log(data))

