# Read me

## Database

As seen in `backend\src\main\resources\application.properties` the java quarkus backend tries to connect to a postgres database running on port 5432 with user `multiflex_academy` and password `R0LvkvdE5gu41s8&@x07JZ@6O29@@^`. Quarkus will try to create all needed tables in the Database `multiflex`.

## File uploads

For file storage its required to have the folders "uploads" and "processed" in the backend root. The upload process works in two stages, first the uploaded file is stored in its original format in the "uploads" folder, in the second step the files are processed by ffmpeg and stored in small chunks in the "processed" folder. To take a closer look read `backend\src\main\java\repository\VideoFileRepository.java`, the code is pretty well documented.

Since we a) could not find guides on how to implement DASH streaming on quarkus and b) could not find a way to run the DASH file transformation in java alone. We use a library that acts as a wrapper around the command line tool "[ffmpeg](https://www.ffmpeg.org/download.html)" that needs to be present as "ffmpeg.exe" and "ffmprobe.exe" in a folder called "tools" in the backend root. There are linux builds available for ffmeg so it should hopefully be possible to run the file processing on a linux, but various code changes are required (one of which is that when inputing a file location to the ffmpeg wrapper libary the automatically generated File.separator constant used in all other paths does not work so it might be needed to change a "/" to a "\").

## Frontend

The frontend is an Angular website using angular material (pretty sparsely). All the icons are free fontawesome icons. Currently no font is set anywhere since the iptor company font avenir is paid. All the styling is done using SCSS. For dash streaming we use the libary DASH.js. 

## Security

Currently Users are stored in the app_users table and generally identified by their email. The password is hashed once in the frontend and then a second time in the backend. None of the actual endpoints are password protected but the login obviously is. The frontend has a route guard in place that hides part of the UI or redirects when trying to access pages if the users Role is not allowed to view it.

In the `backend\src\main\resources\application.properties` a load script is defined that either creates demo data for everything (import.sql) or only creates a admin user with email admin@admin and password admin. The admin can then see all newly created users under account/manage-users and change their roles or supervisors. The admin can also change and access all content, more on that in the featureList.md

## Tests

Due to time constraints on the project no actually test cases have been written, most of the complex code is well documented and we generally tried to write readable code. However there are parts that are pretty complex/unorganized especially in parts of the backend that take a while to understand.
