# PHASE 1 PROJECT : <br> EMPLOYEE MANAGEMENT SYSTEM

I’m working at an Amazon warehouse, and we print books at this warehouse. Every day, when our shift start, the manager will put our name tags on the labor board and we will know which station we will work at. I sometimes see my manager take a photo of the labor board by their phone, and when they need to move employees to another station, if they’re not at the labor board, they use their phone and zoom out the photo to check which station they can move employee to. What an inconvenient. As a software developer, I think why don’t I make a web app so we can manage employee more easily.

## INSTALLATION:

Clone this repository and change directory into this project folder. Then run:

Mac: `open index.html`<br>
Windows: `explorer.exe index.html`

This project is using render.com to host db.json. Please note that there might be occasional delays in data loading.

## FEATURES:

### 1. Displaying Employee Information:
    . When the page is loaded, the system fetches employee data from the server and displays it in a table.
    . Each employee's name, login, and skill are shown in separate columns.

![employees info](/readme_photo/first_load.gif)

### 2. Adding Employees:
    . The system allows users to add new employees using a form.
    . It checks if the employee's name and login already exist in the table to avoid duplicates.
    . If the input is valid, the system saves the new employee to the database and updates the table accordingly.

![](/readme_photo/add_employee.gif)

### 3. Removing Employees:
    . Users can remove employees from the system by entering the employee's login.
    . The system retrieves the employee with the specified login from the server and deletes it from the database.
    . The corresponding row in the table is also removed.

![](/readme_photo/remove_employee.gif)

### 4. Updating Employee Skills:
    . The system enables users to update an employee's skills.
    . Users provide the employee's login and the new skill through a form.
    . The system fetches the employee from the server, checks if the new skill already exists, and updates the employee's skill accordingly.
    . The updated skill is then displayed in the table.

![](/readme_photo/upgrade_skill.gif)

### 5. Assigning Employees to Work Stations:
    . Users can assign employees to work stations.
    . The system fetches a list of assigned work stations from the server.
    . Users provide the employee's login and select a work station from the available options.
    . The system verifies if the selected work station is already assigned to another employee, if the employee is already assigned to a work station.

![](/readme_photo/add_to_station1.gif)

    . And check if the employee has the required skill.
    . If the conditions are met, the employee is assigned to the work station and the information is saved in the database.
    . The list of employees at each work station is updated and displayed.

![](/readme_photo/add_to_station_2.gif)


### 6. Remove employee from work station:
    . Users can remove employees from work stations by simply clicking the "x" button next to employee's name.

![](/readme_photo/remove_from_station.gif)

## LICENSE:

MIT
