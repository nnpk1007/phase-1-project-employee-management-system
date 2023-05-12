# PHASE 1 PROJECT : <br> EMPLOYEE MANAGEMENT SYSTEM

I’m working at an Amazon warehouse, and we print books at this warehouse. Every day, when our shift start, the manager will put our name tags on the labor board and we will know which station we will work at. I sometimes see my manager take a photo of the labor board by their phone, and when they need to move employees to another station, if they’re not at the labor board, they use their phone and zoom out the photo to check which station they can move employee to. What an inconvenient. As a software developer, I think why don’t I make a web app so we can manage employee more easily.

## INSTALLATION:

Clone this repository and change directory into this project folder. Then run:

Mac: `open index.html`<br>
Windows: `explorer.exe index.html`

Note : this project is using render.com to host db.json.

## USAGE:

You can see all the employee’s name, login and skills show up when the page loaded

![employees info](/readme_photo/employees.png)

You can add or remove an employee. If the name or login already exists, or you don’t choose a skill from select, the system will send you an alert.

![add-remove employee](/readme_photo/add-remove.png)

And then you can give employee new skill, or you can add employee to a work station

![update new skill or add to work station](/readme_photo/update.png)

When an employee has been added to a work station, their name will show up.

![work station](/readme_photo/station.png)

If you want to remove employee from work station, just simply click the x button next to employee name.

Every time you add, remove or update, the data will be updated in the db.json file.


## LICENSE:

MIT
